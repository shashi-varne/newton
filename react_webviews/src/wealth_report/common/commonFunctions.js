import { getConfig } from 'utils/functions';
import { isEmpty } from '../../utils/validators';

export function navigate(props, pathname, params, replace) {
  if (!replace) {
    props.history.push({
      pathname: `/w-report/${pathname}`,
      search: getConfig().searchParams,
      params,
    });
  } else {
    /* Required for screens that don't require to be considered in
      the history sequence when moving back through history using
      history.goBack() */
    props.history.replace({
      pathname: `/w-report/${pathname}`,
      search: getConfig().searchParams,
      params,
    });
  }
}

export const formatGrowthData = (current_amt_arr = [], invested_amt_arr = []) => {
  if (!current_amt_arr.length || !invested_amt_arr.length) return { data: [] };
  const obj = {
    current_amount: [],
    invested_amount: [],
  };
  let max = current_amt_arr[0].value, min = current_amt_arr[0].value, curr_val, inv_val;

  for (let i = 0; i < current_amt_arr.length; i++) {
    curr_val = current_amt_arr[i]; inv_val = invested_amt_arr[i];
    max = Math.max(max, Number(curr_val.value), Number(inv_val.value));
    min = Math.min(min, Number(curr_val.value), Number(inv_val.value));
    obj.current_amount.push({
      x: curr_val.date,
      y: curr_val.value,
      color: '#b9abdd',
    });
    obj.invested_amount.push({
      x: inv_val.date,
      y: inv_val.value,
      color: '#502da8',
    });
  }

  return {
    min: min * 0.7, // Multiplying by a factor to provide some padding area
    max: max * 1.2, // Multiplying by a factor to provide some padding area
    data: [{
      id: 'current_amount',
      data: obj.current_amount,
    }, {
      id: 'invested_amount',
      data: obj.invested_amount,
    }],
  };
};
