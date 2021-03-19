import React from 'react'
import SlidingDialog from './SlideBottomDialog'
import Button from '@material-ui/core/Button'
import { getConfig, isMobile } from 'utils/functions'
import { nativeCallback } from 'utils/native_callback'
import { storageService } from 'utils/validators'

const AadhaarDialog = ({ id, open, close, handleProcced, ...props }) => {
  const productName = getConfig().productName
  const handleProceed = () => {
    const redirect_url = encodeURIComponent(`${window.location.origin}
    /kyc/journey${getConfig().searchParams}&show_aadhaar=true&is_secure=
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
  return (
    <SlidingDialog id={id} open={open} close={close} {...props}>
      <section className="kyc-dl-aadhaar-dialog">
        <div className="flex-between">
          <div className="heading">
            Please ensure your mobile no. is linked with Aadhaar
          </div>
          <img
            className="img-right-top"
            src={require(`assets/${productName}/ic_aadhaar_handy.svg`)}
          />
        </div>

        <div className="dialog-actions">
          <Button
            color="secondary"
            variant="raised"
            onClick={handleProceed}
            fullWidth
          >
            PROCEED
          </Button>
        </div>
      </section>
    </SlidingDialog>
  )
}

export default AadhaarDialog
