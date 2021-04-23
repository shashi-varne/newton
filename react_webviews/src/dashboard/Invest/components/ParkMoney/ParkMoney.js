import React, { useState } from 'react';
import Container from '../../../common/Container';
import InvestType from '../../mini-components/InvestType';
import toast from 'common/ui/Toast'

import { navigate as navigateFunc, isRecurring } from '../../common/commonFunctions';
import moment from 'moment';
import useFunnelDataHook from '../../common/funnelDataHook';
import "../../commonStyles.scss"

const term = 3;
const currentYear = moment().year();
const timeOptionsData = {
  subtitle: 'I will likely need the money',
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

  const { initFunnelData } = useFunnelDataHook();

  const fetchRecommendedFunds = async () => {
    const appendToFunnelData = {
      amount: 50000,
      term: investTypeDisplay === '3Y' ? 3 : 1,
      year: investTypeDisplay === '3Y' ? (currentYear + term) : (currentYear + 1),
      investType: 'investsurplus',
      isRecurring: isRecurring('investsurplus'),
      investTypeDisplay,
      name: 'Wealth building',
      showRecommendationTopCards: true
    };
    try {
      setLoader("button");
      await initFunnelData({
        apiParams: { type: 'investsurplus' },
        appendToFunnelData: appendToFunnelData
      });
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
      showLoader={loader}
      title='Park Money'
      handleClick={fetchRecommendedFunds}
      classOverRideContainer='pr-container'
    >
      <section className='invest-amount-common'>
        <InvestType
          baseData={timeOptionsData}
          selected={investTypeDisplay}
          handleChange={handleChange}
        />
      </section>
    </Container>
  );
};
export default Landing;
