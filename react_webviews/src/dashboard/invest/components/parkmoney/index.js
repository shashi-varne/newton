import React, { useState } from 'react';
import Container from '../../../common/Container';
import InvestType from '../mini_components/InvestType';
import toast from 'common/ui/Toast'

import { storageService } from 'utils/validators';
import { navigate as navigateFunc, isRecurring } from '../../common/commonFunction';
import { get_recommended_funds } from '../../common/api';

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
  const [loader, setLoader] = useState(false);
  const [investTypeDisplay, setInvestTypeDisplay] = useState('3Y');
  const navigate = navigateFunc.bind(props);
  const fetchRecommendedFunds = async () => {
    const params = {
      type: 'investsurplus',
    };
    try {
      setLoader("button");
      const recurring = isRecurring(params.type);
      const data = await get_recommended_funds(params);
      const graphData = {
        recommendation: data.recommendation,
        amount: 50000,
        term: investTypeDisplay === '3Y' ? 3 : 1,
        // eslint-disable-next-line radix
        year: investTypeDisplay === '3Y' ? parseInt(currentYear + term) : parseInt(currentYear + 1),
        investType: params.type,
        equity: data.recommendation.equity,
        debt: data.recommendation.debt,
        isRecurring: recurring,
        investTypeDisplay,
        name: 'Wealth building'
      };
      storageService().setObject('graphData', graphData);
      setLoader(false);
      goNext();
    } catch (err) {
      setLoader(false);
      toast(err)
    }
  };

  const goNext = () => {
    navigate('investsurplus/amount');
  };

  const handleChange = (type) => {
    setInvestTypeDisplay(type);
  };
  return (
    <Container
      classOverRide='pr-error-container'
      buttonTitle='NEXT'
      hidePageTitle
      showLoader={loader}
      title='Park Money'
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
