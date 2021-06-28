import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Tax2WinLogo from '../mini-components/Tax2WinLogo'
import Container from '../common/Container'
import { isEmpty } from 'lodash'

import { getConfig } from 'utils/functions'

import './Redirection.scss'
import { clearITRSessionStorage } from '../common/functions'

function Redirection(props) {
  const redirectionUrl = props?.location?.params?.redirectionUrl
  if (isEmpty(redirectionUrl)) {
    return (
      <Redirect
        to={{
          location: props?.location,
          pathname: '/tax-filing/' + getConfig().searchParams,
        }}
      />
    )
  }
  useEffect(() => {
    const timerHandle = setTimeout(() => {
      clearITRSessionStorage()
      window.location.assign(redirectionUrl)
    }, 2000)
    return () => {
      clearInterval(timerHandle)
      clearITRSessionStorage()
    }
  }, [])

  return (
    <Container noFooter headerData={{ hide_icon: true }}>
      <div className="tax-filing-redirection flex-column justify-center align-center relative">
        <div className="centered tax-filing-redirection-loader"></div>
        <div className="body-text2 secondary center m-top-2x">
          You are being redirected to Tax2win platform to continue the ITR
          filing...
        </div>
        <div className="center m-top-1x helping-text secondary">
          Please do not press back or close the app
        </div>
      </div>

      <Tax2WinLogo
        classes={{ container: 'absolute' }}
        style={{ bottom: `calc(var(--spacing) * 3)`, left: 0, right: 0 }}
      />
    </Container>
  )
}

export default Redirection
