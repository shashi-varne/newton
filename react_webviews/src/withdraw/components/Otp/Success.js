import React from 'react'
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/commonFunction'

import './Success.scss';
import { nativeCallback } from '../../../utils/native_callback';

const Success = (props) => {
  const successMessage = props?.location?.state?.message;
  const navigate = navigateFunc.bind(props);
  if(!successMessage){
    navigate('');
  }
  const type = props?.location?.state?.type
  const pageHead = type === 'switch' ? 'Switch' : 'Withdraw'
  const goTo = () => {
    sendEvents('next')
    if (type === 'switch') {
      navigate('/reports/switched-transaction', null, true)
    } else {
      navigate('/reports/redeemed-transaction', null, true)
    }
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": "withdraw_flow",
      properties: {
        "user_action": userAction,
        "screen_name": "withdraw_successful",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container hidepageTitle buttonTitle="Okay" handleClick={goTo} events={sendEvents("just_set_events")}>
      <section id="withdraw-otp-success">
        <img
          className="thumb-img"
          src={require(`assets/thumb.svg`)}
          alt="Successful Operation"
          width="100"
        />
        <div className="message">{pageHead} request placed</div>
        <div className="withdraw-success-msg" dangerouslySetInnerHTML={{ __html: successMessage }}></div>
      </section>
    </Container>
  )
}

export default Success
