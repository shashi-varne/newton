import React, { useState, useEffect } from 'react';
import Container from '../../common/Container';
import Input from 'common/ui/Input';
import toast from 'common/ui/Toast'
import { numDifferentiationInr } from 'utils/validators';
import {
  navigate as navigateFunc,
  getCorpusValue,
  validateOtAmount,
  validateSipAmount,
  selectTitle,
  getMonthlyCommitmentNew,
} from '../common/commonFunctions';
import { get_recommended_funds } from '../common/api';
import { isArray } from 'lodash';

import { getConfig } from '../../../utils/functions';
import { 
  formatAmountInr, 
  convertInrAmountToNumber 
} from '../../../utils/validators';
import useFunnelDataHook from '../common/funnelDataHook';
import './mini-components.scss';

const date = new Date();
const month = date.getMonth();
const riskEnabledFunnel = getConfig().riskEnabledFunnels;

const InvestAmount = (props) => {
  const {
    funnelData,
    funnelGoalData,
    updateFunnelData,
    setUserRiskProfile
  } = useFunnelDataHook();
  const { investType, year, equity, term, isRecurring, investTypeDisplay } = funnelData;
  const [amount, setAmount] = useState(
    funnelData?.userEnteredAmt ||
    funnelData?.amount ||
    ''
  );
  const [title, setTitle] = useState('');
  const [corpus, setCorpus] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loader, setLoader] = useState(false);
  const [saveTaxYear, setSaveTaxYear] = useState(date.getFullYear());
  const navigate = navigateFunc.bind(props);
  useEffect(() => {
    const investTitle = selectTitle(investType);
    setTitle(investTitle);
    if (!amount && investType === 'saveforgoal') {
      setAmount(
        getMonthlyCommitmentNew(term, funnelData.corpus, funnelData.equity)
      );
    }
    if (funnelGoalData.id === "savetax") {
      const currentMonth = month + 1;
      if (currentMonth > 3) {
        setSaveTaxYear(year => year + 1);
      }
    }
  }, []);

  const handleChange = (e) => {
    let value = e.target.value || "";
    // eslint-disable-next-line radix
    value = parseInt(convertInrAmountToNumber(value));
    if (!isNaN(value)) {
      setAmount(value);
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
    if (funnelGoalData.id === "savetax") {
      calculateTax(funnelData?.corpus);
    } else {
      const valueOfCorpus = getCorpusValue(
        equity,
        amount,
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
        term: funnelData?.term,
        rp_enabled: riskEnabledFunnel,
      };
      setLoader("button");
      if (investType === "saveforgoal") {
        params.subtype = funnelData?.subtype;
      }
      const data = await get_recommended_funds(params);
      setLoader(false);
      
      if (!data.recommendation) {
        // RP enabled flow, when user has no risk profile
        setUserRiskProfile(''); // clearing risk profile stored in session
        if (data.msg_code === 0) {
          navigate(`${funnelGoalData.id}/risk-select`);
        } else if (data.msg_code === 1) {
          navigate(`${funnelGoalData.id}/risk-select-skippable`);
        }
        return;
      }
      
      updateFunnelData({ ...data, userEnteredAmt: amount })
      
      if (isArray(data.recommendation)) {
        // RP enabled flow, when user has risk profile and recommendations fetched successfully
        setUserRiskProfile(data.rp_indicator || '');
        navigate('recommendations');
      } else {
        // RP disabled flow
        navigate(`${funnelGoalData.id}/funds`);
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
    // let d = new Date();
    // let month = d.getMonth();
    const currentMonth = month;
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
    let taxsaved = tempAmount * 0.312;
    setCorpus(taxsaved);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      buttonTitle='NEXT'
      title={title}
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
              investTypeDisplay === 'sip' ||
              funnelGoalData.itype === 'saveforgoal'
             ) ? 
             'per month' : 'from my savings'
            }
          </p>
        </div>
        {!riskEnabledFunnel &&
          <div className='invest-amount-corpus'>
            <div className='invest-amount-corpus-duration'>
              {funnelGoalData.id === 'savetax' ?
                `till Mar ${saveTaxYear} to save tax upto:` : `Corpus in ${year}`
              }
            </div>
            <div className='invest-amount-corpus-amount'>{numDifferentiationInr(corpus)}</div>
          </div>
        }
      </section>
    </Container>
  );
};
export default InvestAmount;
