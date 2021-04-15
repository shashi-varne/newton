import React, { useState } from 'react';
import Container from '../../../common/Container';
import InvestType from '../../mini-components/InvestType';
import toast from 'common/ui/Toast';

import { storageService } from 'utils/validators';
import { navigate as navigateFunc, isRecurring } from '../../common/commonFunction';
import { get_recommended_funds } from '../../common/api';

const term = 15;
const date = new Date();
const month = date.getMonth();
const currentMonth = month + 1;
let currentYear = date.getFullYear();
let duration = currentMonth > 3 ? 15 - currentMonth : 3 - currentMonth;
if (duration === 0) {
  duration = 1;
}
if (currentMonth > 3) {
  currentYear = currentYear + 1;
}

const renderData = {
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
  const [data, setData] = useState(null);
  const [investTypeDisplay, setInvestTypeDisplay] = useState('sip');
  const [loader, setLoader] = useState(false);
  const otiAmount = 150000;
  // eslint-disable-next-line radix
  const sipAmount = parseInt(Math.floor(otiAmount / duration));
  const navigate = navigateFunc.bind(props);
  const fetchRecommendedFunds = async () => {
    const params = {
      type: 'savetaxsip',
    };
    if (investTypeDisplay === 'onetime') {
      params.type = 'savetax';
    }
    try {
      setLoader("button");
      const recurring = isRecurring(params.type);
      const data = await get_recommended_funds(params);
      const funnelData = {
        recommendation: data.recommendation,
        amount: investTypeDisplay === 'sip' ? sipAmount : otiAmount,
        term,
        // eslint-disable-next-line radix
        year: parseInt(date.getFullYear() + term),
        corpus: 150000,
        investType: params.type,
        equity: data.recommendation.equity,
        debt: data.recommendation.debt,
        isRecurring: recurring,
        investTypeDisplay,
        name:'Tax saving'
      };
      storageService().setObject('funnelData', funnelData);
      setData(funnelData);
      setLoader(false);
      goNext();
    } catch (err) {
      setLoader(false);
      toast(err);
      console.log('the err is ', err);
    }
  };

  const goNext = () => {
    navigate('savetax/amount', data);
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
          baseData={renderData}
          selected={investTypeDisplay}
          handleChange={handleChange}
        />
      </section>
    </Container>
  );
};
export default Landing;
