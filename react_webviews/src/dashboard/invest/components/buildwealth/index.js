import React, { useState } from 'react';
import Container from '../../../common/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import InvestType from '../mini_components/InvestType';
import toast from 'common/ui/Toast';

import { storageService } from 'utils/validators';
import { navigate as navigateFunc, isRecurring } from '../../common/commonFunction';
import { get_recommended_funds } from '../../common/api';

const term = 15;
const date = new Date();
const month = date.getMonth();
const currentMonth = month + 1;
let currentYear = date.getFullYear();
if (currentMonth > 3) {
  currentYear = currentYear + 1;
}
let duration = currentMonth > 3 ? 15 - currentMonth : 3 - currentMonth;
if (duration === 0) {
  duration = 1;
}

const renderData = {
  title: 'How would you like to invest?',
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
  const [loader, setLoader] = useState(false);
  const [investTypeDisplay, setInvestTypeDisplay] = useState('sip');
  const otiAmount = 50000;
  const sipAmount = 5000;
  const navigate = navigateFunc.bind(props);
  const fetchRecommendedFunds = async () => {
    const params = {
      type: investTypeDisplay === "sip" ? 'buildwealth' : 'buildwealthot',
    };
    setLoader(true);
    try {
      const recurring = isRecurring(params.type);
      const data = await get_recommended_funds(params);
      const graphData = {
        recommendation: data.recommendation,
        amount: investTypeDisplay === 'sip' ? sipAmount : otiAmount,
        term,
        // eslint-disable-next-line radix
        year: parseInt(date.getFullYear() + term),
        corpus: otiAmount,
        investType: params.type,
        stockSplit: data.recommendation.equity,
        bondSplit: data.recommendation.debt,
        isRecurring: investTypeDisplay === 'sip' ? true : false,
        investTypeDisplay,
      };
      storageService().setObject('goalRecommendations', data.recommendation.goal);
      storageService().setObject('graphData', graphData);
      setData(graphData);
      setLoader(false);
      goNext();
    } catch (err) {
      setLoader(false);
      toast(err);
    }
  };

  const goNext = () => {
    navigate('buildwealth/amount', data);
  };

  const handleChange = (type) => {
    setInvestTypeDisplay(type);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle={loader ? <CircularProgress size={22} thickness={4} /> : 'Next'}
      helpContact
      disable={loader}
      hideInPageTitle
      hidePageTitle
      title='Build Wealth'
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
