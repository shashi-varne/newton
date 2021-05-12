import React, { useState, useEffect } from 'react';
import Container from '../../common/Container';
import toast from 'common/ui/Toast'

import withdraw_anytime_icon from 'assets/withdraw_anytime_icon.png';
import no_lock_in_icon from 'assets/no_lock_in_icon.png';
import monthly_sip_icon_dark from 'assets/monthly_sip_icon_dark.png';
import one_time_icon_dark from 'assets/one_time_icon_dark.png';

import { formatAmountInr } from 'utils/validators';
import { getReturnRates, navigate as navigateFunc, selectTitle } from '../common/commonFunctions';
import { get_recommended_funds } from '../common/api';
import './mini-components.scss';
import PeriodWiseReturns from '../../mini-components/PeriodWiseReturns';
import EquityDebtSlider from './EquityDebtSlider';
import useFunnelDataHook from '../common/funnelDataHook';
import { nativeCallback } from '../../../utils/native_callback';

const { stockReturns, bondReturns } = getReturnRates();

const InvestedAmount = (props) => {
  const {
    funnelData,
    funnelGoalData,
    updateFunnelData,
    setUserRiskProfile
  } = useFunnelDataHook();
  const { investType, term, equity, isRecurring, investTypeDisplay } = funnelData;
  const amount = funnelData.userEnteredAmt || funnelData.amount;
  const [stockSplitVal, setStockSplitVal] = useState(equity || 0);
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState('');
  const navigate = navigateFunc.bind(props);
  useEffect(() => {
    const investTitle = selectTitle(investType);
    setTitle(investTitle);
  }, []);

  const handleChange = (value) => {
    setStockSplitVal(value);
  };

  const fetchRecommendedFunds = async () => {
    const params = {
      amount,
      type: investType,
      equity: stockSplitVal,
      debt: 100 - stockSplitVal,
      term: term,
    };
    if (investType === 'saveforgoal') {
      params.subtype = funnelData?.subtype;
    }
    try {
      setLoader("button");
      const data = await get_recommended_funds(params);
      setUserRiskProfile(data.rp_indicator);
      updateFunnelData({
        ...data,
        equity: stockSplitVal,
        debt: 100 - stockSplitVal,
      });
      setLoader(false);
      navigate(`recommendations`);
    } catch (err) {
      setLoader(false);
      toast(err)
    }
  };

  const showFunds = () => {
    sendEvents('next')
    fetchRecommendedFunds();
  };

  const sendEvents = (userAction) => {
    var risk = "high"
    if (funnelData.investType === 'arbitrage') {
      risk = "moderate";
    } else {
      if (stockSplitVal <= 50) {
        risk = "low";
      } else if (stockSplitVal > 50 && stockSplitVal <= 70) {
        risk = "moderate";
      }
    }
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "projected value",
        "years": term,
        "risk apetite": risk,
        "flow": funnelData.flow || funnelData.investType || "",
        }
    };
    if (funnelData.investType === "saveforgoal") {
      eventObj.properties['goal_purpose'] = funnelData.subtype || "";
    }
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      classOverRide='pr-error-container'
      events={sendEvents("just_set_events")}
      buttonTitle='SHOW MY FUNDS'
      title={title}
      handleClick={showFunds}
      classOverRideContainer='pr-container'
      showLoader={loader}
    >
      <section className='invested-amount-common-container'>
        <div className='invested-amount-display'>
          <div className='invested-amount-display-left'>
            <div className='invested-amount-display-left-text'>Invested Amount</div>
            <div className='invested-amount-display-left-val'>
              {formatAmountInr(amount)} {investTypeDisplay === 'sip' ? 'per month' : ''}
            </div>
          </div>
          <div className='invested-amount-display-right'>
            <img
              width='50'
              alt=''
              src={investTypeDisplay === 'onetime' ? one_time_icon_dark : monthly_sip_icon_dark}
            />
          </div>
        </div>

        <PeriodWiseReturns
          initialTerm={term}
          equity={stockSplitVal}
          stockReturns={stockReturns}
          bondReturns={bondReturns}
          principalAmount={amount}
          isRecurring={isRecurring}
        />
        <div className="invested-amount-placeholder-icons">
          {funnelGoalData.id !== "savetax" && (
            <>
              <div className="invested-amount-placeholder-left">
                <img alt="withdraw_anytime_icon" src={withdraw_anytime_icon} />
                <p>
                  Withdraw
                  <br />
                  anytime
                </p>
              </div>
              <div className="invested-amount-placeholder-right">
                <img alt="no_lock_in_icon" src={no_lock_in_icon} />
                <p>
                  No lock-in
                  <br />
                  period
                </p>
              </div>
            </>
          )}
        </div>
        <EquityDebtSlider
          equity={stockSplitVal}
          disabled={funnelGoalData.id === 'savetax'}
          onChange={handleChange}
          fixedRiskTitle={
            investType === 'arbitrage' ?
            "Moderate risk (Moderately high returns)" : ""
          }
        />
      </section>
    </Container>
  );
};
export default InvestedAmount;
