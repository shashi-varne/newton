import React from 'react'
import { getConfig, navigate as navigateFunc } from 'utils/functions'
import Container from '../common/Container'

import "./commonStyles.scss";

const Intro = (props) => {
  let productName = getConfig().productName
  if (productName !== 'finity') {
    productName = 'fisdom'
  }
  const navigate = navigateFunc.bind(props)
  const handleClick = () => {
    navigate('/kyc/upload/progress')
  }
  return (
    <Container
      buttonTitle="CONTINUE"
      handleClick={handleClick}
      title='Upload documents'
      data-aid='kyc-intro-screen'
    >
      <section id="kyc-upload-intro" data-aid='kyc-upload-intro'>
        <div className="banner" data-aid='kyc-banner'>
          <img src={require(`assets/${productName}/upload_doc_banner.svg`)} alt="" />
        </div>
        <div className="intro" data-aid='kyc-intro'>
          Securely upload required documents to verify personal and address
          details.
        </div>
        <footer className="trust" data-aid='kyc-trust'>
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
