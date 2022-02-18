import { formatAmountInr } from '../../../utils/validators';

export const validateMfOrderFunds = (amount, min, max, multiple) => {
  if (!amount) {
    return {
      message: `${formatAmountInr(min)} min.`,
      showError: false,
    };
  }
  if (amount < min) {
    return {
      message: `Minimum amount is ${formatAmountInr(min)}`,
      showError: true,
    };
  } else if (amount % multiple !== 0) {
    return {
      message: `Amount must be multiple of ${formatAmountInr(multiple)}`,
      showError: true,
    };
  } else if (amount > max) {
    return {
      message: `Maximum amount for this fund is ${formatAmountInr(max)}`,
      showError: true,
    };
  } else {
    return {
      message: `${formatAmountInr(min)} min.`,
      showError: false,
    };
  }
};
