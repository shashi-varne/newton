import React from 'react'
import { Redirect } from 'react-router-dom'
import { navigate as navigateFunc} from '../../common/functions'
import { getUrlParams } from '../../../utils/validators'

const DigilockerCallback = (props) => {
  const navigate = navigateFunc.bind(props);
  const status = getUrlParams().status || ""
  if (status === 'success') {
    navigate('/kyc/digilocker/success')
    // return <Redirect to="/kyc/digilocker/success" />
  }
  // return <Redirect to="/kyc/digilocker/failed" />
    navigate('/kyc/digilocker/success')

    return <></>
}

export default DigilockerCallback
