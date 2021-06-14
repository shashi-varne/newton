import React, { useState, useEffect } from 'react';
import Container from '../../common/Container';
import toast from 'common/ui/Toast'

import withdraw_anytime_icon from 'assets/withdraw_anytime_icon.png';
import no_lock_in_icon from 'assets/no_lock_in_icon.png';
import monthly_sip_icon_dark from 'assets/monthly_sip_icon_dark.png';
import one_time_icon_dark from 'assets/one_time_icon_dark.png';

import { formatAmountInr } from 'utils/validators';
import { getReturnRates, selectTitle } from '../common/commonFunctions';
import { navigate as navigateFunc } from 'utils/functions';
import { get_recommended_funds } from '../common/api';
import './mini-components.scss';
import PeriodWiseReturns from '../../mini-components/PeriodWiseReturns';
import EquityDebtSlider from './EquityDebtSlider';
import useFunnelDataHook from '../common/funnelDataHook';

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
      navigate(`/invest/recommendations`);
    } catch (err) {
      setLoader(false);
      toast(err)
    }
  };

  const showFunds = () => {
    fetchRecommendedFunds();
  };


  return (
    <Container
      data-aid='show-my-funds-screem'
      classOverRide='pr-error-container'
      buttonTitle='SHOW MY FUNDS'
      title={title}
      handleClick={showFunds}
      classOverRideContainer='pr-container'
      showLoader={loader}
    >
      <section className='invested-amount-common-container' data-aid='invested-amount-common-container'>
        <div className='invested-amount-display' data-aid='invested-amount-display'>
          <div className='invested-amount-display-left' data-aid='invested-amount-display-left'>
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
          title="Expected returns"
          initialTerm={term}
          equity={stockSplitVal}
          stockReturns={stockReturns}
          bondReturns={bondReturns}
          principalAmount={amount}
          isRecurring={isRecurring}
        />
        <div className="invested-amount-placeholder-icons" data-aid='invested-amount-placeholder-icons'>
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
