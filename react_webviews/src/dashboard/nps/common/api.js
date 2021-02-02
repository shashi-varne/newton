import Api from "utils/api";
import { isEmpty } from 'utils/validators';
const genericErrMsg = "Something went wrong";

export const get_recommended_funds = async (params) => {
  try {
    const res = await Api.get(`api/nps/invest/recommend?amount=50000`);
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
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
};
