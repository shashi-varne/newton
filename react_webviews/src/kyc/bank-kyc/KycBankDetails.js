import React, { useState } from 'react'
import Container from '../common/Container'
import Alert from '../mini_components/Alert'
import TextField from '@material-ui/core/TextField'

const KycBankDetails = () => {
  const [showLoader, setShowLoader] = useState(false)
  const [ifsc, setIfsc] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('')
  const [accountType, setAccountType] = useState('')

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case 'ifsc':
        setIfsc(event.target.value)

      case 'accountNumber':
        setAccountNumber(event.target.value)

      case 'confirmAccountNumber':
        setConfirmAccountNumber(event.target.value)

      case 'accountType':
        setAccountType(event.target.value)
    }
  }
  return (
    <Container
      showSkelton={showLoader}
      buttonTitle="SAVE AND CONTINUE"
      hideInPageTitle
    >
      <section id="kyc-bank-kyc">
        <div className="kyc-main-title">Enter bank account details</div>
        <Alert
          variant="info"
          message="As per SEBI, it is mandatory for mutual fund investors to provide their own bank account details."
        />
        <main>
          <form noValidate autoComplete="off">
            <TextField
              id="accountHolderName"
              label="Account Holder Name"
              className="textField"
              name="accountHolderName"
              disabled={true}
              value=""
              onChange={handleInputChange}
            />
            <TextField
              id="ifsc"
              label="IFSC Code"
              className="textField"
              name="ifsc"
              value={ifsc}
              onChange={handleInputChange}
            />
            <TextField
              id="accountNumber"
              label="Account Number"
              className="textField"
              name="accountNumber"
              value={accountNumber}
              onChange={handleInputChange}
            />
            <TextField
              id="confirmAccountNumber"
              label="Confirm Account Number"
              className="textField"
              name="confirmAccountNumber"
              value={confirmAccountNumber}
              onChange={handleInputChange}
            />
            <TextField
              id="accountType"
              label="Account Type"
              className="textField"
              name="accountType"
              value={accountType}
              onChange={handleInputChange}
            />
          </form>
        </main>
      </section>
    </Container>
  )
}

export default KycBankDetails
