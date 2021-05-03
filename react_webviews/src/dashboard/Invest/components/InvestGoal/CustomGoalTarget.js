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
import { getConfig, navigate as navigateFunc } from '../../../../utils/functions';
import { customGoalTargetMap } from './constants';
import { get_recommended_funds } from '../../common/api';

const riskEnabled = getConfig().riskEnabledFunnels;

const CustomGoalTarget = (props) => {
  const navigate = navigateFunc.bind(props);
  
  const [targetAmount, setTargetAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const {
    funnelData,
    funnelGoalData,
    updateFunnelData
  } = useFunnelDataHook();
  const { subtype } = props.match?.params || funnelData;

  useEffect(() => {
    setTargetAmount(
      funnelData.corpus ||
      customGoalTargetMap[subtype] ||
      0
    );
  }, []);

  const handleChange = (e) => {
    let value = e.target.value || "";
    value = convertInrAmountToNumber(value);
    // eslint-disable-next-line radix
    if (!isNaN(parseInt(value))) {
      // eslint-disable-next-line radix
      setTargetAmount(parseInt(value));
    } else {
      setTargetAmount('');
    }
  };

  const fetchRecommendedFunds = async (corpus) => {
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

  const goNext = () => {
    fetchRecommendedFunds(targetAmount);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      title='Save for a Goal'
      buttonTitle='NEXT'
      handleClick={goNext}
      classOverRideContainer='pr-container'
      disable={!targetAmount}
      showLoader={loader}
    >
      <section className='invest-goal-type-container'>
        <div>Set your target amount</div>
        <div className='invest-goal-type-input'>
          <Input
            id='invest-amount'
            class='invest-amount-num'
            value={targetAmount ? formatAmountInr(targetAmount) : ""}
            onChange={handleChange}
            type='text'
            error={!targetAmount}
            helperText={!targetAmount && 'This is a required field'}
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
