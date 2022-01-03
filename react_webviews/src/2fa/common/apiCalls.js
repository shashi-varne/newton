import Api from "../../utils/api";
import { isEmpty } from "lodash";
const genericErrMsg = 'Something went wrong. Please try again!'

const handleApiResponse = (res) => {
  if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
    throw genericErrMsg;
  }

  const { result, status_code: status } = res.pfwresponse;

  if (status === 200) {
    return result;
  } else {
    throw result.error || result.message || genericErrMsg;
  }
}

export const setPin = async (params = {}) => {
  try {
    const res = await Api.post('/api/iam/mpin/v2/set', params);
    return handleApiResponse(res);
  } catch (e) {
    throw e;
  }
}

export const verifyPin = async (params = {}) => {
  try {
    const res = await Api.post('/api/iam/mpin/v2/verify', params);
    return handleApiResponse(res);
  } catch (e) {
    throw e;
  }
}

export const obscuredAuthGetter = async () => {
  try {
    const res = await Api.get('/api/iam/mpin/v2/get/obscured_auth');
    return handleApiResponse(res);
  } catch (e) {
    throw e;
  }
}

export const forgotPinOtpTrigger = async (params = {}) => {
  try {
    const res = await Api.post('/api/iam/mpin/v2/forgot', params);
    return handleApiResponse(res);
  } catch (e) {
    throw e;
  }
}

export const twofaPostApi = async (url, params = {}) => {
  // Generic function to make a POST API call
  try {
    const res = await Api.post(url, params);
    return handleApiResponse(res);
  } catch (e) {
    throw e;
  }
}

export const modifyPin = async (params = {}) => {
  try {
    const res = await Api.post('/api/iam/mpin/v2/modify', params);
    return handleApiResponse(res);
  } catch (e) {
    throw e;
  }
}