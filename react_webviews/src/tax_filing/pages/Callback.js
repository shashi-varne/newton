import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import { isEmpty } from 'lodash'
import { verifySSOTokenAndHMAC } from '../common/ApiCalls'
import { nativeCallback } from 'utils/native_callback'
import { navigate as navigateFunc } from '../common/functions'
import { getConfig, getBasePath } from 'utils/functions'

function Callback(props) {
  const navigate = navigateFunc.bind(props)
  const [errorData, setErrorData] = useState({})
  const [showLoader, setShowLoader] = useState(false)
  const [showError, setShowError] = useState(false)

  const params = new URLSearchParams(props.location.search)

  const token = params.get('token') || ''
  const hmac = params.get('hmac') || ''

  const exit = () => {
    nativeCallback({ action: 'exit' })
  }

  useEffect(() => {
    if (isEmpty(token) || isEmpty(hmac)) {
      setShowError('page')
      setErrorData({
        type: 'generic',
        button_text1: 'GO BACK',
        handleClick1: () => {
          navigate(`/tax-filing`, {}, false)
          return
        },
      })
    } else {
      redirect()
    }
  }, [])

  const redirect = async () => {
    try {
      setShowLoader(true)
      const data = await verifySSOTokenAndHMAC(token, hmac)
      const backUrl = getBasePath() + '/tax-filing' + getConfig().searchParams
      if (getConfig().app === 'ios') {
        nativeCallback({
          action: 'show_top_bar',
          message: {
            title: 'You are almost there, do you really want to go back?',
          },
        })
      }
      nativeCallback({
        action: 'take_control',
        message: {
          back_url: backUrl,
          back_text: 'You are almost there, do you really want to go back?',
        },
      })
      window.location.href = data?.url
    } catch (err) {
      setShowError('page')
      setErrorData({
        type: 'generic',
        title1: 'Error',
        title2: err?.message,
        button_text1: 'CLOSE',
        handleClick1: exit,
      })
    }
  }

  const goBack = () => {
    nativeCallback({ action: 'exit' })
  }
  return (
    <Container
      headerData={{ goBack }}
      showError={showError}
      errorData={errorData}
      skelton={showLoader}
      noFooter
    >
      <></>
    </Container>
  )
}

export default Callback
