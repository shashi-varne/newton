import React, { useState } from 'react';
import Container from '../../../common/Container';
import InvestType from '../../mini-components/InvestType';
import toast from 'common/ui/Toast';

import { storageService } from 'utils/validators';
import { navigate as navigateFunc, isRecurring } from '../../common/commonFunction';
import { get_recommended_funds } from '../../common/api';
import "../../commonStyles.scss"
import moment from 'moment';

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
    setLoader("button");
    try {
      const data = await get_recommended_funds(params);
      const funnelData = {
        recommendation: data.recommendation,
        amount: investTypeDisplay === 'sip' ? sipAmount : otiAmount,
        term,
        // eslint-disable-next-line radix
        year: parseInt(moment().year() + term),
        corpus: otiAmount,
        investType: params.type,
        equity: data.recommendation.equity,
        debt: data.recommendation.debt,
        isRecurring: investTypeDisplay === 'sip' ? true : false,
        investTypeDisplay,
        name: 'Wealth building'
      };
      storageService().setObject('funnelData', funnelData);
      setData(funnelData);
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
