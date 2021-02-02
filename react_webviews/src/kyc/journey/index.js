import React, { useState } from 'react'

import Container from '../common/Container'
const Journey = (props) => {
  const [showLoader, setShowLoader] = useState(false)
  return (
    <Container
      classOverRIde="pr-error-container"
      helpContact
      noFooter
      title="KYC Journey"
      showLoader={showLoader}
      classOverRideContainer="pr-containe>r"
      id="kyc-journey-container"
    >
      <h1>Welcome to kyc journey</h1>
    </Container>
  )
}

export default Journey