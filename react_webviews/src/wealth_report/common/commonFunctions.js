import { getConfig } from 'utils/functions';

export function navigate(props, pathname, params, replace) {
  if (!replace) {
    props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params,
    });
  } else {
    /* Required for screens that don't require to be considered in
      the history sequence when moving back through history using
      history.goBack() */
    props.history.replace({
      pathname: pathname,
      search: getConfig().searchParams,
      params,
    });
  }
}