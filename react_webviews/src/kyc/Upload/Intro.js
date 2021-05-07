import React from 'react'
import { getConfig } from 'utils/functions'
import { nativeCallback } from '../../utils/native_callback';
import Container from '../common/Container'

import { navigate as navigateFunc } from '../common/functions'
import "./commonStyles.scss";

const Intro = (props) => {
  let productName = getConfig().productName
  if (productName !== 'finity') {
    productName = 'fisdom'
  }
  const navigate = navigateFunc.bind(props)
  const handleClick = () => {
    sendEvents('next')
    navigate('/kyc/upload/progress')
  }
  
  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": 'KYC_registration',
      "properties": {
        "user_action": userAction || "",
        "screen_name": "upload_docs_intro"
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
      buttonTitle="CONTINUE"
      events={sendEvents("just_set_events")}
      handleClick={handleClick}
      title='Upload documents'
    >
      <section id="kyc-upload-intro">
        <div className="banner">
          <img src={require(`assets/${productName}/upload_doc_banner.svg`)} alt="" />
        </div>
        <div className="intro">
          Securely upload required documents to verify personal and address
          details.
        </div>
        <footer className="trust">
          <img
            src={require(`assets/${productName}/trust_icons.svg`)}
            alt="Trust Icons."
          />
        </footer>
      </section>
    </Container>
  )
}

export default Intro
