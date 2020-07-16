import Api from '../../utils/api';
import { getConfig } from '../../utils/functions';
import { storageService, isEmpty } from '../../utils/validators';
const platform = getConfig().productName;
let boot = true;
function resetBootFlag() {
  boot = false;
  storageService().remove('hni-boot');
}
function resetLSKeys(keys = []) {
  keys.forEach(key => storageService().remove(key));
}

storageService().setObject('hni-boot', boot);
resetLSKeys(['hni-emails', 'hni-pans', 'hni-portfolio', 'hni-holdings', 'hni-holdings-next-page']);

export const requestStatement = async (params) => {
  try {
    storageService().remove('hni-emails');

    const res = await Api.post('api/external_portfolio/cams/cas/send_mail', {
      ...params,
      platform,
    });

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw ('Something went wrong. Please try again');
    }

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
      // If Portfolio is being fetched fresh from Server, so should fund holdings
      storageService().remove('hni-holdings');
      resetBootFlag();

      const res = await Api.get('api/external_portfolio/list/holdings', params);

      if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
        throw ('Something went wrong. Please try again');
      }

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
    const holdings = storageService().getObject('hni-holdings');
    const next_page_url = storageService().getObject('hni-holdings-next-page');

    if (boot || !holdings || isEmpty(holdings)) {
      const res = await Api.get(
        'api/external_portfolio/fetch/mf/holdings',
        Object.assign({}, params, { page_size: 10 })
      );

      if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
        throw ('Something went wrong. Please try again');
      }

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        storageService().setObject('hni-holdings', result.response.holdings);
        storageService().setObject('hni-holdings-next-page', result.next_page_url);
        return result;
      } else {
        throw (result.error || result.message || 'Something went wrong. Please try again');
      }
    } else {
      return { response: { holdings }, next_page_url };
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
      
      if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
        throw ('Something went wrong. Please try again');
      }
      
      const { result, status_code: status } = res.pfwresponse;
  
      if (status === 200) {
        if (!params.email_id) storageService().setObject('hni-emails', result.emails);
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
    // Deleting an email can result in deletion of PANs
    storageService().remove('hni-emails');

    const res = await Api.get('api/external_portfolio/hni/remove/statements', params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw ('Something went wrong. Please try again');
    }

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
    const pans = storageService().getObject('hni-pans');

    if (boot || !pans || isEmpty(pans)) {
      resetBootFlag();
      const res = await Api.get('api/external_portfolio/hni/fetch/pans', params);

      if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
        throw ('Something went wrong. Please try again');
      }

      const { result, status_code: status } = res.pfwresponse;

      if (status === 200) {
        storageService().setObject('hni-pans', result.pans);
        return result.pans.sort();
      } else {
        throw (result.error || result.message || 'Something went wrong. Please try again');
      }
    } else {
      return pans.sort();
    }
  } catch (e) {
    throw e;
  }
}

export const hitNextPage = async (next_page_url, params) => {
  try {
    const res = await Api.get(next_page_url, params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw ('Something went wrong. Please try again');
    }

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

