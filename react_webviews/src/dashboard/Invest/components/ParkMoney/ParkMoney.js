import React, { useState } from 'react';
import Container from '../../../common/Container';
import InvestType from '../../mini-components/InvestType';
import toast from 'common/ui/Toast'

import { navigate as navigateFunc, isRecurring } from '../../common/commonFunctions';
import moment from 'moment';
import useFunnelDataHook from '../../common/funnelDataHook';
import "../../commonStyles.scss"
import { nativeCallback } from '../../../../utils/native_callback';
import { flowName } from '../../constants';

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
    sendEvents('next')
    const appendToFunnelData = {
      amount: 50000,
      term: investTypeDisplay === '3Y' ? 3 : 1,
      year: investTypeDisplay === '3Y' ? (currentYear + term) : (currentYear + 1),
      investType: 'investsurplus',
      isRecurring: isRecurring('investsurplus'),
      investTypeDisplay,
      name: 'Wealth building',
      flow: 'park my savings',
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

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "select years",
        "years_selected": investTypeDisplay === "1Y" ? "less than 1" : "1 to 3 years",
        "flow": flowName['parkMoney']
        }
    };
    if (userAction === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  return (
    <Container
      events={sendEvents("just_set_events")}
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
