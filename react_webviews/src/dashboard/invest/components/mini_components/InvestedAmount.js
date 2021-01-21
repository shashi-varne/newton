import React, { useState, useEffect } from 'react';
import Container from '../../../../fund_details/common/Container';
import { storageService,formatAmountInr } from 'utils/validators';
import withdraw_anytime_icon from 'assets/withdraw_anytime_icon.png';
import no_lock_in_icon from 'assets/no_lock_in_icon.png';
import monthly_sip_icon_dark from 'assets/monthly_sip_icon_dark.png';
// import one_time_icon_dark from 'assets/one_time_icon_dark.png';
import Slider from 'common/ui/Slider';
import { navigate as navigateFunc } from '../../common/commonFunction';
import { get_recommended_funds } from '../../common/api';
const stockReturns = 15;
const bondReturns = 8;
const InvestedAmount = (props) => {
  let graphData = storageService().getObject('graphData');
  const goalRecommendation = storageService().getObject('goalRecommendations');
  const { amount, investType, term, stockSplit, isRecurring } = graphData;
  const [stockSplitVal, setStockSplitVal] = useState(stockSplit || 0);
  const [termYear, setTermYear] = useState(term || '');
  const [potentialValue, setPotentialValue] = useState(0);
  const [investedValue, setInvestedValue] = useState(0);
  const [risk, setRisk] = useState('');
  const navigate = navigateFunc.bind(props);
  useEffect(() => {
    getPotentialValue(termYear);
    getInvestedValue(termYear);
    getRiskTitle();
  }, [stockSplitVal, termYear]);
  const handleChange = (value) => {
    setStockSplitVal(value);
  };

  const fetchRecommendedFunds = async () => {
    const params = {
      amount,
      type: investType,
      equity: stockSplitVal,
      debt: 100 - stockSplitVal,
      term: termYear,
    };
    if (investType === 'saveforgoal') {
      params.subtype = graphData?.subtype;
    }
    try {
      const data = await get_recommended_funds(params);
      graphData = { ...graphData, ...data };
      storageService().setObject('graphData', graphData);
      navigate(`/invest/recommendations`, {}, true);
    } catch (err) {
      console.log('the err is ', err);
    }
  };
  const showFunds = () => {
    fetchRecommendedFunds();
  };

  const getPotentialValue = (term) => {
    let principle = amount;
    var corpus_value = 0;
    for (var i = 0; i < term; i++) {
      if (isRecurring) {
        var n = (i + 1) * 12;
        var mr = getRateOfInterest() / 12 / 100;
        corpus_value = (amount * (Math.pow(1 + mr, n) - 1)) / mr;
      } else {
        var currInterest = (principle * getRateOfInterest()) / 100;
        corpus_value = principle + currInterest;
        principle += currInterest;
      }
    }
    setPotentialValue(corpus_value);
  };
  const getRateOfInterest = () => {
    var range = Math.abs(stockReturns - bondReturns);
    if (stockSplitVal < 1) {
      return bondReturns;
    } else if (stockSplitVal > 99) {
      return stockReturns;
    } else {
      var rateOffset = (range * stockSplitVal) / 100;
      return bondReturns + rateOffset;
    }
  };
  const getRiskTitle = () => {
    if (investType === 'arbitrage') {
      setRisk("'Moderate risk (Moderately high returns)'");
    } else {
      if (stockSplitVal <= 50) {
        setRisk('Low risk (Moderate returns)');
      } else if (stockSplitVal > 50 && stockSplitVal <= 70) {
        setRisk('Moderate risk (Moderately high returns)');
      } else {
        setRisk('High risk (High returns)');
      }
    }
  };
  const getInvestedValue = (term) => {
    const value = isRecurring ? amount * 12 * term : amount;
    setInvestedValue(value);
  };
  const handlePotentialValue = (val) => (e) => {
    setTermYear(val);
  };
  return (
    <Container
      //goBack={()=>{}}
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle='Show My Funds'
      helpContact
      hideInPageTitle
      hidePageTitle
      title='Some heading'
      handleClick={showFunds}
      classOverRideContainer='pr-container'
    >
      <section className='invested-amount-common-container'>
        <div className='invested-amount-display'>
          <div className='invested-amount-display-left'>
            <div className='invested-amount-display-left-text'>Invested Amount</div>
            <div className='invested-amount-display-left-val'>
              {formatAmountInr(amount)} per month
            </div>
          </div>
          <div className='invested-amount-display-right'>
            <img style={{ width: '50px' }} alt='' src={monthly_sip_icon_dark} />
          </div>
        </div>

        <div className='invested-amount-return-container'>
          <div className='invested-amount-return-text'>Expected returns:</div>
          <div className='invested-amount-year-tabs'>
            <span className={termYear === 1 ? 'selected' : ''} onClick={handlePotentialValue(1)}>
              1Y
            </span>
            <span className={termYear === 3 ? 'selected' : ''} onClick={handlePotentialValue(3)}>
              3Y
            </span>
            <span className={termYear === 5 ? 'selected' : ''} onClick={handlePotentialValue(5)}>
              5Y
            </span>
            <span className={termYear === 10 ? 'selected' : ''} onClick={handlePotentialValue(10)}>
              10Y
            </span>
            <span className={termYear === 15 ? 'selected' : ''} onClick={handlePotentialValue(15)}>
              15Y
            </span>
            <span className={termYear === 20 ? 'selected' : ''} onClick={handlePotentialValue(20)}>
              20Y
            </span>
          </div>
          <div className='invested-amount-corpus-values'>
            <div className='invested-amount-corpus-invested'>
              <div>Invested Value</div>
              <div>{formatAmountInr(investedValue)}</div>
            </div>
            <div className='invested-amount-corpus-projected'>
              <div>Projected Value</div>
              <div>{formatAmountInr(potentialValue)}</div>
            </div>
          </div>
        </div>

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

        <div className='invested-amount-slider-container'>
          <div className='invested-amount-slider-head'>{risk}</div>
          <div className='invested-amount-slider'>
            <Slider
              label='Net monthly income'
              val='Net_monthly_Income'
              default={stockSplitVal}
              value={stockSplitVal}
              min='0'
              max='100'
              minValue='0'
              disabled={goalRecommendation.id === 'savetax'}
              maxValue='₹ 10 Lacs'
              onChange={handleChange}
            />
          </div>
          <div className='invested-amount-slider-range'>
            <div className='invested-amount-slider-stock'>{stockSplitVal}% Stocks</div>
            <div className='invested-amount-slider-ratio-text'>
              <span>slide to change</span> <span>ratio</span>
            </div>
            <div className='invested-amount-slider-bond'>{100 - stockSplitVal}% Bonds</div>
          </div>
        </div>
      </section>
    </Container>
  );
};
export default InvestedAmount;
