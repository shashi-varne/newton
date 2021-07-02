import Api from 'utils/api'
import { genericErrMsg } from '../constants'

export const getUserAccountSummary = async () => {
  const options = {
    user: ['user'],
    kyc: ['kyc'],
  }

  const URL = '/api/user/account/summary'
  const res = await Api.post(URL, options)

  if (res?.pfwresponse?.status_code === 200) {
    const kyc = res?.pfwresponse?.result?.data?.kyc?.kyc?.data
    const user = res?.pfwresponse?.result?.data?.user?.user?.data
    return { kyc, user }
  } else {
    throw new Error(
      res?.pfwresponse?.result?.error ||
        res?.pfwresponse?.result?.message ||
        genericErrMsg
    )
  }
}

export const getITRUserDetails = async () => {
  const URL = '/api/itr/get-user-details'
  const res = await Api.get(URL)

  if (res?.pfwresponse?.status_code === 200) {
    const user = res?.pfwresponse?.result
    return user
  } else {
    throw new Error(
      res?.pfwresponse?.result?.error ||
        res?.pfwresponse?.result?.message ||
        genericErrMsg
    )
  }
}

export const createITRApplication = async (params = {}) => {
  const URL = '/api/itr/applications'
  const res = await Api.post(URL, params)
  if (res?.pfwresponse?.status_code === 200) {
    return res?.pfwresponse?.result
  } else {
    const messageToDisplay =
      res?.pfwresponse.result?.message?.phone ||
      res?.pfwresponse.result?.message?.email ||
      res?.pfwresponse?.result?.message?.full_name
    throw new Error(messageToDisplay || genericErrMsg)
  }
}

export const getITRList = async () => {
  const URL = '/api/itr/applications'
  const res = await Api.get(URL)
  if (res?.pfwresponse?.status_code === 200) {
    return res?.pfwresponse?.result
  } else {
    throw new Error(
      res?.pfwresponse?.result?.error ||
        res?.pfwresponse?.result?.message ||
        genericErrMsg
    )
  }
}

export const resumeITRApplication = async (itrId) => {
  const URL = `/api/itr/applications?itr_id=${itrId}`
  const res = await Api.put(URL)
  if (res?.pfwresponse?.status_code === 200) {
    return res?.pfwresponse?.result
  } else {
    throw new Error(
      res?.pfwresponse?.result?.error ||
        res?.pfwresponse?.result?.message ||
        genericErrMsg
    )
  }
}

export const verifySSOTokenAndHMAC = async (token, hmac) => {
  const URL = `/api/itr/sso`
  const params = { token, hmac }
  const res = await Api.get(URL, params)
  if (res?.pfwresponse?.status_code === 200) {
    return res?.pfwresponse?.result
  } else {
    throw new Error(
      res?.pfwresponse?.result?.error ||
        res?.pfwresponse?.result?.message ||
        genericErrMsg
    )
  }
}
