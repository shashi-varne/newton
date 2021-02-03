import React, { useState, useEffect } from 'react'
import { getAccountSummary } from '../services'

import Container from '../common/Container'
const Journey = (props) => {
  const [showLoader, setShowLoader] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    fetchAccountSummary()
  }, [])

  const fetchAccountSummary = async () => {
    try {
      setShowLoader(true)
      const summary = await getAccountSummary()
      if (error) {
        setError('')
      }
    } catch(err) {
      setError(err.message)
    } finally {
      setShowLoader(false)
    }
  }
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