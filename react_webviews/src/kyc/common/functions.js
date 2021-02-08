import { getConfig } from "utils/functions";

export function navigate(pathname, data, redirect = false) {
  if (redirect) {
    this.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
    });
  } else {
    this.history.push({
      pathname: `/kyc/${pathname}`,
      search: data?.searchParams || getConfig().searchParams,
      state: data,
    });
  }
}
