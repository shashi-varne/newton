import { getConfig } from 'utils/functions';

export function navigate(pathname, params, replace) {
  if (!replace) {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
      params,
    });
  } else {
    /* Required for screens that don't require to be considered in
      the history sequence when moving back through history using
      history.goBack() */
    this.props.history.replace({
      pathname: pathname,
      search: getConfig().searchParams,
      params,
    });
  }
}

export function setLoader(val) {
  this.setState({ show_loader: val });
}