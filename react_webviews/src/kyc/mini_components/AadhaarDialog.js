import React from 'react'
import { getConfig } from '../../utils/functions'
import SlidingDialog from './SlideBottomDialog'

const AadhaarDialog = ({ id, open, close, ...props }) => {
  const productName = getConfig().productName
  return (
    <SlidingDialog id={id} open={open} close={close} {...props}>
      <section className="kyc-dl-aadhaar-dialog">
        <img
          className="img-right-top"
          src={require(`assets/${productName}/ic_aadhaar_handy.svg`)}
        />
        <div className="heading">
          Please ensure your mobile no. is linked with Aadhaar
        </div>
      </section>
    </SlidingDialog>
  )
}

export default AadhaarDialog
