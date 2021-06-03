import React, { useState } from 'react';
import Container from '../../../common/Container';
import InvestType from '../../mini-components/InvestType';
import toast from 'common/ui/Toast';
import moment from 'moment';
import useFunnelDataHook from '../../common/funnelDataHook';
import { isRecurring } from '../../common/commonFunctions';
import { navigate as navigateFunc } from 'utils/functions';

const term = 15;
// TODO: What does this code do?
const currentMonth = moment().month() + 1;
let duration = currentMonth > 3 ? 15 - currentMonth : 3 - currentMonth;
if (duration === 0) {
  duration = 1;
}

const typeOptionsData = {
  subtitle: 'How would you like to invest?',
  options: [
    {
      text: 'SIP',
      value: 'sip',
      icon: 'ic_sip.svg',
    },
    {
      text: 'One Time',
      value: 'onetime',
      icon: 'ic_onetime.svg',
    },
  ],
};

const Landing = (props) => {
  const { initFunnelData } = useFunnelDataHook();
  const [investTypeDisplay, setInvestTypeDisplay] = useState('sip');
  const [loader, setLoader] = useState(false);
  const otiAmount = 150000;
  const sipAmount = Math.floor(otiAmount / duration);
  const navigate = navigateFunc.bind(props);

  const fetchRecommendedFunds = async () => {
    const type = investTypeDisplay === 'onetime' ? 'savetax' : 'savetaxsip';
    const appendToFunnelData = {
      amount: investTypeDisplay === 'sip' ? sipAmount : otiAmount,
      term,
      year: parseInt(moment().year() + term, 10),
      corpus: 150000,
      investType: type,
      isRecurring: isRecurring(type),
      investTypeDisplay,
      name: 'Tax saving',
      flow: 'tax saving',
      showRecommendationTopCards: true
    }
    try {
      setLoader("button");
      await initFunnelData({
        apiParams: { type },
        appendToFunnelData: appendToFunnelData
      });
      setLoader(false);
      goNext();
    } catch (err) {
      setLoader(false);
      toast(err);
      console.log('the err is ', err);
    }
  };

  const goNext = () => {
    navigate('/invest/savetax/amount');
  };

  const handleChange = (type) => {
    setInvestTypeDisplay(type);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      buttonTitle='NEXT'
      title='Save Tax'
      handleClick={fetchRecommendedFunds}
      classOverRideContainer='pr-container'
      showLoader={loader}
    >
      <section className='invest-amount-common'>
        <InvestType
          baseData={typeOptionsData}
          selected={investTypeDisplay}
          handleChange={handleChange}
        />
      </section>
    </Container>
  );
};
export default Landing;
