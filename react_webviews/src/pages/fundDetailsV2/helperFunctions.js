import isEmpty from 'lodash/isEmpty';

export const getExpectedReturn = (amount, year, invest_type, rateOfInterest) => {
  let projectedValue = 0;
  let principal = amount;
  for (let i = 0; i < year; i++) {
    if (invest_type === 'sip') {
      projectedValue = projectedValue + principal * 12;
      projectedValue = projectedValue + (projectedValue * rateOfInterest) / 100;
    } else {
      let currInterest = (principal * rateOfInterest) / 100;
      projectedValue = principal + currInterest;
      principal += currInterest;
    }
  }
  return Number(projectedValue.toFixed(0));
};

export const isValidValue = (value, valueToBeReturned, stringToBeReplaced = 'NA') => {
  if (typeof value === 'object') {
    return isEmpty(value) ? stringToBeReplaced : value;
  } else {
    if(value && valueToBeReturned) {
      value = valueToBeReturned;
    }
    return (value || value === 0) ? value : stringToBeReplaced;
  }
};
