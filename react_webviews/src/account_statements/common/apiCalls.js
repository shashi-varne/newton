import Api from "../../utils/api";
import isEmpty from "lodash/isEmpty";

export const getStatement = async (reportType, params) => {
  try {
    const res = await Api.post(
      `/api/equity/api/eqm/get/broking/reports/${reportType}_statement`,
      params
    );

    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw Api.genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || Api.genericErrMsg;
    }
  } catch (e) {
    throw (e);
  }
}