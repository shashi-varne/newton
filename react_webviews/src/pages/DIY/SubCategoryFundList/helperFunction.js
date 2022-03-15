import { DEFAULT_FILTER_DATA } from "businesslogic/constants/diy";
import isEmpty from 'lodash/isEmpty';

export const FUNDLIST_EVENT_MAPPER = {
  aum: 'fund size (aum)',
  expense_ratio: 'expense ratio',
  morning_star_rating: 'rating',
  one_month_return: '1 month',
  three_month_return: '3 months',
  six_month_return: '6 months',
  one_year_return: '1 year',
  three_year_return: '3 year',
  five_year_return: '5 year',
};

export const getFilterCount = (fundHouses, fundOption, minInvestment) => {
  const fundHouseLength = fundHouses?.length || 0;
  const fundOptionLength = fundOption ? 1 : 0;
  const minInvestmentLength = !isEmpty(minInvestment) ? 1 : 0;
  const filterCount = fundHouseLength + fundOptionLength + minInvestmentLength;
  return filterCount;
};

export const getfilterMapEventValue = (value) => {
  const eventValue = FUNDLIST_EVENT_MAPPER[value] || value || '';
  return eventValue;
};

export const getDefaultFilterOptions = (filterOptions, fromDiyLanding) => {
  let defaultReturnPeriod = filterOptions.returnPeriod;
  let defaultSort = filterOptions.sortFundsBy;
  let defaultFundOptions = filterOptions?.fundOption;
  let defaultFundHouses = filterOptions?.fundHouse;
  let defaultMinimumInvestment = filterOptions?.minInvestment?.id;

  if (fromDiyLanding) {
    defaultReturnPeriod = DEFAULT_FILTER_DATA.returnPeriod;
    defaultSort = DEFAULT_FILTER_DATA.sortFundsBy;
    defaultFundOptions = DEFAULT_FILTER_DATA.fundOption;
    defaultFundHouses = [];
    defaultMinimumInvestment = '';
  }
  return {
    defaultReturnPeriod,
    defaultSort,
    defaultFundOptions,
    defaultFundHouses,
    defaultMinimumInvestment,
  };
};
