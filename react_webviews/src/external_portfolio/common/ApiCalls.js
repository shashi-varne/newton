import Api from '../../utils/api';
import { getConfig } from '../../utils/functions';
import { storageService, isEmpty } from '../../utils/validators';
const platform = getConfig().productName;
let boot = storageService().getObject('hni-boot');

function resetBootFlag() {
  boot = false;
  storageService().remove('hni-boot');
}

export const requestStatement = async (params) => {
  try {
    storageService().remove('hni-emails');
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
    const portfolio = storageService().getObject('hni-portfolio');
    if (boot || !portfolio || isEmpty(portfolio)) {
      resetBootFlag();
      const res = await Api.get('api/external_portfolio/list/holdings', params);
      const { result, status_code: status } = res.pfwresponse;
  
      if (status === 200) {
        storageService().setObject('hni-portfolio', result.response);
        return result.response;
      } else {
        throw (result.error || result.message || 'Something went wrong. Please try again');
      }
    } else {
      return portfolio;
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

export const fetchEmails = async (params = {}) => {
  try {
    const emails = storageService().getObject('hni-emails');
    if (boot || !emails || isEmpty(emails) || params.email_id) {
      resetBootFlag();
      const res = await Api.get('api/external_portfolio/list/emails/requests', params);
      const { result, status_code: status } = res.pfwresponse;
  
      if (status === 200) {
        storageService().setObject('hni-emails', result.emails);
        return result.emails || [];
      } else {
        throw (result.error || result.message || 'Something went wrong. Please try again');
      }
    } else {
      return emails;
    }
  } catch (e) {
    throw e;
  }
}

export const deleteEmail = async (params) => {
  try {
    storageService().remove('hni-emails');
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
    const pans = storageService().getObject('hni-pans');
    if (boot || !pans || isEmpty(pans)) {
      resetBootFlag();
      const res = await Api.get('api/external_portfolio/hni/fetch/pans', params);
      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        return result.pans.sort();
      } else {
        throw (result.error || result.message || 'Something went wrong. Please try again');
      }
    } else {
      return pans;
    }
  } catch (e) {
    throw e;
  }
}

