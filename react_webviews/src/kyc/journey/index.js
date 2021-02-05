import React, { useState, useEffect } from 'react'
import Skelton from '../../common/ui/Skelton'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'

import { initData } from '../services'
import ShowAadharDialog from './components/ShowAadharDialog'
import Alert from '../mini_components/Alert'

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
  const [showAadhar, setShowAadhar] = useState(true)

  // useEffect(() => {
  //   initData()
  // }, [])

  if (loading) {
    return <Skelton type="g" />
  }

  const productName = getConfig().productName

  return (
    <Container
      hideInPageTitle
      buttonTitle="CONTINUE"
      disable={loading}
      title="KYC Journey"
      classOverRideContainer="pr-container"
    >
      <div className="kyc-journey">
        {journeyStatus === 'ground_premium' && (
          <div className="kyc-journey-caption">fast track your investment!</div>
        )}
        {kycStatus === 'compliant' && (
          <div className="kyc-pj-content">
            <div className="left">
              <div className="pj-header">Premium Onboarding</div>
              <div className="pj-bottom-info-box">
                <img
                  src={require(`assets/${productName}/ic_instant.svg`)}
                  alt="Instatly Investment"
                  role="i"
                  className="icon"
                />
                <div className="pj-bottom-info-content">Instant Investment</div>
              </div>
              <div className="pj-bottom-info-box">
                <img
                  src={require(`assets/${productName}/ic_no_doc.svg`)}
                  alt="No document asked"
                  role="i"
                  className="icon"
                />
                <div className="pj-bottom-info-content">No document asked</div>
              </div>
            </div>

            <img
              src={require(`assets/${productName}/ic_premium_onboarding_mid.svg`)}
              alt="Premium Onboarding"
            />
          </div>
        )}
        <div className="kyc-journey-title">KYC journey</div>
        <div className="kyc-journey-subtitle">
          Please keep your PAN () and address proof handy to complete KYC
        </div>
        <Alert
          variant="attention"
          message="Please share following mandtory details within 24 hrs to execute the investment."
          title="Hey +91|0000064334"
        />
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
      <ShowAadharDialog
        open={showAadhar}
        onClose={() => setShowAadhar(false)}
      />
    </Container>
  )
}

export default Journey
