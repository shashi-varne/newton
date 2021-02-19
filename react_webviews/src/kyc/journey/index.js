import React, { useState, useEffect } from 'react'
import { getConfig } from 'utils/functions'
import Container from '../common/Container'

import {  initData } from '../services'
import ShowAadharDialog from './components/ShowAadharDialog'
import Alert from '../mini_components/Alert'
import { isEmpty, storageService } from '../../utils/validators'
import { storageConstants } from '../constants'
import { toast } from 'react-toastify'

const steps = [
  'PAN Details',
  'Personal Details',
  'Address Details',
  'Upload documents PAN & proof of address',
  'eSign',
]

const Journey = (props) => {
  const [kyc, setKyc] = useState(storageService().getObject(storageConstants.KYC) || null)
  const [activeStep, setActiveStep] = useState(0)
  const [journeyStatus, setJourneyStatus] = useState('ground_premium')
  const [kycStatus, setKycStatus] = useState('compliant')
  const [showAadhaar, setShowAadhaar] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEmpty(kyc)) {
      initialize()
    }
  }, [])
  
  const initialize = async () => {
    try {
      setLoading(true)
      await initData()
      const kyc = storageService().getObject(storageConstants.KYC)
      setKyc(kyc)
    } catch(err) {
      toast(err.message)
    } finally {
      setLoading(false)
    }
  }
  const productName = getConfig().productName

  return (
    <Container
      hideInPageTitle
      buttonTitle="CONTINUE"
      disable={loading}
      title="KYC Journey"
      classOverRideContainer="pr-container"
      showSkelton={loading}
      skeltonType="p"
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
                  alt="Instant Investment"
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
          message="Please share following mandatory details within 24 hrs to execute the investment."
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
        open={showAadhaar}
        onClose={() => setShowAadhaar(false)}
      />
    </Container>
  )
}

export default Journey
