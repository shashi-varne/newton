import { getConfig } from "utils/functions";
import { storageService } from "utils/validators";
import { formatAmountInr } from "../../utils/validators";

export function navigate(pathname, data = {}) {
  if (data.edit) {
    this.history.replace({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data.state,
      params: data.params,
    });
  } else {
    this.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data.state,
      params: data.params,
    });
  }
}

export const getProjectedValue = (amount, year, invest_type) => {
  let projectedValue = 0;
  const rateOfInterest = 15;
  let principal = amount;
  for (let i = 0; i < year; i++) {
    if (invest_type === "sip") {
      let n = (i + 1) * 12;
      let mr = rateOfInterest / 12 / 100.0;
      projectedValue = (principal * (Math.pow(1 + mr, n) - 1)) / mr;
    } else {
      let currInterest = (principal * rateOfInterest) / 100;
      projectedValue = principal + currInterest;
      principal += currInterest;
    }
  }
  return projectedValue.toFixed(0);
};

export const dateOrdinalSuffix = (dom) => {
  if (dom === 31 || dom === 21 || dom === 1) return "st";
  if (dom === 22 || dom === 2) return "nd";
  if (dom === 23 || dom === 3) return "rd";
  return "th";
};

export const getAmountInInr = (amount) => {
  if (amount >= 0) return formatAmountInr(amount);
  return `- ${formatAmountInr(-1 * amount)}`;
};
