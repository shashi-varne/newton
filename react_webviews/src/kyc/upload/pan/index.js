import React, { useState, useEffect } from 'react'
import Container from '../../common/Container'
import Alert from '../../mini_components/Alert'
import { initData } from '../../services'
import { storageService, isEmpty } from '../../../utils/validators'
import { storageConstants } from '../../constants'

const Pan = () => {
  const [kyc, setKyc] = useState(
    storageService().getObject(storageConstants.KYC) || null
  )

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      await initData()
      const kyc = storageService().getObject(storageConstants.KYC)
      setKyc(kyc)
    } catch (err) {
      console.error(err)
    } finally {
      console.log('Finally')
    }
  }

  return (
    <Container
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      classOverRideContainer="pr-container"
      fullWidthButton={true}
      handleClick={(event) => {
        console.log(event)
      }}
      disable={true}
    >
      <section id="kyc-upload-pan" className="page-body-kyc">
        <div className="title">Upload PAN</div>
        {/* <div className="sub-title">PAN Card {kyc?.pan?.meta_data?.pan_number}</div> */}
        <Alert
          variant="attention"
          title="Note"
          message="1. Photo of PAN Card should have your signature.
          2. Photo of PAN should be clear and it should not have the exposure of flash light."
        />
      </section>
      <div className="kyc-doc-upload-container">
        <div className="caption">Upload front side of PAN Card</div>
      </div>
    </Container>
  )
}

export default Pan
