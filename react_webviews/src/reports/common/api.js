import Api from "utils/api";
import { apiConstants } from "../constants";
import { isEmpty } from "utils/validators";
import toast from "common/ui/Toast";

const genericErrorMessage = "Something Went wrong!";

export const getSummaryV2 = async () => {
  try {
    const res = await Api.get(apiConstants.reportSummaryV2);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrorMessage;
    }
    const { result, status_code: status } = res.pfwresponse;
    switch (status) {
      case 200:
        return result;
      default:
        throw result.error || result.message || genericErrorMessage;
    }
  } catch (err) {
    toast(err || genericErrorMessage);
  }
};

export const getReportGoals = async () => {
  try {
    const res = await Api.get(apiConstants.reportGoals);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw genericErrorMessage;
    }
    const { result, status_code: status } = res.pfwresponse;
    switch (status) {
      case 200:
        return result;
      default:
        throw result.error || result.message || genericErrorMessage;
    }
  } catch (err) {
    toast(err || genericErrorMessage);
  }
};
