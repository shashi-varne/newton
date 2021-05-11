import './GoalTarget.scss';
import React, { useState } from 'react';
import Container from '../../../common/Container';
import toast from "common/ui/Toast"
import { navigate as navigateFunc } from '../../common/commonFunctions';
import { numDifferentiationInr } from 'utils/validators';
import useFunnelDataHook from '../../common/funnelDataHook';
import { getConfig } from '../../../../utils/functions';
import { get_recommended_funds } from '../../common/api';
import {
  SAVE_GOAL_MAPPER,
  CUSTOM_GOAL_TARGET_MAP,
  SUBTYPE_NAME_MAP
} from './constants';

const riskEnabled = getConfig().riskEnabledFunnels;

const GoalTarget = (props) => {
  const navigate = navigateFunc.bind(props);
  
  const [loader, setLoader] = useState(false);
  const {
    funnelData,
    funnelGoalData,
    updateFunnelData
  } = useFunnelDataHook();
  const { subtype, year } = props.match?.params || funnelData;

  const fetchRecommendedFunds = async (corpus) => {
    try {
      const params = {
        type: funnelData.investType,
        subtye: funnelData.subtype,
        term: funnelData?.term,
        rp_enabled: riskEnabled,
      };
      setLoader(true);
      const data = await get_recommended_funds(params);
      setLoader(false);

      if (!data.recommendation) {
        // RP enabled flow, when user has no risk profile
        updateFunnelData({ corpus });
        if (data.msg_code === 0) {
          navigate(`${funnelGoalData.id}/risk-select`);
        } else if (data.msg_code === 1) {
          navigate(`${funnelGoalData.id}/risk-select-skippable`);
        }
        return;
      }

      updateFunnelData({ ...data, corpus });

      navigate(`savegoal/${subtype}/amount`);
    } catch (err) {
      console.log(err);
      setLoader(false);
      toast(err)
    }
  };
  
  const calculateCorpusValue = (amount) => {
    // eslint-disable-next-line radix
    return Math.round(amount * Math.pow(1 + 0.05, parseInt(funnelData.term)));
  };

  const handleInvestedAmount = (type) => () => {
    const amount = calculateCorpusValue(type.corpus);
    fetchRecommendedFunds(amount);
  };

  const setYourTarget = () => {
    updateFunnelData({ corpus: CUSTOM_GOAL_TARGET_MAP[subtype] });
    navigate(`savegoal/${subtype}/${year}/target`);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      title='Save for a Goal'
      noFooter
      classOverRideContainer='pr-container'
      skelton={loader}
    >
      <section className='invest-goal-save-container'>
        <div className='invest-goal-save-header'>
          How much money do you want to save for your {SUBTYPE_NAME_MAP[subtype]}?
        </div>

        <div className='invest-goal-save-list'>
          {SAVE_GOAL_MAPPER[subtype]?.map((el, idx) => {
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
export default GoalTarget;
