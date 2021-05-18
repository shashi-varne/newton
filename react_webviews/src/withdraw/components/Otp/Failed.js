import React from 'react'
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/commonFunction'
import { getConfig } from 'utils/functions'
import { getUrlParams } from '../../../utils/validators'

import './Failed.scss';
import ContactUs from '../../../common/components/contact_us'
import { nativeCallback } from '../../../utils/native_callback'

const Failed = (props) => {
  const productName = getConfig().productName
  const urlParams = getUrlParams(props?.location?.search)
  const partnerCode = urlParams?.partner_code

  const goTo = () => {
    sendEvents('next')
    const navigate = navigateFunc.bind(props)
    navigate('insta-redeem')
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
    <Container hidePageTitle buttonTitle="RETRY" handleClick={goTo} events={sendEvents("just_set_events")}>
      <section id="withdraw-otp-failed">
        {partnerCode === 'bfdlmobile' && (
          <div className="header">Money + Withdraw</div>
        )}
        {partnerCode !== 'bfdlmobile' && (
          <div className="header">Instant Withdraw</div>
        )}
        <img
          className="failed-icon"
          src={require(`assets/${productName}/error_illustration.svg`)}
          alt="Successful Operation"
          width="100"
        />
        <div className="failed-title">Something went wrong!</div>
        <div className="failed-subtitle">
          If instant withdraw was successful, you will get the money within 30
          mins. Otherwise, please try again after some time.
        </div>
        <ContactUs />
      </section>
    </Container>
  )
}

export default Failed
