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

export const formatGrowthData = (dataObj) => {
  if (isEmpty(dataObj) || !dataObj) return { data: [] };
  const obj = {
    current_amount: [],
    invested_amount: [],
  };
  let max, min;

  for (let dataOb of dataObj) {
    const { data } = dataOb;
    max = max || data[0].value;
    min = min || data[0].value;
    // eslint-disable-next-line no-loop-func
    data.map(point => {
      const numVal = Number(point.value);
      max = numVal > max ? numVal : max;
      min = numVal < min ? numVal : min;
      return obj[dataOb.id].push({
        x: point.date,
        y: point.value,
        color: dataOb.id === 'current_amount' ? '#b9abdd' : '#502da8',
      });
    });
  }
  return {
    min: min * 0.7,
    max: max * 1.2,
    data: [{
      id: 'current_amount',
      data: obj.current_amount,
    }, {
      id: 'invested_amount',
      data: obj.invested_amount,
    }],
  };
};