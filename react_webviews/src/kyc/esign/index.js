import React from 'react'
import { getConfig } from '../../utils/functions'
import Container from '../common/Container'

const Esign = () => {
  const productName = getConfig().productName
  const steps = [
    {
      name: 'ic_verify_otp',
      description: '1. Verify mobile and enter Aadhaar number',
    },
    {
      name: 'ic_esign_otp',
      description: '1. Verify mobile and enter Aadhaar number',
    },
    {
      name: 'ic_esign_done',
      description: '1. Verify mobile and enter Aadhaar number',
    },
  ]
  return (
    <Container noFooter hideInPageTitle>
      <section id="kyc-esign">
        <div className="title">eSign KYC</div>
        <img
          src={require(`assets/${productName}/ic_esign_kyc.svg`)}
          className="digi-image"
          alt=""
        />
        <div className="esign-desc">
          eSign is an online electronic signature service by UIDAI to facilitate{' '}
          <strong>Aadhaar holder to digitally sign</strong> documents.
        </div>
        <div className="subtitle">How to eSign documents</div>
        <div className="esign-steps">
          {steps.map(({ name, description}) => (
            <div className="step" key={name}>
              <img src={require(`assets/${productName}/${name}.svg`)} alt={name} className="step-icon" />
              <div className="step-text">
                {description}
              </div>
            </div>
          ))}
        </div>
        <footer className="bottom">
          <div className="bottom-text">
            Initiative By
          </div>
          <img className="bottom-image" alt="bottom image" src={require(`assets/ic_gov_meit.svg`)} />
        </footer>
      </section>
    </Container>
  )
}

export default Esign