import Api from '../../utils/api';
import { storageService, isEmpty } from '../../utils/validators';
import { genericErrMsg } from '../constants';
import { remove } from 'lodash';
// function resetBootFlag() {
//   boot = false;
//   storageService().remove('wr-boot');
// }
// function resetLSKeys(keys = []) {
//   keys.map(key => storageService().remove(key));
// }
const platform = 'fisdom';
let boot = true;
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

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

export const overview = async (params) => {
  try {
    const res = await Api.get('/api/invest/reportv4/portfolio/summary', {
      ...params,
      user_id: '4934000205365249',
      platform,
    });

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

export const hitNextPage = async (next_page, params) => {
  try {
    const res = await Api.get(next_page, params);

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

export const portfolioRisk = async (params = {}) => {
  try {
    if (boot) {
      const res = await Api.get('api/fetch/portfolio-risk', {
        ...params,
        user_id: '4934000205365249',
      });

      if (
        res.pfwstatus_code !== 200 ||
        !res.pfwresponse ||
        isEmpty(res.pfwresponse)
      ) {
        throw genericErrMsg;
      }

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        return result || {};
      } else {
        throw result.error || result.message || genericErrMsg;
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
    const res = await Api.get(
      'api/external_portfolio/report/fetch/analysis',
      params
    );

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

export const holdings = async (params = {}) => {
  try {
    const res = await Api.get('api/invest/reportv4/portfolio/funds', { ...params, user_id: '4934000205365249'});

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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
    const res = await Api.get('api/fetch/fund-details', { ...params, user_id: '4934000205365249' });

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

export const fetchPortfolioAnalysis = async (params = {}) => {
  try {
    const res = await Api.post('api/fetch/portfolio-analysis?user_id=4934000205365249', {
      ...params,
    });

    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
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

export const fetchPortfolioAnalysisMock = async (params = {}) => {
  const isSuccess = true;
  try {
    if (isSuccess) {
      return new Promise((resolve) => {
        setTimeout(() =>
          resolve(analysisPageApiMockSuccess.pfwresponse.result)
        , 1000);
      });
    } else {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(analysisPageApiMockError.pfwresponse.result);
        }, 1000);
      });
    }
  } catch (e) {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(analysisPageApiMockError.pfwresponse.result);
      }, 1000);
    });
  }
};

const analysisPageApiMockSuccess = {
  pfwstatus_code: 200,
  pfwtime: '2020-11-12 05:27:51.443542',
  pfwresponse: {
    status_code: 200,
    requestapi: '',
    result: {
      maturity_exposure: {
        '0-1y': 100.0,
        '1-5': 20,
        '5-10': 20,
        '10-20': 10,
      },
      sector_alloc: {
        Healthcare: 5.81,
        'Financial Services': 52.5,
        'Communication Services': 2.43,
        Utilities: 6.08,
        'Real Estate': 0.43,
        Energy: 9.9,
        Industrials: 5.28,
        Technology: 8.95,
        'Basic Materials': 4.12,
        'Consumer Cyclical': 1.82,
        'Consumer Defensive': 2.69,
      },
      market_cap_alloc: {
        small_cap_alloc: 4.62,
        mid_cap_alloc: 19.77,
        large_cap_alloc: 75.61,
      },
      top_amcs: {
        equity: [
          {
            amc_logo:
              'http://localhost/static/img/amc-logo/high-res/hdfc_new.png',
            share: 53.02,
            amc_name: 'HDFC Mutual Fund',
          },
          {
            amc_logo:
              'http://localhost/static/img/amc-logo/high-res/icici_new.png',
            share: 46.98,
            amc_name: 'ICICI Prudential Mutual Fund',
          },
        ],
        debt: [],
      },
      rating_exposure: {
        SOV: 12.03,
        AA: 18.7,
        A: 18.17,
        Others: 51.1,
      },
      top_holdings: {
        equity: [
          {
            holding_sector_name: 'Financial Services',
            instrument_name: 'HDFC Bank Ltd',
            share: 8.41,
          },
          {
            holding_sector_name: 'Financial Services',
            instrument_name: 'ICICI Bank Ltd',
            share: 7.89,
          },
          {
            holding_sector_name: 'Energy',
            instrument_name: 'Reliance Industries Ltd',
            share: 6.41,
          },
          {
            holding_sector_name: 'Technology',
            instrument_name: 'Infosys Ltd',
            share: 5.57,
          },
          {
            holding_sector_name: 'Financial Services',
            instrument_name: 'Axis Bank Ltd',
            share: 4.3,
          },
          {
            holding_sector_name: 'Financial Services',
            instrument_name: 'State Bank of India',
            share: 3.55,
          },
          {
            holding_sector_name: 'Utilities',
            instrument_name: 'NTPC Ltd',
            share: 2.81,
          },
          {
            holding_sector_name: 'Healthcare',
            instrument_name: 'Cipla Ltd',
            share: 2.63,
          },
          {
            holding_sector_name: 'Financial Services',
            instrument_name: 'Motilal Oswal Financial Services Ltd',
            share: 2.54,
          },
          {
            holding_sector_name: 'Energy',
            instrument_name: 'Bharat Petroleum Corp Ltd',
            share: 2.4,
          },
        ],
        debt: [
          {
            instrument_name: 'HDFC Ltd.',
            share: 51.1,
          },
          {
            instrument_name: 'Muthoot Finance Limited',
            share: 18.7,
          },
          {
            instrument_name: 'Punjab National Bank',
            share: 18.17,
          },
          {
            instrument_name: '182 DTB 12112020',
            share: 12.03,
          },
        ],
      },
    },
  },
  pfwuser_id: 5648541271719936,
  pfwutime: '',
  pfwmessage: 'Success',
};

const analysisPageApiMockError = {
  pfwstatus_code: 200,
  pfwtime: '2020-11-12 05:29:47.798146',
  pfwresponse: {
    status_code: 400,
    requestapi: '',
    result: {
      error: 'MF data could not be fetched from mfservice',
    },
  },
  pfwuser_id: 5648541271719936,
  pfwutime: '',
  pfwmessage: 'Success',
};

export const getTransactions = async (params = {}) => {
  try {
    const res = await Api.get('api/invest/transactionv4', { ...params, user_id: '4934000205365249' });

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



