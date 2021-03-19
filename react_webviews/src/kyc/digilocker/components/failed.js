import React, { useState } from 'react'
import Container from '../../common/Container'
import { getConfig } from 'utils/functions'
import { navigate as navigateFunc } from '../../common/functions'
import Button from '@material-ui/core/Button'
import AadhaarDialog from '../../mini_components/AadhaarDialog'

const Failed = (props) => {
  const [open, setOpen] = useState(false)

  const close = () => {
    setOpen(false)
  }

  const retry = () => {
    setOpen(true)
  }

  const manual = () => {
    const navigate = navigateFunc.bind(props)
    navigate('/kyc/journey')
  }

  const productName = getConfig().productName
  return (
    <Container title="Aadhaar KYC Failed !" noFooter>
      <section id="digilocker-failed">
        {/* <div className="page-title">Aadhaar KYC Failed !</div> */}
        <img
          className="digi-image"
          src={require(`assets/${productName}/ils_digilocker_failed.svg`)}
        />
        <div className="body-text1">
          Aadhaar KYC has been failed because we were not able to connect to
          your Digilocker.
        </div>
        <div className="body-text2">
          However, you can <strong>still complete your KYC</strong> and start
          investing in mutual funds.
        </div>
        <footer className="footer">
          <Button
            variant="raised"
            fullWidth
            color="secondary"
            className="raised"
            onClick={retry}
          >
            RETRY
          </Button>
          <Button
            variant="outlined"
            fullWidth
            color="secondary"
            className="outlined"
            onClick={manual}
          >
            CONTINUE WITH MANUAL KYC
          </Button>
        </footer>
      </section>
      <AadhaarDialog open={open} id="kyc-aadhaar-dialog" close={close} />
    </Container>
  )
}

export default Failed
