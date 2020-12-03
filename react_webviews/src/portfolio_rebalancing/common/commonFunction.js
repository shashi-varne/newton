import { getConfig } from 'utils/functions';

export const navigate = (props, pathname, pagePath, params) => {
  let search = getConfig().searchParams;
  if (params?.isin) {
    search += `&isins=${params?.isin}`;
  }
  if (pagePath) {
    pathname = pagePath;
  } else {
    pathname = `/portfolio-rebalancing/${pathname}`;
  }
  props.history.push({
    pathname,
    search: search,
  });
};
