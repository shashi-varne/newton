import Api from "../../../../utils/api";
import { isEmpty } from "../../../../utils/validators";
import { apiConstants } from "../../constants";

const genericErrorMessage = "Something went wrong!";
export function getFormattedDate(input, addYear) {
  if (!input) {
    return null;
  } else {
    let pattern = /(.*?)\/(.*?)\/(.*?)$/;
    return input.replace(pattern, function (match, p1, p2, p3) {
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return (
        (p1 < 10 ? "0" + p1 : p1) +
        " " +
        months[p2 - 1] +
        (addYear ? " " + p3 : "")
      );
    });
  }
}

export function getSchemeOption(text) {
  if (!text) {
    return null;
  } else {
    return text.split("_").join(" ");
  }
}

export const getNfoRecommendation = async () => {
  const res = await Api.get(apiConstants.getNfoRecommendation);
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
