import { getConfig } from "utils/functions";

export function navigate (pathname)  {
  this.history.push({
    pathname: pathname,
    search: getConfig().searchParams,
  });
};