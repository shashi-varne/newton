import Api from 'utils/api';
import { isEmpty } from 'utils/validators';
const genericErrMsg = 'Something went wrong';

export const applyPromoCode = async (code) => {
  try {
    const res = await Api.get(`api/referral/apply?code=${code}`);
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error;
    }
  } catch (err) {
    throw err;
  }
};

export const getPromocode = async () => {

  try {
    const res = await Api.get('/api/referral/mine');
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