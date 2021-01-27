import { getConfig } from 'utils/functions';
import { subDays, startOfMonth, addMonths, endOfMonth, startOfYear } from 'date-fns';
import moment from 'moment';
import { isEmpty, numDifferentiationInr, nonRoundingToFixed } from '../../utils/validators';

export function navigate(pathname, params, replace) {
  if (!replace) {
    this.history.push({
      pathname: `/iw-dashboard/${pathname}`,
      search: getConfig().searchParams,
      params,
    });
  } else {
    /* Required for screens that don't require to be considered in
      the history sequence when moving back through history using
      history.goBack() */
    this.history.replace({
      pathname: `/iw-dashboard/${pathname}`,
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
  let max = current_amt_arr[0].close,
    min = current_amt_arr[0].close,
    curr_val,
    inv_val;

  for (let i = 0; i < current_amt_arr.length; i++) {
    curr_val = current_amt_arr[i];
    inv_val = invested_amt_arr[i];
    max = Math.max(max, Number(curr_val.close), Number(inv_val.close));
    min = Math.min(min, Number(curr_val.close), Number(inv_val.close));
    obj.current_amount.push({
      x: curr_val.date,
      y: curr_val.close,
      color: '#4F2DA6',
    });
    obj.invested_amount.push({
      x: inv_val.date,
      y: inv_val.close,
      color: '#4AD0C0',
    });
  }

  return {
    min: min * 0.98, // Multiplying by a factor to provide some padding area
    max: max * 1.02, // Multiplying by a factor to provide some padding area
    data: [
      {
        id: 'current_amount',
        data: obj.current_amount,
      },
      {
        id: 'invested_amount',
        data: obj.invested_amount,
      },
    ],
  };
};

export const dateFormater = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

export const formatNumVal = (val) => {
  if (isEmpty(val) || !val) return '--';
  return numDifferentiationInr(val);
};

export const formatPercentVal = (val) => {
  if (isEmpty(val) || !val) return '0%';
  else if (val < 0.1) return '<0.1%';
  return `${nonRoundingToFixed(val, 2)}%`;
};

export const date_range_selector = {
  past_seven_days: () => [subDays(new Date(), 6), new Date()],
  past_two_weeks: () => [subDays(new Date(), 13), new Date()],
  past_month: () => [
    startOfMonth(addMonths(new Date(), -1)),
    endOfMonth(addMonths(new Date(), -1)),
  ],
  month_to_date: () => [startOfMonth(new Date()), subDays(new Date(), 1)],
  year_to_date: () => [startOfYear(new Date()), subDays(new Date(), 1)],
};

export const scrollElementToPos = (elementClass, posX = 0, posY = 0) => {
  const [scrollElem] = document.getElementsByClassName(elementClass) || [];
  if (isEmpty(scrollElem)) return;
  scrollElem.scrollTo(posX, posY);
};
