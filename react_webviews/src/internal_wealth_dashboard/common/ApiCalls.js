import Api from '../../utils/api';
import { storageService, isEmpty } from '../../utils/validators';
import { genericErrMsg } from '../constants';
// function resetBootFlag() {
//   boot = false;
//   storageService().remove('wr-boot');
// }
// function resetLSKeys(keys = []) {
//   keys.map(key => storageService().remove(key));
// }
const platform = 'fisdom';
// let boot = true;
// storageService().setObject('wr-boot', boot);
// resetLSKeys(['wr-emails', 'wr-pans', 'wr-holdings']);

export const login = async (params) => {
  const { mobileNo, countryCode, ...rest } = params;
  try {
    const res = await Api.get('api/iam/userauthstatus', {
      auth_type: 'mobile',
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
      throw result.error || result.message || genericErrMsg;
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
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const emailRegister = async (params) => {
  try {
    const res = await Api.post(
      `api/user/register?email=${params.email}&password=${params.password}`
    );

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
      throw result.error || result.message || genericErrMsg;
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
      throw result.error || result.message || genericErrMsg;
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
      throw result.error || result.message || genericErrMsg;
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
      throw result.error || result.message || genericErrMsg;
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
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const getOverview = async (params) => {
  try {
    const res = await Api.get('/api/invest/reportv4/portfolio/summary', {
      ...params,
      platform,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.report;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const getGrowthData = async (params) => {
  // return dummyGrowth.data;
  try {
    const res = await Api.get('/api/invest/report/get/performance-graph', {
      ...params,
      platform,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.data;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const getGrowthXirr = async (params) => {
  try {
    const res = await Api.get('/api/reports/xirr', {
      ...params,
      platform,
    });

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
};

export const hitNextPage = async (next_page, params) => {
  try {
    const res = await Api.get(next_page, params);

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
};

export const getPortfolioRisk = async (params = {}) => {
  try {
    const res = await Api.get('api/reports/portfolio-risk', {
      ...params,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result || {};
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const getNewsletter = async (params = {}) => {
  try {
    const res = await Api.get('api/cms/article/category/4?sort=desc', {
      ...params,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result || {};
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const getHoldings = async (params = {}) => {
  try {
    const res = await Api.get('api/invest/reportv4/portfolio/funds', {
      ...params,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.report || [];
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const getFundDetail = async (params = {}) => {
  try {
    const res = await Api.get('api/reports/fund-details', { ...params });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.fund_data || {};
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const getPortfolioAnalysis = async (params = {}) => {
  try {
    const res = await Api.post('api/reports/portfolio-analysis', {
      ...params,
    });

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
};

export const getTransactions = async (params = {}) => {
  try {
    const res = await Api.get('api/invest/transactionv4', {
      ...params,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result || {};
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const getPortfolioFundNames = async () => {
  try {
    const res = await Api.get('api/reports/portfolio-fund-names');

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result || {};
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};

export const getGainsElssYears = async () => {
  try {
    const res = await Api.get('api/iam/myaccount');

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result || {};
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (e) {
    throw e;
  }
};