import React, { useState } from 'react';
import Container from '../../../common/Container';
import InvestType from '../../mini-components/InvestType';
import toast from 'common/ui/Toast';

import { navigate as navigateFunc } from 'utils/functions';
import "../../commonStyles.scss"
import moment from 'moment';
import useFunnelDataHook from '../../common/funnelDataHook';
import {nativeCallback} from '../../../../utils/native_callback'
import {flowName} from '../../constants'
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
  const { initFunnelData } = useFunnelDataHook();
  const [loader, setLoader] = useState(false);
  const [investTypeDisplay, setInvestTypeDisplay] = useState('sip');
  const otiAmount = 50000;
  const sipAmount = 5000;
  const navigate = navigateFunc.bind(props);
  
  const fetchRecommendedFunds = async () => {
    sendEvents('next')
    const params = {
      type: investTypeDisplay === "sip" ? 'buildwealth' : 'buildwealthot',
    };
    setLoader("button");
    try {
      const appendToFunnelData = {
        amount: investTypeDisplay === 'sip' ? sipAmount : otiAmount,
        term,
        year: parseInt(moment().year() + term, 10),
        corpus: otiAmount,
        investType: params.type,
        isRecurring: investTypeDisplay === 'sip' ? true : false,
        investTypeDisplay,
        name: 'Wealth building',
        flow: 'build wealth',
        showRecommendationTopCards: true
      };
      await initFunnelData({
        apiParams: { type: params.type },
        appendToFunnelData: appendToFunnelData
      });
      setLoader(false);
      goNext();
    } catch (err) {
      setLoader(false);
      toast(err);
    }
  };

  const goNext = () => {
    navigate('/invest/buildwealth/amount');
  };

  const handleChange = (type) => {
    setInvestTypeDisplay(type);
  };

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'mf_investment',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "select order type",
        "order_type": investTypeDisplay === "sip" ? "SIP" : "OT",
        "flow": flowName['buildwealth']
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
      buttonTitle='NEXT'
      title='Build Wealth'
      handleClick={fetchRecommendedFunds}
      showLoader={loader}
      data-aid='buildwealth-screen'
    >
      <section className='invest-amount-common' data-aid='invest-amount-common'>
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
