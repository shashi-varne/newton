import React from 'react'
import Container from '../../common/Container'
import { navigate as navigateFunc } from '../../common/commonFunction'
import { getConfig } from 'utils/functions'
import { getUrlParams } from '../../../utils/validators'

import './Failed.scss';
import ContactUs from '../../../common/components/contact_us'

const Failed = (props) => {
  const productName = getConfig().productName
  const urlParams = getUrlParams(props?.location?.search)
  const partnerCode = urlParams?.partner_code

  const goTo = () => {
    const navigate = navigateFunc.bind(props)
    navigate('insta-redeem')
  }

  return (
    <Container hidePageTitle buttonTitle="RETRY" handleClick={goTo} data-aid='otp-failed-screen'>
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
