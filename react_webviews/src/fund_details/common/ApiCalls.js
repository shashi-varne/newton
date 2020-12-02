import Api from 'utils/api';
import { isEmpty } from '../../utils/validators';
const genericErrMsg = 'Something Went wrong';
export const fetch_fund_details = async (isins) => {
  try {
    const res = await Api.get(`/api/funds/advance/report/text?isins=${isins}`);

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }
    const { result, status_code: status } = res.pfwresponse;
    if (result.text_report[0].error) {
      throw result.text_report[0].error;
    }
    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  } catch (err) {
    throw err;
  }
};

export const fetch_fund_graph = async (isin) => {
  try {
    const res = await Api.get(`/api/funds/advance/report/graph?isins=${isin}`);
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
