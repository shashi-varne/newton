import './CustomGoalTarget.scss';
import React, { useEffect, useState } from 'react';
import Container from '../../../common/Container';
import Input from 'common/ui/Input';
import toast from 'common/ui/Toast'
import { 
  convertInrAmountToNumber, 
  formatAmountInr 
} from 'utils/validators';
import useFunnelDataHook from '../../common/funnelDataHook';
import { getConfig, navigate as navigateFunc  } from '../../../../utils/functions';
import { CUSTOM_GOAL_TARGET_MAP } from './constants';
import { get_recommended_funds } from '../../common/api';

const riskEnabled = getConfig().riskEnabledFunnels;

const CustomGoalTarget = (props) => {
  const navigate = navigateFunc.bind(props);
  
  const [targetAmount, setTargetAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    funnelData,
    funnelGoalData,
    updateFunnelData
  } = useFunnelDataHook();
  const { subtype } = props.match?.params || funnelData;

  useEffect(() => {
    setTargetAmount(
      CUSTOM_GOAL_TARGET_MAP[subtype] || 0
    );
  }, []);

  const handleChange = (e) => {
    let value = e.target.value || "";
    value = convertInrAmountToNumber(value) || "";
    setTargetAmount(value);
    setErrorMessage(validateTargetAmount(value));
  };

  const validateTargetAmount = (investAmount) => {
    let helperText = "";
    if(!investAmount) {
      helperText = 'This is required';
    } else if (investAmount < funnelGoalData.min_sip_amount) {
      helperText = `Minimum amount should be atleast ${formatAmountInr(500)}`;
    }
    return helperText;
  };

  const fetchRecommendedFunds = async (corpus) => {
    if(errorMessage) {
      return;
    }
    try {
      const params = {
        type: funnelData.investType,
        subtye: funnelData.subtype,
        term: funnelData?.term,
        rp_enabled: riskEnabled,
      };
      setLoader("button");

      const data = await get_recommended_funds(params);
      setLoader(false);

      if (!data.recommendation) {
        // RP enabled flow, when user has no risk profile
        updateFunnelData({ corpus });
        if (data.msg_code === 0) {
          navigate(`/invest/${funnelGoalData.id}/risk-select`);
        } else if (data.msg_code === 1) {
          navigate(`/invest/${funnelGoalData.id}/risk-select-skippable`);
        }
        return;
      }

      updateFunnelData({ ...data, corpus });

      navigate(`/invest/savegoal/${subtype}/amount`);
    } catch (err) {
      console.log(err);
      setLoader(false);
      toast(err)
    }
  };

  const goNext = () => {
    fetchRecommendedFunds(targetAmount);
  };

  return (
    <Container
      data-aid='custom-goal-target-screen'
      classOverRide='pr-error-container'
      title='Save for a Goal'
      buttonTitle='NEXT'
      handleClick={goNext}
      classOverRideContainer='pr-container'
      disable={!targetAmount}
      showLoader={loader}
    >
      <section className='invest-goal-type-container' data-aid='invest-goal-type-page'>
        <div>Set your target amount</div>
        <div className='invest-goal-type-input'>
          <Input
            id='invest-amount'
            class='invest-amount-num'
            value={targetAmount ? formatAmountInr(targetAmount) : ""}
            onChange={handleChange}
            type='text'
            error={!!errorMessage}
            helperText={errorMessage}
            autoFocus
            inputMode='numeric'
            pattern='[0-9]*'
          />
        </div>
      </section>
    </Container>
  );
};
export default CustomGoalTarget;
