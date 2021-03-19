import React from 'react'
import SlidingDialog from './SlideBottomDialog'
import Button from '@material-ui/core/Button'
import { getConfig, isMobile } from 'utils/functions'

const AadhaarDialog = ({ id, open, close, handleProceed, ...props }) => {
  const productName = getConfig().productName
  return (
    <SlidingDialog id={id} open={open} close={close} {...props} onClick={close}>
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
