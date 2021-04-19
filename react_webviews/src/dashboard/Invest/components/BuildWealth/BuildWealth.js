import React, { useState } from 'react';
import Container from '../../../common/Container';
import InvestType from '../../mini-components/InvestType';
import toast from 'common/ui/Toast';

import { navigate as navigateFunc } from '../../common/commonFunctions';
import "../../commonStyles.scss"
import moment from 'moment';
import useFunnelDataHook from '../../common/funnelDataHook';

const term = 5;

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
  const { updateFunnelData, initFunnelData } = useFunnelDataHook();
  const [loader, setLoader] = useState(false);
  const [investTypeDisplay, setInvestTypeDisplay] = useState('sip');
  const otiAmount = 50000;
  const sipAmount = 5000;
  const navigate = navigateFunc.bind(props);
  
  const fetchRecommendedFunds = async () => {
    const params = {
      type: investTypeDisplay === "sip" ? 'buildwealth' : 'buildwealthot',
    };
    setLoader("button");
    try {
      await initFunnelData({ type: params.type });
      const funnelObj = {
        amount: investTypeDisplay === 'sip' ? sipAmount : otiAmount,
        term,
        // eslint-disable-next-line radix
        year: parseInt(moment().year() + term),
        corpus: otiAmount,
        investType: params.type,
        isRecurring: investTypeDisplay === 'sip' ? true : false,
        investTypeDisplay,
        name: 'Wealth building'
      };
      updateFunnelData(funnelObj);
      setLoader(false);
      goNext();
    } catch (err) {
      setLoader(false);
      toast(err);
    }
  };

  const goNext = () => {
    navigate('buildwealth/amount');
  };

  const handleChange = (type) => {
    setInvestTypeDisplay(type);
  };

  return (
    <Container
      buttonTitle='NEXT'
      title='Build Wealth'
      handleClick={fetchRecommendedFunds}
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
