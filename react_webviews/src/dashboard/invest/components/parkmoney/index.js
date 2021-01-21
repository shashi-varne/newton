import React, { useState, useEffect } from 'react';
import Container from 'fund_details/common/Container';
import { storageService } from 'utils/validators';
import { navigate as navigateFunc, isRecurring } from '../../common/commonFunction';
import { get_recommended_funds } from '../../common/api';
import InvestType from '../mini_components/InvestType';
const term = 3;
const date = new Date();
let currentYear = date.getFullYear();

const renderData = {
  title: 'I will likely need the money',
  options: [
    {
      text: 'Within a year',
      value: '1Y',
      icon: 'ic_sip.svg',
    },
    {
      text: 'Between 1-3 years',
      value: '3Y',
      icon: 'ic_onetime.svg',
    },
  ],
};


const Landing = (props) => {
  const [data, setData] = useState(null);
  const [investTypeDisplay, setInvestTypeDisplay] = useState('3Y');
  const navigate = navigateFunc.bind(props);
  const fetchRecommendedFunds = async () => {
    const params = {
      type: "investsurplus",
    };
    try {
      const recurring = isRecurring(params.type);
      const data = await get_recommended_funds(params);
      const graphData = {
        recommendation: data.recommendation,
        amount: 50000,
        term:investTypeDisplay === "3Y" ? 3 : 1,
        // eslint-disable-next-line radix
        year: investTypeDisplay === "3Y" ? parseInt(currentYear + term): parseInt(currentYear + 1),
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
    navigate('investsurplus/amount', data);
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
