import React, { useEffect } from 'react'
import Tax2WinLogo from '../mini-components/Tax2WinLogo'
import Container from '../common/Container'
import { isEmpty } from 'lodash'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig, getBasePath } from 'utils/functions'

import './Redirection.scss'
import { clearITRSessionStorage } from '../common/functions'
import { nativeCallback } from 'utils/native_callback'

function Redirection(props) {
  const navigate = navigateFunc.bind(props)
  const redirectionUrl = props?.location?.params?.redirectionUrl

  useEffect(() => {
    const timerHandle = setTimeout(() => {
      clearITRSessionStorage()
      const backUrl = getBasePath() + '/tax-filing' + getConfig().searchParams
      nativeCallback({
        action: 'take_control',
        message: {
          back_url: backUrl,
          back_text: 'You are almost there, do you really want to go back?',
        },
      })
      window.location.href = redirectionUrl
    }, 2000)
    return () => {
      clearInterval(timerHandle)
      clearITRSessionStorage()
    }
  }, [])

  if (isEmpty(redirectionUrl)) {
    navigate('/tax-filing', {}, false)
    return <></>
  }

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
