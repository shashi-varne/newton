export function validateEmpty(string) {
  let nameSplit = string.split(" ").filter(e => e);
  if (nameSplit.length > 0) {
    return true;
  } else {
    return false;
  }
}

export function validateLength(string) {
  let nameSplit = string.trim(" ");
  if (nameSplit.length > 30) {
    return false;
  }

  return true;
}

export function validateLengthAddress(string) {
  let nameSplit = string.trim(" ");
  if (nameSplit.length > 90) {
    return false;
  }

  return true;
}

export function validateLengthDynamic(string, length) {
  let nameSplit = string.trim(" ");
  if (nameSplit.length > length) {
    return false;
  }

  return true;
}

export function validateMinChar(string) {
  let nameSplit = string.trim(" ");
  if (nameSplit.length < 2) {
    return false;
  }

  return true;
}

export function validateConsecutiveChar(string) {
  let nameSplit = string.trim(" ");
  let name = nameSplit.toLowerCase();
  let prevChar = name[0];
  let count = 0;
  for (let n of name) {
    if (n === prevChar) {
      count += 1;
    } else {
      count = 1;
    }
    if (count === 3) {
      return false;
    }
    prevChar = n;
  }

  return true;
}

export function validateFlatNumber(string) {
  // eslint-disable-next-line
  let rule = /^[a-z A-Z0-9\.\-\#\/\'\,\(\)]+$/;
  return rule.test(string);
}

export function validateStreetName(string) {
  // eslint-disable-next-line
  let rule = /^[a-z A-Z0-9\.\-\/]+$/;
  return rule.test(string);
}

export function validateAlphabets(string) {
  return string.match(/^[a-z A-Z]+$/);
}

export function validateEmail(string) {
  // eslint-disable-next-line
  let rule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return rule.test(string);
}

export function validateNumber(number) {
  // eslint-disable-next-line
  let rule = /^[0-9]+$/;
  return rule.test(number);
}

export function validatePan(string) {
  // eslint-disable-next-line
  let rule = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  return rule.test(string);
}

export function numberShouldStartWith(number) {
  let rule = /(6|7|8|9)\d{9}/;
  return rule.test(number);
}

export function formatAmount(amount) {
  if (!amount) {
    return;
  }
  amount = amount.toString();
  let lastThree = amount.substring(amount.length - 3);
  let otherNumbers = amount.substring(0, amount.length - 3);
  if (otherNumbers !== '')
    lastThree = ',' + lastThree;
  let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return res;
}

export function inrFormatDecimal(number) {
  if (number) {
    number = number.toString();
    var afterPoint = '';
    if (number.indexOf('.') > 0)
      afterPoint = number.substring(number.indexOf('.'), number.length);
    number = Math.floor(number);
    number = number.toString();
    var lastThree = number.substring(number.length - 3);
    var otherNumbers = number.substring(0, number.length - 3);
    if (otherNumbers !== '')
      lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return '₹ ' + res;
  } else {
    return '₹';
  }
}

export function inrFormatDecimalWithoutIcon(number) {
  if (number) {
    number = number.toString();
    var afterPoint = '';
    if (number.indexOf('.') > 0)
      afterPoint = number.substring(number.indexOf('.'), number.length);
    number = Math.floor(number);
    number = number.toString();
    var lastThree = number.substring(number.length - 3);
    var otherNumbers = number.substring(0, number.length - 3);
    if (otherNumbers !== '')
      lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res;
  } else {
    return '';
  }
}

export function numDifferentiation(val) {
  if (val >= 10000000) val = (val / 10000000).toFixed(1) + ' Cr';
  else if (val >= 100000) val = (val / 100000).toFixed(1) + ' Lakhs';
  else if (val >= 1000) val = (val / 1000).toFixed(1) + ' Thousand';
  return val;
}

export function isValidDate(dateInput) {
  var objDate,
    mSeconds,
    day,
    month,
    year;

  if (dateInput.length !== 10) {
    return false;
  }

  if (dateInput.substring(2, 3) !== '/' || dateInput.substring(5, 6) !== '/') {
    return false;
  }

  day = dateInput.substring(0, 2) - 0;
  month = dateInput.substring(3, 5) - 1;
  year = dateInput.substring(6, 10) - 0;
  // test year range 		
  if (year < 1900 || year > 3000) {
    return false;
  }
  // convert dateInput to milliseconds 		
  mSeconds = (new Date(year, month, day)).getTime();
  // initialize Date() object from calculated milliseconds 		
  objDate = new Date();
  objDate.setTime(mSeconds);

  if (objDate.getFullYear() !== year ||
    objDate.getMonth() !== month ||
    objDate.getDate() !== day) {
    return false;
  }

  return true;
}

export function validateName(string) {
  return string.trim().indexOf(' ') !== -1;
}

export function capitalize(string) {
  return string.toLowerCase().replace(/(^|\s)[a-z]/g, function (f) { return f.toUpperCase() });
}

export function validate2ConsecutiveDigits(string) {
  let rule = /(?=(\d{2}))/g;
  return rule.test(string);
}
