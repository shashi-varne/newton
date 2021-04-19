import React, { useEffect, useState } from 'react';
import Container from '../../../common/Container';
import Input from 'common/ui/Input';
import toast from 'common/ui/Toast'
import { formatAmountInr } from 'utils/validators';
import moment from 'moment';
import useFunnelDataHook from '../../common/funnelDataHook';
import { navigate as navigateFunc, isRecurring, convertInrAmountToNumber, getMonthlyCommitmentNew} from '../../common/commonFunctions';
import './Target.scss';

const currentYear = moment().year();

const Target = (props) => {
  const [targetAmount, setTargetAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const { funnelData, updateFunnelData, initFunnelData } = useFunnelDataHook();
  const term = funnelData?.year ? funnelData?.year - currentYear :  15;
  const year = funnelData?.year || currentYear + 15;
  const { subtype } = props.match?.params;
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
      const params = {
        amount,
        type: 'saveforgoal',
        subtype,
        term,
      };
      setLoader("button");
      const recurring = isRecurring('saveforgoal');
      await initFunnelData({ type: params.type });
      updateFunnelData({
        term,
        year,
        subtype,
        corpus: amount,
        amount: getMonthlyCommitmentNew(term, amount, funnelData.equity),
        investType: 'saveforgoal',
        isRecurring: recurring,
        investTypeDisplay: "sip",
        name: "Saving for goal"
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
export default Target;
