import React, { useState } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'

import { navigate as navigateFunc } from '../common/functions'

const Intro = (props) => {
  const [loading, setLoading] = useState(false)
  let productName = getConfig().productName
  if (productName !== 'finity') {
    productName = 'fisdom'
  }
  const handleClick = () => {
    const navigate = navigateFunc.bind(props)
    navigate('/kyc/upload/progress')
  }
  return (
    <Container
      // hideInPageTitle
      buttonTitle="CONTINUE"
      // disable={loading}
      title="Intro"
      classOverRideContainer="pr-container"
      skelton={loading}
      skeltonType="p"
      // fullWidthButton={true}
      handleClick={handleClick}
      title='Upload documents'
      // force_hide_inpage_title={true}
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
