// import { func } from "prop-types";
import qs from 'qs';

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

export function validateAddressWords(string, length) {
  let nameSplit = string.split(" ");
  if (nameSplit.length < length) {
    return false;
  }

  for (var i = 0; i < length; i++) {
    if (nameSplit[i].length < length) {
      return false;
    }
  }

  return true;
}

export function validateLengthNames(string, type, provider) {
  let nameSplit = string.trim(" ");


  if (!provider) {
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
    'middle_name': 'middle name',
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

export function validateMinChar(string, length) {
  let nameSplit = string.replace(/ /g, "");
  if (!length) {
    length = 2;
  }
  if (nameSplit.length < length) {
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
  if (!string) {
    return false;
  }
  return string.match(/^[a-z A-Z]+$/);
}

export function validateEmail(string) {
  // eslint-disable-next-line
  let rule = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

export function formatAmountInr(amount) {
  if (!amount) {
    return '₹';
  }

  amount = Number(amount);
  amount = amount.toFixed(0);
  amount = amount.toString();
  let lastThree = amount.substring(amount.length - 3);
  let otherNumbers = amount.substring(0, amount.length - 3);
  if (otherNumbers !== '')
    lastThree = ',' + lastThree;
  let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return '₹ ' + res;
}

export function formatGms(weight) {
  if (!weight) {
    return 'in gm ';
  } else {
    return 'in gm ' + weight
  }
}

export function inrFormatDecimal(number, toFixed) {

  if (number || number === 0) {
    number = parseFloat(number);
    number = number.toFixed(toFixed || 0);
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
    return '₹' + res;
  } else {
    return '₹';
  }
}

export function inrFormatDecimal2(number) {
  return inrFormatDecimal(number, 2);
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
  else if (val >= 100000) val = (val / 100000).toFixed(2) + ' Lac';
  else if (val) return inrFormatDecimal(val);

  val = val.toString();
  // remove .00
  val = val.replace(/\.00([^\d])/g, '$1');
  return val;
}

export function IsFutureDate(idate) {
  var today = new Date().getTime();
  idate = idate.split("/");

  idate = new Date(idate[2], idate[1] - 1, idate[0]).getTime();
  return (today - idate) < 0;

}

export function isValidDate(dateInput) {
  if (!dateInput) {
    return false;
  }
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
  if (value === null || value === undefined || value === 'undefined' || 
  value === '' || value === 'false') {
    return false;
  } else {
    return true;
  }
}

export function split2(str, delim) {
  var parts = str.split(delim);
  return [parts[0], parts.splice(1, parts.length).join(delim)];
}


export function getUrlParams(url) {
  if (!url) {
    url = window.location.href;
  }

  let data = split2(url, '?');

  let main_query_params = qs.parse(data[1]);

  return main_query_params;

}

export function checkStringInString(string_base, string_to_check) {
  if (string_base.indexOf(string_to_check) >= 0) {
    return true;
  }

  return false;
}

export function storageService() {
  var service = {
    set: set,
    get: get,
    setObject: setObject,
    getObject: getObject,
    remove: remove,
    clear: clear
  };
  return service;

  function set(key, value) {
    window.localStorage.setItem(key, value);
  }

  function get(key) {
    if (checkValidString(window.localStorage.getItem(key))) {
      return window.localStorage.getItem(key) || false;
    }

    return false;
  }

  function setObject(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  function getObject(key) {
    if (checkValidString(window.localStorage.getItem(key))) {
      return JSON.parse(window.localStorage.getItem(key)) || {};
    }

    return false;
  }

  function remove(key) {
    return window.localStorage.removeItem(key);
  }

  function clear() {
    return window.localStorage.clear();
  }

}

export function getIndexArray(array, value, objKey) {
  for (var i = 0; i < array.length; i++) {
    if (objKey) {
      if (array[i][objKey] === value) {
        return i;
      }
    } else {
      if (array[i] === value) {
        return i;
      }
    }
  }
}

function dateOrdinal(dom) {
  if (dom === 31 || dom === 21 || dom === 1) return dom + "st";
  else if (dom === 22 || dom === 2) return dom + "nd";
  else if (dom === 23 || dom === 3) return dom + "rd";
  else return dom + "th";
};

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function getDateBreakup(date) {

  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  if (!date) {
    return '';
  }

  // fix for safari
  // date = date.replace(/ /g,"T");
  date = date.replace(/-/g, '/');

  let date2 = new Date(date);
  let dom = date2.getDate();
  dom = dateOrdinal(dom);

  let month = monthNames[date2.getMonth()];
  let year = date2.getFullYear();
  let time = formatAMPM(date2);

  return { dom, month, time, year };
}

export function formatDateAmPm(date) {
  return formattedDate(date, 'd m, t');
}

export function formattedDate(date, pattern = '') {
  pattern = pattern.toLowerCase();
  const validPatterns = ['d m, t', 'd m y'];

  if (!date) return '';
  else if (!validPatterns.includes(pattern)) return date;
  let { dom, month, time, year } = getDateBreakup(date);
  const patternMap = {
    'd m, t': `${dom} ${month}, ${time}`,
    'd m y': `${dom} ${month} ${year}`,
    // Enter custom patterns here
  };
  return patternMap[pattern];
}

export function inrFormatTest(value) {
  if (value === '') {
    return true;
  }

  let rule = /^[0-9,]/;

  return rule.test(value);
}

export function formatDate(event) {
  var key = event.keyCode || event.charCode;

  var thisVal;

  let slash = 0;
  for (var i = 0; i < event.target.value.length; i++) {
    if (event.target.value[i] === '/') {
      slash += 1;
    }
  }

  if (slash <= 1 && key !== 8 && key !== 46) {
    var strokes = event.target.value.length;

    if (strokes === 2 || strokes === 5) {
      thisVal = event.target.value;
      thisVal += '/';
      event.target.value = thisVal;
    }
    // if someone deletes the first slash and then types a number this handles it
    if (strokes >= 3 && strokes < 5) {
      thisVal = event.target.value;
      if (thisVal.charAt(2) !== '/') {
        var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
        event.target.value = txt1;
      }
    }
    // if someone deletes the second slash and then types a number this handles it
    if (strokes >= 6) {
      thisVal = event.target.value;

      if (thisVal.charAt(5) !== '/') {
        var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
        event.target.value = txt2;
      }
    }
  }
}

export function calculateAge(val) {
  if (!val) {
    return 0;
  }
  const birthday = val.toString().replace(/\\-/g, '/').split('/').reverse().join('/');
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function isFunction(value) {
  return (typeof value === 'function') && (value instanceof Function);
}