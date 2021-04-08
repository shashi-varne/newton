import React from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'

import { navigate as navigateFunc } from '../common/functions'

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
      title="Intro"
      handleClick={handleClick}
      title='Upload documents'
    >
      <section id="kyc-upload-intro">
        <div className="banner">
          <img src={require(`assets/${productName}/upload_doc_banner.svg`)} />
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
