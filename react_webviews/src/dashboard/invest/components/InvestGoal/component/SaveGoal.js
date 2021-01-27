import React, { useState } from 'react';
import Container from '../../../../common/Container';
import toast from "common/ui/Toast"

import {getRateOfInterest,navigate as navigateFunc,isRecurring} from '../../../common/commonFunction';
import { storageService,numDifferentiationInr } from 'utils/validators';
import { get_recommended_funds } from '../../../common/api';
import { saveGoalMapper } from '../constants';

const SaveGoal = (props) => {
  const [loader, setLoader] = useState(false);

  const navigate = navigateFunc.bind(props);
  const { subtype, year } = props.match?.params;
  // eslint-disable-next-line radix
  const term = parseInt(year - new Date().getFullYear());

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
      };
      storageService().setObject('goalRecommendations', recommendation.goal);
      storageService().setObject('graphData', graphData);
      setLoader(false);
      goNext();
    } catch (err) {
      setLoader(false);
      toast(err)
    }
  };

  const goNext = () => {
    navigate(`savegoal/${subtype}/amount`, true);
  };
  
  const calculateCorpusValue = (amount) => {
    // eslint-disable-next-line radix
    return Math.round(amount * Math.pow(1 + 0.05, parseInt(year - new Date().getFullYear())));
  };

  const handleInvestedAmount = (type) => () => {
    const amount = calculateCorpusValue(type.corpus);
    fetchRecommendedFunds(amount);
  };

  const setYourTarget = () => {
    navigate(`savegoal/${subtype}/target`);
  };
  return (
    <Container
      classOverRide='pr-error-container'
      fullWidthButton
      helpContact
      hideInPageTitle
      hidePageTitle
      title='Save for a Goal'
      handleClick={goNext}
      noFooter
      classOverRideContainer='pr-container'
      showLoader={loader}
    >
      <section className='invest-goal-save-container'>
        <div className='invest-goal-save-header'>
          How much money do you want to save for {subtype}?
        </div>

        <div className='invest-goal-save-list'>
          {saveGoalMapper[subtype]?.map((el, idx) => {
            return (
              <div key={idx} className='invest-goal-save-item' onClick={handleInvestedAmount(el)}>
                <img src={el.icon} alt={el.name} width='80' />
                <p>{el.name}</p>
                <div className='invest-goal-save-item-corpus'>
                  Corpus in {year}:{' '}
                  <span>{numDifferentiationInr(calculateCorpusValue(el.corpus))}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className='invest-goal-set-target' onClick={setYourTarget}>
          Let me set my target
        </div>
      </section>
    </Container>
  );
};
export default SaveGoal;
