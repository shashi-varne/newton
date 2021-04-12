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
import { isArray } from 'lodash';

import './style.scss';
import { getConfig } from '../../../../utils/functions';
import { formatAmountInr } from '../../../../utils/validators';
const date = new Date();

const InvestAmount = (props) => {
  const graphData = storageService().getObject('graphData');
  const goalRecommendation = storageService().getObject('goalRecommendations');
  const { investType, year, equity, term, isRecurring, investTypeDisplay, ...moreData } = graphData;
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
    // eslint-disable-next-line radix
    value = parseInt(convertInrAmountToNumber(value));
    if (!isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(''); // TODO: are we sure we want to send empty string here?
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
      // ? Shouldn't this check be made even for 'parkmymoney'
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
        equity,
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
        term: graphData?.term,
        rp_enabled: getConfig().riskEnabledFunnels,
      };
      setLoader("button");
      if (investType === "saveforgoal") {
        params.subtype = graphData?.subtype;
        delete params.amount;
      } else if (investType === 'investsurplus') {
        graphData['term'] = 3;
        params.term = 3; // TODO: Remove hardcoding later
      }
      const data = await get_recommended_funds(params);
      setLoader(false);
      
      if (!data.recommendation) {
        // RP enabled flow, when user has no risk profile
        storageService().remove('userSelectedRisk');
        if (data.msg_code === 0) {
          navigate(`${goalRecommendation.id}/risk-select`);
        } else if (data.msg_code === 1) {
          navigate(`${goalRecommendation.id}/risk-select-skippable`);
        }
        return;
      }
      
      storageService().setObject('graphData', {
        ...graphData, ...data, amount, recommendedTotalAmount: data.amount
      });
      
      if (isArray(data.recommendation)) {
        // RP enabled flow, when user has risk profile and recommendations fetched successfully
        storageService().set('userSelectedRisk', data.rp_indicator);
        navigate('recommendations');
      } else {
        // RP disabled flow
        navigate(`${goalRecommendation.id}/funds`, { ...graphData, amount });
      }
    } catch (err) {
      console.log(err);
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
      hidePageTitle
      title={graphData.name}
      disable={error}
      showLoader={loader}
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
          <p className='invest-amount-input-duration'>
            {(
              investTypeDisplay !== 'sip' ||
              goalRecommendation.itype !== 'saveforgoal'
             ) ? 
              'from my savings' : 'per month'
            }
          </p>
        </div>
        <div className='invest-amount-corpus'>
          <div className='invest-amount-corpus-duration'>
            {goalRecommendation.id === 'savetax' ?
              'till Mar {date.getFullYear()} to save tax upto:' : `Corpus in ${year}`
            }
          </div>
          <div className='invest-amount-corpus-amount'>{numDifferentiationInr(corpus)}</div>
        </div>
      </section>
    </Container>
  );
};
export default InvestAmount;
