import { getConfig } from 'utils/functions';

export function navigate (pathname, params) {
  this.props.history.push({
    pathname: pathname,
    search: getConfig().searchParams,
    params,
  });
}