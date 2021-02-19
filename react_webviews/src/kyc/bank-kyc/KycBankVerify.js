import React, { useState } from 'react'
import Container from '../common/Container'
import Alert from '../mini_components/Alert'

const KycBankVerify = () => {
  const [showLoader, setShowLoader] = useState(false)
  return (
    <Container
      showSkelton={showLoader}
      buttonTitle="SAVE AND CONTINUE"
      hideInPageTitle
    >
      <section id="kyc-bank-kyc-verify">
        <div className="kyc-main-title">Verify your bank account</div>
        <Alert
          variant="info"
          message="We will credit ₹1 to your bank account for verification."
        />
        <main>
          <div className="detail">
            <div className="title">Bank</div>
            <div className="edit">edit</div>
          </div>
          <div className="detail">
            <div className="title">Account Number</div>
          </div>
          <div className="detail">
            <div className="title">IFSC Code</div>
          </div>
          <div className="detail">
            <div className="title">Account type</div>
          </div>
        </main>
      </section>
    </Container>
  )
}

export default KycBankVerify
