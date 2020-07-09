import Api from '../../utils/api';
import { getConfig } from '../../utils/functions';
const platform = getConfig().productName;

export const requestStatement = async (params) => {
  try {
    const res = await Api.post('api/external_portfolio/cams/cas/send_mail', {
      ...params,
      platform,
    });
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || 'Something went wrong. Please try again');
    }
  } catch (e) {
    throw e;
  }
}

export const fetchExternalPortfolio = async (params) => {
  // send PAN and user ID
  try {
    const res = await Api.get('api/external_portfolio/list/holdings', params);
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || 'Something went wrong. Please try again');
    }
  } catch (e) {
    throw e;
  }
}

export const fetchAllHoldings = async (params) => {
  try {
    const res = await Api.get('api/external_portfolio/list/holdings', params);
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.response.holdings;
    } else {
      throw (result.error || result.message || 'Something went wrong. Please try again');
    }
  } catch (e) {
    throw e;
  }
}

export const fetchStatements = async (params) => {
  try {
    const res = await Api.get('api/external_portfolio/hni/fetch/statements', params);
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.statements || [];
    } else {
      throw (result.error || result.message || 'Something went wrong. Please try again');
    }
  } catch (e) {
    throw e;
  }
}

export const fetchEmails = async (params) => {
  try {
    const res = await Api.get('api/external_portfolio/list/emails/requests', params);
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.emails || [];
    } else {
      throw (result.error || result.message || 'Something went wrong. Please try again');
    }
  } catch (e) {
    throw e;
  }
}

export const deleteEmail = async (params) => {
  try {
    const res = await Api.get('api/external_portfolio/hni/remove/statements', params);
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || 'Something went wrong. Please try again');
    }
  } catch (e) {
    throw e;
  }
}

export const fetchAllPANs = async (params) => {
  try {
    // send userID
    const res = await Api.get('api/external_portfolio/hni/fetch/pans', params);
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result.pans.sort();
    } else {
      throw (result.error || result.message || 'Something went wrong. Please try again');
    }
  } catch (e) {
    throw e;
  }
}

