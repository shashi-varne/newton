import React, { useState } from 'react'
import Container from '../../common/Container'
import { getConfig, isMobile } from 'utils/functions'
import { navigate as navigateFunc } from '../../common/functions'
import Button from '@material-ui/core/Button'
import AadhaarDialog from '../../mini_components/AadhaarDialog'
import { nativeCallback } from 'utils/native_callback'
import { storageService } from 'utils/validators'


const Failed = (props) => {
  const [showLoader, setShowLoader] = useState(false)
  const [open, setOpen] = useState(false)

  const close = () => {
    setOpen(false)
  }

  const retry = () => {
    setOpen(true)
  }

  const handleProceed = () => {
    const redirect_url = encodeURIComponent(`${window.location.protocol}
    :// 
    ${window.location.host}
    /kyc/journey?show_aadhaar=true&is_secure=
    ${storageService().get('is_secure')}`)
    if (!getConfig().Web) {
      if (isMobile.iOS()) {
        nativeCallback({
          action: 'show_top_bar',
          message: { title: 'Aadhaar KYC' },
        })
      }
      nativeCallback({
        action: 'take_control',
        back_url: redirect_url,
        back_text: 'You are almost there, do you really want to go back?',
        title: 'Aadhaar KYC',
        show_back_top_bar: true,
      })
    }
    window.location.href =
      getConfig().base_url +
      '/api/digilocker/getauthorisationcode/kyc?redirect_url=' +
      redirect_url

    close()
  }

  const manual = () => {
    const navigate = navigateFunc.bind(props)
    navigate('/kyc/journey')
  }

  const productName = getConfig().productName
  return (
    <Container skelton={showLoader} title="Aadhaar KYC Failed !" noFooter>
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
      <AadhaarDialog open={open} id="kyc-aadhaar-dialog" close={close} handleProceed={handleProceed} />
    </Container>
  )
}

export default Failed
