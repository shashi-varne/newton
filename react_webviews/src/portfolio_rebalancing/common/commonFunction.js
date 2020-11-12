import { getConfig } from 'utils/functions';
import { storageService, getUrlParams } from '../../utils/validators';

export const navigate = (props, pathname, params, replace) => {
  if (!replace) {
    props.history.push({
      pathname: `/portfolio-rebalancing/${pathname}`,
      //pathname: pathname,
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
};
