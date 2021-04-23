import './CustomGoalTarget.scss';
import React, { useEffect, useState } from 'react';
import Container from '../../../common/Container';
import Input from 'common/ui/Input';
import toast from 'common/ui/Toast'
import { 
  convertInrAmountToNumber, 
  formatAmountInr 
} from 'utils/validators';
import moment from 'moment';
import useFunnelDataHook from '../../common/funnelDataHook';
import { navigate as navigateFunc, isRecurring } from '../../common/commonFunctions';

const currentYear = moment().year();

const CustomGoalTarget = (props) => {
  const [targetAmount, setTargetAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const { initFunnelData } = useFunnelDataHook();
  const { subtype, year } = props.match?.params;
  const term = year - currentYear;
  const navigate = navigateFunc.bind(props);

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

  const fetchRecommendedFunds = async (amount) => {
    try {
      const appendToFunnelData = {
        term,
        year: Number(year),
        subtype,
        corpus: amount,
        investType: 'saveforgoal',
        isRecurring: isRecurring('saveforgoal'),
        investTypeDisplay: "sip",
        name: "Saving for goal"
      };
      setLoader("button");
      await initFunnelData({
        apiParams: {
          amount,
          type: 'saveforgoal',
          subtype,
          term,
        },
        appendToFunnelData: appendToFunnelData
      });
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
