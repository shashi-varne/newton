import { getConfig } from 'utils/functions'

export function navigate(pathname, params, replace = false) {
  if (!replace) {
    this.history.push({
      pathname,
      search: getConfig().searchParams,
      params,
    })
  } else {
    this.history.replace({
      pathname,
      search: getConfig().searchParams,
      params,
    })
  }
}
