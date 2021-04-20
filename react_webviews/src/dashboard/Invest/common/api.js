import Api from 'utils/api';
import { isEmpty } from 'utils/validators';
import { apiConstants } from '../constants';
const genericErrMsg = 'Something went wrong';

export const get_recommended_funds = async (params) => {

  try {
    const res = await Api.get(`/api/invest/recommendv2`,params);
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
    const res = await Api.get('/api/persona/trends/gettrendingfunds');
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
    const res = await Api.get('/api/funds/category/subcategories');
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

export const getCampaign = async () => {
  const res = await Api.post(apiConstants.accountSummary, {
    campaign: ["user_campaign"],
  })
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrMsg
  }
  const { result, status_code: status } = res.pfwresponse
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrMsg
  }
}

export const getbankInvestment = async (data) => {
  const res = await Api.get(data.url)
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrMsg
  }
  const { result, status_code: status } = res.pfwresponse
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrMsg
  }
}

export const verifyCode = async (data) => {
  const res = await Api.get(apiConstants.verifyCode, data)
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrMsg
  }
  const { result, status_code: status } = res.pfwresponse
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrMsg
  }
}

export const applyReferralCode = async (code) => {
  const res = await Api.get(`api/referral/apply?code=${code}`);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrMsg
  }
  const { result, status_code: status } = res.pfwresponse
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrMsg
  }
}

export const getInstaRecommendation = async () => {
  const res = await Api.get(apiConstants.getInstaRecommendation);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw res.pfwmessage || genericErrMsg
  }
  const { result, status_code: status } = res.pfwresponse
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrMsg
  }
}