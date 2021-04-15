import React, { useState } from 'react';
import Container from '../../../../common/Container';
import toast from "common/ui/Toast"
import {
  navigate as navigateFunc,
  isRecurring,
  getMonthlyCommitmentNew
} from '../../../common/commonFunction';
import { numDifferentiationInr } from 'utils/validators';
import { saveGoalMapper } from '../constants';
import useFunnelDataHook from '../../../common/funnelDataHook';
import moment from 'moment';

const currentYear = moment().year();

const SaveGoal = (props) => {
  const [loader, setLoader] = useState(false);
  const navigate = navigateFunc.bind(props);
  const { subtype, year } = props.match?.params;
  const term = parseInt((year - currentYear), 10);

  const { funnelData, updateFunnelData, initFunnelData } = useFunnelDataHook();

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
      await initFunnelData(params);
      updateFunnelData({
        term,
        year,
        subtype,
        corpus: amount,
        amount: getMonthlyCommitmentNew(term, amount, funnelData.equity),
        investType: 'saveforgoal',
        isRecurring: recurring,
        name: "Saving for goal"
      });
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
    return Math.round(amount * Math.pow(1 + 0.05, parseInt(year - currentYear)));
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
      title='Save for a Goal'
      handleClick={goNext}
      noFooter
      classOverRideContainer='pr-container'
      skelton={loader}
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
