import Api from '../../utils/api';
import { storageService, isEmpty } from '../../utils/validators';
import { genericErrMsg } from '../constants';
function resetBootFlag() {
  boot = false;
  storageService().remove('wr-boot');
}
function resetLSKeys(keys = []) {
  keys.map(key => storageService().remove(key));
}
const platform = 'fisdom';
let boot = true;
storageService().setObject('wr-boot', boot);
resetLSKeys(['wr-emails', 'wr-pans', 'wr-holdings']);

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

export const requestStatement = async (params) => {
  try {
    storageService().remove('wr-emails');

    const res = await Api.post('api/external_portfolio/cams/cas/send_mail', {
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
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const fetchEmails = async (params = {}) => {
  try {
    const emails = storageService().getObject('wr-emails');

    if (boot || !emails || isEmpty(emails) || params.email_id) {
      resetBootFlag();
      const res = await Api.get('api/external_portfolio/list/emails/requests', params);

      if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
        throw genericErrMsg;
      }

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        if (!params.email_id) storageService().setObject('wr-emails', result.emails);
        return result.emails || [];
      } else {
        throw (result.error || result.message || genericErrMsg);
      }
    } else {
      return emails;
    }
  } catch (e) {
    throw e;
  }
};

export const fetchAllPANs = async (params) => {
  try {
    const pans = storageService().getObject('wr-pans');

    if (boot || !pans || isEmpty(pans)) {
      resetBootFlag();
      const res = await Api.get('api/external_portfolio/hni/fetch/pans');

      if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
        throw genericErrMsg;
      }

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        storageService().setObject('wr-pans', result.pans);
        return result.pans.sort();
      } else {
        throw (result.error || result.message || genericErrMsg);
      }
    } else {
      return pans.sort();
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
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const fetchOverview = async (params = {}) => {
  try {
    const overview = storageService().getObject('wr-overview');
    if (boot || !overview || isEmpty(overview)) {
      resetBootFlag();
      const res = await Api.get('api/external_portfolio/report/fetch/portfolio/insights', params);

      if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
        throw genericErrMsg;
      }

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        return result.response || {};
      } else {
        throw (result.error || result.message || genericErrMsg);
      }
    } else {
      return overview;
    }
  } catch (e) {
    throw e;
  }
};

export const fetchAnalysis = async (params = {}) => {
  try {
    const res = await Api.get('api/external_portfolio/report/fetch/analysis', params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.response || {};
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const fetchHoldings = async (params = {}) => {
  try {
    const holdings = storageService().getObject('wr-holdings');
    if (boot || !holdings || isEmpty(holdings)) {
      resetBootFlag();
      const res = await Api.get('api/external_portfolio/fetch/mf/holdings', params);

      if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
        throw genericErrMsg;
      }

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        return result || {};
      } else {
        throw (result.error || result.message || genericErrMsg);
      }
    } else {
      return holdings;
    }
  } catch (e) {
    throw e;
  }
};

export const fetchTaxation = async (params = {}) => {
  try {
    const taxation = storageService().getObject('wr-taxation');
    if (boot || !taxation || isEmpty(taxation)) {
      resetBootFlag();
      const res = await Api.post('api/external_portfolio/report/fetch/tax-info', params);
      if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
        throw genericErrMsg;
      }

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        return result || {};
      } else {
        throw (result.error || result.message || genericErrMsg);
      }
    } else {
      return taxation;
    }
  } catch (e) {
    throw e;
  }
};

export const fetchPortfolioGrowth = async (params = {}) => {
  try {
    const res = await Api.post('api/external_portfolio/report/graph', params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result || {};
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const fetchTaxFilters = async (params = {}) => {
  try {
    const res = await Api.post('api/external_portfolio/report/fetch/tax-filters', params);

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

export const fetchTransactions = async (params = {}) => {
  try {
    const res = await Api.get('api/external_portfolio/report/list/transactions', params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result || {};
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

export const fetchXIRR = async (params = {}) => {
  try {
    const res = await Api.get('api/external_portfolio/report/calculate/xirr', params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.response || {};
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};

