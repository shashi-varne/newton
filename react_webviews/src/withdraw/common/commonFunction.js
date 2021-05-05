import { getConfig } from "utils/functions";

export function navigate(pathname, data, redirect) {
    if (redirect) {
      this.history.push({
        pathname: pathname,
        search: data?.searchParams || getConfig().searchParams,
        state: data?.state
      });
    } else {
      this.history.push({
        pathname: `/withdraw/${pathname}`,
        search: data?.searchParams || getConfig().searchParams,
        state: data?.state,
      });
    }
  }