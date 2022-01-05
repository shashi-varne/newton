import Api from "utils/api";
import { API_CONSTANTS } from "./constants";
import isEmpty from "lodash/isEmpty";

const genericErrorMessage = "Something Went wrong!";

export const handleApi = (res) => {
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw new Error(res?.pfwmessage || genericErrorMessage);
  }
  const { result, status_code: status } = res.pfwresponse;
  if (status === 200) {
    return result;
  } else {
    throw new Error(result.error || result.message || genericErrorMessage);
  }
};

export const getPlanDetails = async (data) => {
  const res = await Api.post(API_CONSTANTS.getPlanDetails, data);
  return handleApi(res);
};

export const triggerPayment = async (data) => {
  const res = await Api.post(API_CONSTANTS.triggerPayment, data);
  return handleApi(res);
};
