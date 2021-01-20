import React, { useState, useEffect } from 'react';
import Container from '../../../fund_details/common/Container';
import { storageService } from 'utils/validators';
import { navigate as navigateFunc, isRecurring } from '../common/commonFunction';
import { get_recommended_funds } from '../common/api';
import InvestType from '../components/InvestType';
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
  title: 'How would you like to invest?',
  count: '1',
  total: '2',
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
  const otiAmount = 150000;
  const sipAmount = parseInt(Math.floor(otiAmount / duration));
  const navigate = navigateFunc.bind(props);
  const fetchRecommendedFunds = async () => {
    const params = {
      type: "savetaxsip",
    };
    if (investTypeDisplay === 'onetime') {
      params.type = 'savetax';
    }
    try {
      const recurring = isRecurring(params.type);
      const data = await get_recommended_funds(params);
      const graphData = {
        recommendation: data.recommendation,
        amount: investTypeDisplay === "sip" ? sipAmount : otiAmount,
        term,
        // eslint-disable-next-line radix
        year: parseInt(date.getFullYear() + term),
        corpus: 150000,
        investType: params.type,
        stockSplit: data.recommendation.equity,
        bondSplit: data.recommendation.debt,
        isRecurring: recurring,
        investTypeDisplay,
      };
      storageService().setObject('goalRecommendations', data.recommendation.goal);
      storageService().setObject('graphData', graphData);
      setData(graphData);
      goNext();
    } catch (err) {
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
      //goBack={()=>{}}
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle='Next'
      helpContact
      hideInPageTitle
      hidePageTitle
      title='Some heading'
      handleClick={fetchRecommendedFunds}
      classOverRideContainer='pr-container'
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
