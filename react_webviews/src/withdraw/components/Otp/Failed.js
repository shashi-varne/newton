import React from 'react'
import Container from '../../common/Container'
import { getConfig, navigate as navigateFunc } from 'utils/functions'

import './Failed.scss';
import ContactUs from '../../../common/components/contact_us'
import { nativeCallback } from '../../../utils/native_callback'

const Failed = (props) => {
  const config = getConfig();
  const productName = config.productName
  const partnerCode = config.code;

  const goTo = () => {
    sendEvents('next')
    const navigate = navigateFunc.bind(props)
    navigate('/withdraw/insta-redeem')
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": "withdraw_flow",
      properties: {
        "user_action": userAction,
        "screen_name": "withdraw_failed",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container hidePageTitle buttonTitle="RETRY" handleClick={goTo} events={sendEvents("just_set_events")} data-aid='otp-failed-screen'>
      <section id="withdraw-otp-failed" data-aid='withdraw-otp-failed'>
        {partnerCode === 'bfdlmobile' && (
          <div className="header" data-aid='opt-header'>Money + Withdraw</div>
        )}
        {partnerCode !== 'bfdlmobile' && (
          <div className="header" data-aid='opt-header'>Instant Withdraw</div>
        )}
        <img
          className="failed-icon"
          src={require(`assets/${productName}/error_illustration.svg`)}
          alt="Successful Operation"
          width="100"
        />
        <div className="failed-title" data-aid='failed-title'>Something went wrong!</div>
        <div className="failed-subtitle" data-aid='failed-subtitle'>
          If instant withdraw was successful, you will get the money within 30
          mins. Otherwise, please try again after some time.
        </div>
        <ContactUs />
      </section>
    </Container>
  )
}

export default Failed
