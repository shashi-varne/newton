import { storageService, formatAmountInr } from 'utils/validators';
import { getConfig } from "utils/functions";

export function navigate(pathname, data, redirect) {
  if (redirect) {
    this.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      state: data?.state
    });
  } else {
    this.history.push({
      pathname: `/invest/${pathname}`,
      search: data?.searchParams || getConfig().searchParams,
      state: { ...data },
    });
  }
}

export const isRecurring = (investType) => {
  return [
    'sectoralsip', 
    'midcapsip', 
    'balancedsip', 
    'indexsip', 
    'shariahsip', 
    'savetaxsip', 
    'buildwealth', 
    'saveforgoal'
  ].includes(investType);
};

export const getReturnRates = () => {
  return storageService().getObject('funnelReturnRates') || {};
};

export const getMonthlyCommitmentNew = (term, corpusValue, stockSplitVal) => {
  var n = term * 12;
  var r = getRateOfInterest(stockSplitVal);
  var a = corpusValue;
  var i = r / 12 / 100;
  var tmp = Math.pow(1 + i, n) - 1;
  var monthlyInvestment = (a * i) / tmp;
  var monthlyAmount = monthlyInvestment;
  if (monthlyAmount < 500) {
    monthlyAmount = 500;
  }
  return Math.floor(monthlyAmount);
};

export const getCorpusValue = (stockSplitVal, amount, isRecurring, term) => {
  let principle = amount;
  var corpus_value = 0;
  for (var i = 0; i < term; i++) {
    if (isRecurring) {
      var n = (i + 1) * 12;
      var mr = (getRateOfInterest(stockSplitVal) / 12) / 100;
      corpus_value = (amount * (Math.pow(1 + mr, n) - 1)) / mr;
    } else {
      var currInterest = (principle * getRateOfInterest(stockSplitVal)) / 100;
      corpus_value = principle + currInterest;
      principle += currInterest;
    }
  }
  return corpus_value;
};

export const getPotentialValue = (...params) => {
  return getCorpusValue(...params);
};

export const getRateOfInterest = (stockSplitVal) => {
  const { stockReturns, bondReturns } = getReturnRates();
  // TODO: Handle edge cases / negative scenarios
  var range = Math.abs(stockReturns - bondReturns);
  if (stockSplitVal < 1) {
    return bondReturns;
  } else if (stockSplitVal > 99) {
    return stockReturns;
  } else {
    var rateOffset = (range * stockSplitVal) / 100;
    return bondReturns + rateOffset;
  }
};

export const getInvestedValue = (term, amount, isRecurring) => {
  return isRecurring ? amount * 12 * term : amount;
};

export const validateInvestAmount = (amount, investType, investTypeDisplay) => {
  if (investType === 'buildwealth') {
    if (investTypeDisplay === 'sip') {
      if (amount < 500) {
        return {
          status: true,
          msg: 'Minimum amount should be atleast ₹ 500',
        };
      } else if (amount > 500000) {
        return {
          status: true,
          msg: 'Investment amount cannot be more than ₹ 5,00,000',
        };
      }
    } else {
      if (amount < 5000) {
        return {
          status: true,
          msg: 'Minimum amount should be atleast ₹ 5000',
        };
      } else if (amount > 2000000) {
        return {
          status: true,
          msg: 'Investment amount cannot be more than ₹ 20,00,000',
        };
      }
    }
  }
};

export const getGoalRecommendation = () => {
  let goal = storageService().getObject('funnelGoalData');
  if (!goal) {
    goal = {};
  }

  const result = {
    min_sip_amount: goal.min_sip_amount || 500,
    max_sip_amount: goal.max_sip_amount || 500000,
    min_ot_amount: goal.min_ot_amount || 5000,
    max_ot_amount: goal.max_ot_amount || 2000000,
  };
  return result;
};

export const validateSipAmount = (amount) => {
  var goal = getGoalRecommendation();
  var validation = {
    error: false,
    message: '',
  };

  if (amount > goal.max_sip_amount) {
    validation.error = true;
    validation.message =
      'Investment amount cannot be more than ' + formatAmountInr(goal.max_sip_amount);
  } else if (amount < goal.min_sip_amount) {
    validation.error = true;
    validation.message = 'Minimum amount should be atleast ' + formatAmountInr(goal.min_sip_amount);
  } else {
    validation.error = false;
    validation.message = '';
  }
  return validation;
};

export const validateOtAmount = (amount) => {
  var goal = getGoalRecommendation();
  var validation = {
    error: false,
    message: '',
  };

  if (amount > goal.max_ot_amount) {
    validation.error = true;
    validation.message =
      'Investment amount cannot be more than ' + formatAmountInr(goal.max_ot_amount);
  } else if (amount < goal.min_ot_amount) {
    validation.error = true;
    validation.message = 'Minimum amount should be atleast ' + formatAmountInr(goal.min_ot_amount);
  } else {
    validation.error = false;
    validation.message = '';
  }
  return validation;
};

export const selectTitle = (type) => {
  switch (type) {
    case 'buildwealth':
      return 'Build Wealth';
    case 'savetaxsip':
      return 'Save Tax';
    case 'saveforgoal':
      return 'Save for a Goal';
    case 'investsurplus':
      return 'Park Money';
    default:
      return 'Invest';
  }
};

