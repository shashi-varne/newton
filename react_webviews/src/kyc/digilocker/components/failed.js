import React, { useState } from 'react'
import Container from '../../common/Container'
import { initData } from '../../services'
import toast from 'common/ui/Toast'
import { getConfig } from 'utils/functions'
import { Button } from 'material-ui'

const Failed = (props) => {
  const [showLoader, setShowLoader] = useState(false)
  const retry = () => {
    
  }

  const proceed = () => {

  }

  const productName = getConfig().productName
  return (
    <Container showLoader={showLoader} hideInPageTitle noFooter>
      <section id="digilocker-failed">
        <div className="page-title">Aadhaar KYC Failed !</div>
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
          <Button variant="raised" fullWidth color="secondary" className="raised" onClick={retry}>
            RETRY
          </Button>
          <Button variant="outlined" fullWidth color="secondary" className="outlined" onClick={proceed}>
            CONTINUE WITH MANUAL KYC
          </Button>
        </footer>
      </section>
    </Container>
  )
}

export default Failed
