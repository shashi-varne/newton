import { getConfig } from "utils/functions";
import { storageService } from "utils/validators";

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

export const redirectToReports = (name) => {
  let redirectUrl = encodeURIComponent(
    window.location.href + "&is_secure=" + storageService().get("is_secure")
  );
  let path = "/group-insurance/common/report";
  switch (name) {
    case "gold":
      path = "/gold/my-gold";
      break;
    case "insurance":
      path = "/group-insurance/common/report";
      break;
    default:
      break;
  }
  let url =
    window.location.protocol +
    "//" +
    window.location.host +
    path +
    getConfig().searchParams +
    "&generic_callback=true&redirect_url=" +
    redirectUrl;
  window.location.href = url;
};
