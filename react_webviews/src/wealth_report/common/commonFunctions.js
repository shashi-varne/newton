import { getConfig } from 'utils/functions';
import { isEmpty } from '../../utils/validators';

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

// Todo: Optimize this function
export const formatGrowthData = (dataObj) => {
  if (isEmpty(dataObj) || !dataObj) return [];
  const obj = {
    current_amount: [],
    invested_amount: [],
  };

  for (let dataOb of dataObj) {
    const { data } = dataOb;
    data.map(point => obj[dataOb.id].push({
      x: point.date,
      y: point.value,
    }));
  }
  return [{
    id: 'current_amount',
    data: obj.current_amount,
  }, {
    id: 'invested_amount',
    data: obj.invested_amount,
  }];
};