// import { func } from "prop-types";

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

export function validateLengthNames(string, type, provider) {
  let nameSplit = string.trim(" ");


  if(!provider) {
    provider = "HDFC";
  }
  let lengthMapper = {
    'HDFC': {
      'name': 30,
      'first_name': 30, //not using now
      'middle_name': 30,//not using now
      'last_name': 30,//not using now
      'father_name': 30,
      'mother_name': 30,
      'spouse_name': 30
    },
    'IPRU': {
      'name': 30,
      'first_name': 30,//not using now
      'middle_name': 30,//not using now
      'last_name': 30,//not using now
      'father_name': 30,//not using now
      'mother_name': 30,//not using now
      'spouse_name': 30//not using now
    },
    'Maxlife': {
      'name': 30,//not using now
      'first_name': 25,
      'middle_name': 25,
      'last_name': 25,
      'father_name': 50,
      'mother_name': 30,//not using now
      'spouse_name': 30//not using now
    }
  }

  let nomenclatureMapper = {
    'name': 'name',
    'first_name': 'first name',
    'middle_name': 'middle_name',
    'last_name': 'last name',
    'father_name': 'father name',
    'spouse_name': 'spouse name',
    'mother_name': 'mother name'
  }

  let data = {
    error_msg: 'Maximum length of ' + nomenclatureMapper[type] + ' is ' +
      lengthMapper[provider][type] + ' characters',
    isError: false
  }

  if (nameSplit.length > lengthMapper[provider][type]) {
    data.isError = true;
    return data;
  }

  return data;
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
  if(!string) {
    return false;
  }
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
    return '';
  }

  amount = Number(amount);
  amount = amount.toFixed(0);
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
    number = parseFloat(number);
    number = number.toFixed(0);
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
  if (!val) {
    val = '';
  }
  if (val >= 10000000) val = (val / 10000000).toFixed(2) + ' Cr';
  else if (val >= 100000) val = (val / 100000).toFixed(2) + ' Lakhs';
  else if (val >= 1000) val = (val / 1000).toFixed(2) + ' Thousand';

  // remove .00
  val = val.replace(/\.00([^\d])/g,'$1');
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

export function copyToClipboard(string) {
  let textarea;
  let result;
  try {
    textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', true);
    textarea.setAttribute('contenteditable', true);
    textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
    textarea.value = string;

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const range = document.createRange();
    range.selectNodeContents(textarea);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    textarea.setSelectionRange(0, textarea.value.length);
    result = document.execCommand('copy');
  } catch (err) {
    console.error(err);
    result = null;
  } finally {
    document.body.removeChild(textarea);
  }

  // manual copy fallback using prompt
  if (!result) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
    result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
    if (!result) {
      return false;
    }
  }
  return true;
}

export function open_browser_web(url, tab_type) {
  let a = document.createElement('a');
  a.target = tab_type;
  a.href = url;
  a.click();
}

export function renameObjectKeys(obj, newKeys) {

  for (var key in obj) {
    let keyValue = newKeys[key];

    if (keyValue) {
      obj[keyValue] = obj[key];
      delete obj[key];
    }
  }

  return obj;
}

export function providerAsIpru(provider) {
  if (provider === 'IPRU' || provider === 'Maxlife') {
    return true;
  } else {
    return false;
  }
}


export function clearInsuranceQuoteData() {
  window.localStorage.setItem('quoteSelected', '');
}

export function getRecommendedIndex(array, value, AOB, Key) {
  for (var i = 0; i < array.length; i++) {
    if (AOB && Key) {
      if (array[i][Key] === value) {
        return i;
      }
    } else if (array[i] === value) {
      return i;
    }
  }
  return '';
}

export function checkValidNumber(value, otherwise) {
  if (value === null || value === undefined || value === '') {
    if (otherwise !== null || otherwise !== undefined) {
      return otherwise;
    }
    return false;
  } else {
    return Number(value);
  }
}

export function checkValidString(value) {
  if (value === null || value === undefined || value === 'undefined' || value === '') {
    return false;
  } else {
    return true;
  }
}