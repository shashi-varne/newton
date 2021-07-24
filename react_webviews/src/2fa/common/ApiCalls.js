import Api from "../../utils/api";
import { isEmpty } from "lodash";
const genericErrMsg = 'Something went wrong. Please try again!'

export const verifyPin = async (params = {}) => {
  try {
    const res = await Api.post('/api/iam/mpin/v2/verify', {
      ...params,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
}

export const obscuredAuthGetter = async () => {
  try {
    const res = await Api.get('/api/iam/mpin/v2/get/obscured_auth');

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
}

export const forgotPinOtpTrigger = async (params = {}) => {
  try {
    const res = await Api.post('/api/iam/mpin/v2/forgot', { ...params });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
}

export const otpApiCall = async (url, otp) => {
  // Can be reused by both resend as well as verify
  try {
    const res = await Api.post(url, { otp });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
}

export const twofaPostApi = async (url, params) => {
  // Generic function to make a POST API call
  try {
    const res = await Api.post(url, { ...params });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
}