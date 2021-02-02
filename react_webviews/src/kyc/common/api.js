import Api from "utils/api";
import { apiConstants } from "../constants";
import { isEmpty } from "utils/validators";
import toast from "common/ui/Toast";

const genericErrorMessage = "Something Went wrong!";
export const getPan = async (data) => {
  const res = await Api.post(apiConstants.getPan, data);
  if (
    res.pfwstatus_code !== 200 ||
    !res.pfwresponse ||
    isEmpty(res.pfwresponse)
  ) {
    throw genericErrorMessage;
  }
  const { result, status_code: status } = res.pfwresponse;
  console.log(status);
  switch (status) {
    case 200:
      return result;
    case 402:
      accountMerge();
      break;
    case 403:
       toast("Network error")
       return;
    default:
      throw result.error || result.message || genericErrorMessage;
  }
};

const accountMerge = () => {};
