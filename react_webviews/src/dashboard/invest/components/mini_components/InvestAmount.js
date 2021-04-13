import React, { useState, useEffect } from 'react';
import Container from '../../../common/Container';
import Input from 'common/ui/Input';
import toast from 'common/ui/Toast'

import { storageService, numDifferentiationInr } from 'utils/validators';
import {
  navigate as navigateFunc,
  corpusValue,
  validateOtAmount,
  validateSipAmount,
  selectTitle,
  convertInrAmountToNumber,
} from '../../common/commonFunction';
import { get_recommended_funds } from '../../common/api';

import './style.scss';
import { formatAmountInr } from '../../../../utils/validators';
const date = new Date();

const InvestAmount = (props) => {
  const graphData = storageService().getObject('graphData');
  const goalRecommendation = storageService().getObject('goalRecommendations');
  const { investType, year, stockSplit, term, isRecurring, investTypeDisplay,...moreData } = graphData;
  const [amount, setAmount] = useState(graphData?.amount || '');
  const [title, setTitle] = useState('');
  const [corpus, setCorpus] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loader, setLoader] = useState(false);
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    const investTitle = selectTitle(investType);
    setTitle(investTitle);
  }, []);

  const handleChange = (e) => {
    let value = e.target.value || "";
    value = convertInrAmountToNumber(value);
    // eslint-disable-next-line radix
    if (!isNaN(parseInt(value))) {
      // eslint-disable-next-line radix
      setAmount(parseInt(value));
    } else {
      setAmount('');
      setCorpus(0);
    }
  };

  useEffect(() => {
    if (!amount) {
      setErrorMsg('This is a required field');
      setError(true);
      return;
    }
    if (isNaN(amount)) {
      return;
    }
    if(error){
      setError(false);
    }
    if(goalRecommendation.itype !== "saveforgoal"){

      let result;
      if (investTypeDisplay === "sip") {
        result = validateSipAmount(amount);
      } else {
        result = validateOtAmount(amount);
      }
      if (result?.error) {
        setError(true);
        setErrorMsg(result?.message);
      } else {
        setErrorMsg('');
        setError(false);
      }
    }
    if (goalRecommendation.id === "savetax") {
      calculateTax(graphData?.corpus);
    } else {
      const valueOfCorpus = corpusValue(
        stockSplit,
        amount,
        goalRecommendation.id,
        isRecurring,
        term
      );
      setCorpus(valueOfCorpus);
    }
  }, [amount]);

  const fetchRecommendedFunds = async () => {
    try {
      const params = {
        amount,
        type: investType,
      };
      setLoader("button");
      if (investType === "saveforgoal") {
        params.subtype = graphData?.subtype;
        params.term = graphData?.term;
      } else if (investType === 'investsurplus') {
        graphData['term'] = 3;
        params.term = 3; //  has to be modified (temp value)
      }
      await get_recommended_funds(params);
      storageService().setObject('graphData', { ...graphData, amount });
      setLoader(false);
      navigate(`${goalRecommendation.id}/funds`, { ...graphData, amount });
    } catch (err) {
      setLoader(false);
      toast(err)
    }
  };

  const goNext = () => {
    if (!amount) {
      return;
    }
    fetchRecommendedFunds();
  };

  const calculateTax = (eligibleAmount) => {
    let d = new Date();
    let month = d.getMonth();
    let currentMonth = month;
    let duration = currentMonth > 3 ? 15 - currentMonth : 3 - currentMonth;
    if (duration === 0) {
      duration = 1;
    }
    let tempAmount = 0;
    if (investType === "savetaxsip") {
      tempAmount = amount;
      tempAmount = tempAmount * duration;
    } else {
      tempAmount = amount;
    }
    if (tempAmount > eligibleAmount) {
      tempAmount = eligibleAmount;
    }
    let taxsaved = tempAmount * 0.303;
    setCorpus(taxsaved);
  };
  return (
    <Container
      classOverRide='pr-error-container'
      buttonTitle='NEXT'
      title={graphData.name}
      disable={error}
      showLoader={loader}
      title={title}
      handleClick={goNext}
      classOverRideContainer='pr-container'
    >
      <section className='invest-amount-common'>
        <div className='invest-amount-input'>
          <p className='invest-amount-input-head'>I want to invest</p>
          <div className='invest-amount-container'>
            <Input
              id='invest-amount'
              class='invest-amount-num'
              value={amount ? formatAmountInr(amount) : ""}
              onChange={handleChange}
              type='text'
              error={error}
              helperText={error && errorMsg}
              autoFocus
              inputMode='numeric'
              pattern='[0-9]*'
            />
          </div>
          { investTypeDisplay === "sip" || goalRecommendation.itype === "saveforgoal" ? (
            <p className='invest-amount-input-duration'>per month</p>
            ) : (
            <p className='invest-amount-input-duration'>from my savings</p>
            )
          }
        </div>
        <div className='invest-amount-corpus'>
          {goalRecommendation.id === "savetax" ? (
            <div className='invest-amount-corpus-duration'>
              till Mar {date.getFullYear()} to save tax upto:
            </div>
          ) : (
            <div className='invest-amount-corpus-duration'>Corpus in {year}:</div>
          )}
          <div className='invest-amount-corpus-amount'>{numDifferentiationInr(corpus)}</div>
        </div>
      </section>
    </Container>
  );
};
export default InvestAmount;
