import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import { isEmpty } from 'lodash'
import { verifySSOTokenAndHMAC } from '../common/ApiCalls'
import { nativeCallback } from 'utils/native_callback'
import { navigate as navigateFunc } from '../common/functions'

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

  const handleExit = () => {
    setShowError("page")
    setErrorData({
      type: 'internet',
        button_text1: 'GO BACK',
        handleClick1: exit,
    })
  }

  useEffect(() => {
    if (isEmpty(token) || isEmpty(hmac)) {
      navigate(`/tax-filing`, {}, false)
    } else {
      redirect()
    }
  }, [])

  const redirect = async () => {
    try {
      setShowLoader(true)
      const data = await verifySSOTokenAndHMAC(token, hmac)
      nativeCallback({
        action: 'take_control',
        message: {
          back_text: 'You are almost there, do you really want to go back?',
        },
      })
      window.location.href = data?.url
    } catch (err) {
      setShowError("page")
      setErrorData({
        type: 'crash',
        title1: 'Error',
        title2: err?.message,
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
