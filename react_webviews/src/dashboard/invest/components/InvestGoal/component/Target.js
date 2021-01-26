import React, { useEffect, useState } from 'react';
import Container from '../../../../common/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from 'common/ui/Input';
import toast from 'common/ui/Toast'

import { storageService } from 'utils/validators';
import {getRateOfInterest, navigate as navigateFunc, isRecurring} from '../../../common/commonFunction';
import { get_recommended_funds } from '../../../common/api';
import './style.scss';

// eslint-disable-next-line radix
const currentYear = parseInt(new Date().getFullYear())
const Target = (props) => {
  const graphData = storageService().getObject("graphData");
  const [targetAmount, setTargetAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const term= graphData?.year ? graphData?.year-  currentYear :  15;
  const year = graphData?.year || currentYear + 15;
  const navigate = navigateFunc.bind(props);
  const { subtype } = props.match?.params;

  useEffect(() => {
    switch (subtype) {
      case 'retirement':
        setTargetAmount(20000000);
        break;
      case 'childeducation':
        setTargetAmount(1000000);
        break;
      case 'childwedding':
        setTargetAmount(1500000);
        break;
      case 'vacation':
        setTargetAmount(200000);
        break;
      case 'other':
        setTargetAmount(20000000);
        break;
      default:
        setTargetAmount(0);
    }
  }, []);

  const handleChange = (e) => {
    // eslint-disable-next-line radix
    if (!isNaN(parseInt(e.target.value))) {
      // eslint-disable-next-line radix
      setTargetAmount(parseInt(e.target.value));
    } else {
      setTargetAmount('');
    }
  };

  const getMonthlyCommitmentNew = (corpusValue, stockSplitVal) => {
    var n = term * 12;
    var r = getRateOfInterest(stockSplitVal);
    var a = corpusValue;
    var i = r / 12 / 100;
    var tmp = Math.pow(1 + i, n) - 1;
    var monthlyInvestment = (a * i) / tmp;
    var monthlyAmount = monthlyInvestment;
    if (monthlyAmount < 500) {
      monthlyAmount = 500;
    }
    return Math.floor(monthlyAmount);
  };

  const fetchRecommendedFunds = async (amount) => {
    try {
      const params = {
        amount,
        type: 'saveforgoal',
        subtype,
        term,
      };
      setLoader(true);
      const recurring = isRecurring('saveforgoal');
      const { recommendation } = await get_recommended_funds(params);
      const monthlyAmount = getMonthlyCommitmentNew(amount, recommendation.equity);
      const graphData = {
        year,
        amount: monthlyAmount,
        corpus: amount,
        stockSplit: recommendation.equity,
        subtype,
        term,
        investType: 'saveforgoal',
        isRecurring: recurring,
        investTypeDisplay:"sip"
      };
      storageService().setObject('goalRecommendations', recommendation.goal);
      storageService().setObject('graphData', graphData);
      setLoader(false);
      navigate(`savegoal/${subtype}/amount`, true);
    } catch (err) {
      setLoader(false);
      toast(err)
    }
  };

  const goNext = () => {
    fetchRecommendedFunds(targetAmount);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      fullWidthButton
      helpContact
      hideInPageTitle
      hidePageTitle
      title='Some heading'
      buttonTitle={loader ? <CircularProgress size={22} thickness={4} /> : 'Next'}
      handleClick={goNext}
      classOverRideContainer='pr-container'
      disable={!targetAmount || loader}
    >
      <section className='invest-goal-type-container'>
        <div>Set your target amount</div>
        <div className='invest-goal-type-input'>
          <Input
            id='invest-amount'
            class='invest-amount-num'
            value={targetAmount}
            onChange={handleChange}
            type='text'
            error={!targetAmount}
            helperText={!targetAmount && 'This is a required field'}
            autoFocus
            maxLength={4}
            inputMode='numeric'
            pattern='[0-9]*'
          />
        </div>
      </section>
    </Container>
  );
};
export default Target;
