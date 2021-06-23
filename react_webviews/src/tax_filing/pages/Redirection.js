import React from 'react'
import Tax2WinLogo from '../mini-components/Tax2WinLogo'
import Container from '../common/Container'

import './Redirection.scss'

function Redirection(props) {
  return (
    <Container
      noHeader
      disableFadeIn
      noFooter
      headerData={{ hide_icon: true }}
      classOverRide="tax-filing-full-height"
      classOverRideContainer="tax-filing-full-height tax-bottom-pd-20-important"
      parentStyles={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <div className="tax-filing-redirection flex-column">
        <div className="align-self-center justify-self-center centered tax-filing-redirection-loader"></div>
        <div className="body-text2 secondary center m-top-2x">
          You are being redirected to Tax2win platform to continue the ITR
          filing...
        </div>
        <div className="center m-top-1x helping-text secondary">
          Please do not press back or close the app
        </div>
        <Tax2WinLogo classes={{ container: 'align-self-end' }} />
      </div>
    </Container>
  )
}

export default Redirection
