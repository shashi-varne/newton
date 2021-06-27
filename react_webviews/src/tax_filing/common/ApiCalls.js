import Api from 'utils/api'
import { genericErrMsg } from '../constants'

export const getUserAccountSummary = async () => {
  const options = {
    user: ['user'],
  }

  const URL = '/api/user/account/summary'
  const res = await Api.post(URL, options)

  if (res?.pfwresponse?.status_code === 200) {
    return res?.pfwresponse?.result?.data?.user?.user?.data
  } else {
    throw new Error(
      res?.pfwresponse?.result?.message ||
        res?.pfwresponse?.result?.error ||
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
    throw new Error(
      res?.pfwresponse?.result?.message ||
        res?.pfwresponse?.result?.error ||
        genericErrMsg
    )
  }
}

export const getITRList = async (params = {}) => {
  const URL = '/api/itr/applications'
  const res = await Api.get(URL)
  if (res?.pfwresponse?.status_code === 200) {
    return res?.pfwresponse?.result
  } else {
    throw new Error(
      res?.pfwresponse?.result?.message ||
        res?.pfwresponse?.result?.error ||
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
      res?.pfwresponse?.result?.message ||
        res?.pfwresponse?.result?.error ||
        genericErrMsg
    )
  }
}
