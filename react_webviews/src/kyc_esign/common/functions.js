import { getConfig } from 'utils/functions'

export function navigate(pathname, data = {}) {
  if (data?.edit) {
    this.history.replace({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data?.state || null,
      params: data?.params || null,
    })
  } else {
    this.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data?.state,
      params: data?.params,
    })
  }
}
