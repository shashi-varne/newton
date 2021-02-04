import React, { useState, useEffect } from 'react'
import Skelton from '../../common/ui/Skelton'
import Container from '../common/Container'

import { initData } from '../services'

const steps = [
  'PAN Details',
  'Personal Details',
  'Address Details',
  'Upload documents PAN & proof of address',
  'eSign',
]

const Journey = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [journeyStatus, setJourneyStatus] = useState('ground_premium')
  const [kycStatus, setKycStatus] = useState('compliant')

  // useEffect(() => {
  //   initData()
  // }, [])

  if (loading) {
    return <Skelton type="g" />
  }

  return (
    <Container
      hideInPageTitle
      buttonTitle="CONTINUE"
      disable={loading}
      title="KYC Journey"
      classOverRideContainer="pr-container"
    >
      <div className="kyc-journey">
      {journeyStatus === 'ground_premium' && <div className="kyc-journey-caption">fast track your investment!</div>}
      {kycStatus === 'compliant' && }
        <div className="kyc-journey-title">KYC journey</div>
        <div className="kyc-journey-subtitle">
          Please keep your PAN () and address proof handy to complete KYC
        </div>
        <main className="steps-container">
          {steps.map((step, idx) => (
            <div className="step">
              <span
                className={idx === activeStep ? 'icon icon__active' : 'icon'}
              >
                {idx + 1}
              </span>
              <div
                className={
                  idx === activeStep ? 'title title__selected' : 'title'
                }
              >
                {step}
              </div>
            </div>
          ))}
        </main>
      </div>
    </Container>
  )
}

export default Journey
