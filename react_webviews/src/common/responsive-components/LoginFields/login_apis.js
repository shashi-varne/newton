import Api from '../../../utils/api';
import { storageService, isEmpty } from '../../../utils/validators';
const genericErrMsg = 'Something went wrong. Please try again';

export const login = async (params) => {
  const { mobileNo, countryCode, ...rest } = params;
  try {
    const res = await Api.get('api/iam/userauthstatus', {
      auth_type: "mobile",
      auth_value: `${params.countryCode}|${params.mobileNo}`,
      ...rest,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const emailLogin = async (params) => {
  try {
    const res = await Api.post('api/user/login', params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const emailRegister = async (params) => {
  try {
    const res = await Api.post(`api/user/register?email=${params.email}&password=${params.password}`);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const resendVerification = async (params) => {
  try {
    const res = await Api.get('/api/resendverfication', params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const forgotPassword = async (params) => {
  try {
    const res = await Api.get('/api/forgotpassword', params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const logout = async (params) => {
  try {
    const res = await Api.get('api/logout');

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      storageService().clear();
      return result;
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const verifyOtp = async (params) => {
  const { mobileNo, countryCode, otp, ...rest } = params;
  try {
    const res = await Api.get('api/mobile/login', {
      mobile_number: `${params.countryCode}|${params.mobileNo}`,
      otp,
      ...rest,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const resendOtp = async () => {
  try {
    const res = await Api.get('api/resendotp', {});

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};
