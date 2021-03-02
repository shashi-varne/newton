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
      throw res.pfwmessage || genericErrorMessage;
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
      throw res.pfwmessage || genericErrorMessage;
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

export const getFunds = async (data) => {
  try {
    const res = await Api.get(apiConstants.getFunds, data);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw res.pfwmessage || genericErrorMessage;
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

export const getFundMf = async (data) => {
  const res = await Api.get(apiConstants.getFundMf, data);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw res.pfwmessage || genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrorMessage;
  }
};

export const getFundDetailsForSwitch = async (data) => {
  const res = await Api.get(apiConstants.getFundDetailsForSwitch, data);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw res.pfwmessage || genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrorMessage;
  }
};

export const getTransactions = async (data) => {
  try {
    const res = await Api.get(apiConstants.getTransactions, data);
    if (
      res.pfwstatus_code !== 200 ||
      !res.pfwresponse ||
      isEmpty(res.pfwresponse)
    ) {
      throw res.pfwmessage || genericErrorMessage;
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

export const getAvailableFundsForSwitch = async (data) => {
  const res = await Api.get(apiConstants.getAvailableFundsForSwitch, data);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw res.pfwmessage || genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrorMessage;
  }
};

export const postSwitchRecommendation = async (data) => {
  const res = await Api.post(apiConstants.postSwitchRecommendation, data);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw res.pfwmessage || genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      return result;
    default:
      throw result.message || result.error || genericErrorMessage;
  }
};

export const getSipAction = async (data) => {
  const res = await Api.get(
    `${apiConstants.getSipAction}${data.key}/${data.action}`
  );
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw res.pfwmessage || genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  switch (status) {
    case 200:
      return result;
    default:
      throw result.error || result.message || genericErrorMessage;
  }
};
