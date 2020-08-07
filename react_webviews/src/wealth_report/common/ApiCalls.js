import Api from '../../utils/api';
import { getConfig } from '../../utils/functions';
import { storageService, isEmpty } from '../../utils/validators';
import { genericErrMsg } from '../constants';

export const login = async (params) => {
  try {
    const res = await Api.post('api/user/login', params);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw (result.error || result.message || genericErrMsg);
    }
  } catch (e) {
    throw e;
  }
};