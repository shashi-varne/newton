import Api from '../../utils/api';
import { isEmpty } from 'utils/validators';
import { getConfig } from 'utils/functions';
const genericErrMsg = 'Something went wrong';

export const getWithdrawReasons = async () => {

  try {
    const res = await Api.get('api/user-consent/redemption');
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
