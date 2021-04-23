import React from 'react'
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/commonFunction'
import { getConfig } from 'utils/functions'
import { getUrlParams } from '../../../utils/validators'

import './Failed.scss';

const Failed = (props) => {
  const productName = getConfig().productName
  const urlParams = getUrlParams(props?.location?.search)
  const partnerCode = urlParams?.partner_code

  const goTo = () => {
    const navigate = navigateFunc.bind(props)
    navigate('insta-redeem')
  }

  return (
    <Container hidePageTitle buttonTitle="RETRY" handleClick={goTo}>
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
        <div className="contact-us">
          <div className="contact-us-bottom1">For any query, reach us at</div>
          <div className="contact-us-bottom2 flex-center">
            <div className="contact-number">+91-7829228886</div>
            <div className="icon">|</div>
            <div className="email">ASK@FISDOM.COM</div>
          </div>
        </div>
      </section>
    </Container>
  )
}

export default Failed
