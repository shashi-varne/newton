import Api from '../../utils/api';
import { getConfig } from '../../utils/functions';
const platform = getConfig().productName;

export const requestStatement = async (params) => {
  try {
    const res = await Api.post('api/external_portfolio/cams/cas/send_mail', {
      ...params,
      platform,
    });
  } catch (e) {
    throw e;
  }
}

export const fetchExternalPortfolio = async (params) => {
  // send PAN and user ID
  try {
    const res = await Api.post('api/external_portfolio/list/holdings', { params });
    const { result, status_code: status } = res.pfwresponse;
    return result;
  } catch (e) {
    throw e;
  }
}

export const fetchAllHoldings = async (params) => {
  // send PAN and user ID
  try {
    const res = await Api.get('api/external_portfolio/list/holdings', { params });
    const { result, status_code: status } = res.pfwresponse;
    return result.holdings;
  } catch (e) {
    throw e;
  }
}

export const fetchEmails = async (params) => {
  // send user ID and if req, email ID (for email specific resp)
  try {
    const res = await Api.get('api/external_portfolio/hni/fetch/statements', { params });
    const { result, status_code: status } = res.pfwresponse;
    return result.statements;
  } catch (e) {
    throw e;
  }
}

export const deleteEmail = async (params) => {
  try {
    // send user ID and statement ID
    const res = await Api.get('api/external_portfolio/hni/fetch/statements', { params });
    const { result, status_code: status } = res.pfwresponse;
    return result;
  } catch (e) {
    throw e;
  }
}

export const fetchAllPANs = async (params) => {
  try {
    // send userID
    const res = await Api.get('api/external_portfolio/hni/fetch/pans', { params });
    const { result, status_code: status } = res.pfwresponse;
    return result;
  } catch (e) {
    throw e;
  }
}

