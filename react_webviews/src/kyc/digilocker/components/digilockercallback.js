import React from 'react'
import { Redirect } from 'react-router-dom'

const DigilockerCallback = (props) => {
  const status = props?.match?.params?.status
  if (status === 'success') {
    return <Redirect to="/kyc/digilocker/success" />
  }
  return <Redirect to="/kyc/digilocker/failed" />
}

export default DigilockerCallback
