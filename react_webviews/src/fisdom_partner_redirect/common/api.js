import Api from '../../utils/api';
import {isEmpty } from 'utils/validators';
const genericErrMsg = 'Something went wrong';

export const validate_user = async (mobile_num) => {

  try {
    const res = await Api.get(`api/partner/check/user/tagged/obc?mobile_no=${mobile_num}`);
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
