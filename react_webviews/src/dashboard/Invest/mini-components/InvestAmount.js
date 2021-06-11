import React, { useState, useEffect } from 'react';
import Container from '../../common/Container';
import Input from 'common/ui/Input';
import toast from 'common/ui/Toast'
import { numDifferentiationInr } from 'utils/validators';
import {
  getCorpusValue,
  validateOtAmount,
  validateSipAmount,
  selectTitle,
  getMonthlyCommitmentNew,
} from '../common/commonFunctions';
import { get_recommended_funds } from '../common/api';
import { isArray } from 'lodash';

import { getConfig, navigate as navigateFunc } from '../../../utils/functions';
import { 
  formatAmountInr, 
  convertInrAmountToNumber 
} from '../../../utils/validators';
import useFunnelDataHook from '../common/funnelDataHook';
import './mini-components.scss';
import { nativeCallback } from '../../../utils/native_callback';
import { flowName } from '../constants';

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
  const [userEnteredAmt, setUserEnteredAmt] = useState(
    funnelData?.userEnteredAmt ||
    funnelData?.amount ||
    ''
  );
  const [title, setTitle] = useState('');
  const [corpus, setCorpus] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loader, setLoader] = useState(false);
  const [amountChanged, setAmountChanged]= useState(false);
  const [saveTaxYear, setSaveTaxYear] = useState(date.getFullYear());
  const navigate = navigateFunc.bind(props);

  useEffect(() => {
    const investTitle = selectTitle(investType);
    setTitle(investTitle);
    if (!userEnteredAmt && investType === 'saveforgoal') {
      setUserEnteredAmt(
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
    setAmountChanged(true);
    let value = e.target.value || "";
    // eslint-disable-next-line radix
    value = parseInt(convertInrAmountToNumber(value));
    if (!isNaN(value)) {
      setUserEnteredAmt(value);
    } else {
      setUserEnteredAmt('');
      setCorpus(0);
    }
  };

  useEffect(() => {
    if (!userEnteredAmt) {
      setErrorMsg('This is a required field');
      setError(true);
      return;
    }
    if (isNaN(userEnteredAmt)) {
      return;
    }
    if(error){
      setError(false);
    }
    let result;
    if (investTypeDisplay === "sip") {
      result = validateSipAmount(userEnteredAmt);
    } else {
      result = validateOtAmount(userEnteredAmt);
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
        userEnteredAmt,
        isRecurring,
        term
      );
      setCorpus(valueOfCorpus);
    }
  }, [userEnteredAmt]);

  const fetchRecommendedFunds = async () => {
    try {
      const params = {
        amount: userEnteredAmt,
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
        updateFunnelData({ corpus, userEnteredAmt });
        if (data.msg_code === 0) {
          navigate(`/invest/${funnelGoalData.id}/risk-select`);
        } else if (data.msg_code === 1) {
          navigate(`/invest/${funnelGoalData.id}/risk-select-skippable`);
        }
        return;
      }
      
      updateFunnelData({ ...data, corpus, userEnteredAmt})
      
      if (isArray(data.recommendation)) {
        // RP enabled flow, when user has risk profile and recommendations fetched successfully
        setUserRiskProfile(data.rp_indicator || '');
        navigate('/invest/recommendations');
      } else {
        // RP disabled flow
        navigate(`/invest/${funnelGoalData.id}/funds`);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
      toast(err)
    }
  };

  const goNext = () => {
    sendEvents('next')
    if (!userEnteredAmt) {
      return;
    }
    fetchRecommendedFunds();
  };

  const calculateTax = (eligibleAmount) => {
    const currentMonth = month;
    let duration = currentMonth > 3 ? 15 - currentMonth : 3 - currentMonth;
    if (duration === 0) {
      duration = 1;
    }
    let tempAmount = 0;
    if (investType === "savetaxsip") {
      tempAmount = userEnteredAmt;
      tempAmount = tempAmount * duration;
    } else {
      tempAmount = userEnteredAmt;
    }
    if (tempAmount > eligibleAmount) {
      tempAmount = eligibleAmount;
    }
    let taxsaved = tempAmount * 0.312;
    setCorpus(taxsaved);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "select invest amount",
        "amount": userEnteredAmt || "",
        "flow": funnelData.flow || flowName[funnelData.investType] || ""
        }
    };
    if(funnelData.investType === 'saveforgoal')
    {
      eventObj.properties["goal_purpose"] = funnelData.subtype || "";
      eventObj.properties['amount_changed'] = amountChanged ? "yes" : "no";
    }
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
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
        <p className="invest-amount-input-head">
            {funnelGoalData.itype === "saveforgoal"
              ? " I can set aside"
              : "I want to invest"}
          </p>
          <div className='invest-amount-container'>
            <Input
              id='invest-amount'
              class='invest-amount-num'
              value={userEnteredAmt ? formatAmountInr(userEnteredAmt) : ""}
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
