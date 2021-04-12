import React, { useState, useEffect } from 'react';
import Container from '../../common/Container';
import toast from 'common/ui/Toast'

import withdraw_anytime_icon from 'assets/withdraw_anytime_icon.png';
import no_lock_in_icon from 'assets/no_lock_in_icon.png';
import monthly_sip_icon_dark from 'assets/monthly_sip_icon_dark.png';
import one_time_icon_dark from 'assets/one_time_icon_dark.png';

import { storageService, formatAmountInr } from 'utils/validators';
import { getReturnRates, navigate as navigateFunc, selectTitle } from '../common/commonFunction';
import { get_recommended_funds } from '../common/api';
import './style.scss';
import PeriodWiseReturns from '../../mini-components/PeriodWiseReturns';
import EquityDebtSlider from './EquityDebtSlider';

const { stockReturns, bondReturns } = getReturnRates();

const InvestedAmount = (props) => {
  let graphData = storageService().getObject('graphData');
  const goalRecommendation = storageService().getObject('goalRecommendations');
  const { amount, investType, term, equity, isRecurring, investTypeDisplay } = graphData;
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
      params.subtype = graphData?.subtype;
    }
    try {
      setLoader("button");
      const data = await get_recommended_funds(params);
      storageService().set('userSelectedRisk', data.rp_indicator);
      const recommendedTotalAmount = data?.amount;
      graphData = { ...graphData, ...data, amount, recommendedTotalAmount};
      storageService().setObject('graphData', graphData);
      setLoader(false);
      navigate(`recommendations`);
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
      classOverRide='pr-error-container'
      buttonTitle='SHOW MY FUNDS'
      hidePageTitle
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

        <div className='invested-amount-placeholder-icons'>
          <div className='invested-amount-placeholder-left'>
            <img alt='withdraw_anytime_icon' src={withdraw_anytime_icon} />
            <p>
              Withdraw
              <br />
              anytime
            </p>
          </div>
          <div className='invested-amount-placeholder-right'>
            <img alt='no_lock_in_icon' src={no_lock_in_icon} />
            <p>
              No lock-in
              <br />
              period
            </p>
          </div>
        </div>
        <EquityDebtSlider
          equity={stockSplitVal}
          disabled={goalRecommendation.id === 'savetax'}
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
