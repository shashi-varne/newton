import Api from 'utils/api';
import { isEmpty } from 'utils/validators';
const genericErrMsg = 'Something went wrong';

export const get_recommended_funds = async (params) => {

  try {
    const res = await Api.get(`api/invest/recommendv2`,params);
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
};

export const getTrendingFunds = async () => {

  try {
    const res = await Api.get('api/persona/trends/gettrendingfunds');
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
};

export const getSubCategories = async () => {

  try {
    const res = await Api.get('api/funds/category/subcategories');
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
};

export const getTerms = async (docType) => {

  try {
    const res = await Api.get(`api/cms/page/${docType}`);
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
};

export const querySearch = async (name) => {
  try {
    const res = await Api.get(
      `/api/funds/search?search_key=${encodeURIComponent(name)}`
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
      return null;
    }
  } catch (err) {
    return null;
  }
};
