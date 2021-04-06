// import { func } from "prop-types";
import qs from 'qs';
import moment from 'moment';

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
  if (nameSplit.length < length) {
    return true;
  }

  return false;
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

export function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode !== 43 && charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
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
  if(typeof amount === 'string' && amount.includes(',')){
    amount = amount.replace(/,/g, "");
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

  return '₹' + res;
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

export function numDifferentiation(val, withSymbol, decimalPlaces = 2, retainLeadingZeroes = false) {
  if (!val) {
    val = '';
  }
  const isNegativeVal = val < 0;
  val = Math.abs(val);
  if (val >= 10000000) val = (val / 10000000).toFixed(decimalPlaces) + ' Cr';
  else if (val >= 100000) val = (val / 100000).toFixed(decimalPlaces) + ' L';
  else if (val >= 1000) val = (val / 1000).toFixed(decimalPlaces) + ' K';
  else if (val) return inrFormatDecimal(val);

  val = val.toString();
  // remove .00
  if (!retainLeadingZeroes) {
    val = val.replace(/\.0+([^\d])/g, '$1');
  }

  if(withSymbol) {
    val = '₹' + val;
  }

  if (isNegativeVal) {
    val = '-' + val;
  }
  return val;
}

export function numDifferentiationInr(val, decimalPlaces, retainLeadingZeroes) {
  return numDifferentiation(val, true, decimalPlaces, retainLeadingZeroes);
}

export function IsFutureDate(idate) {
  var today = new Date().getTime();
  idate = idate.split("/");

  idate = new Date(idate[2], idate[1] - 1, idate[0]).getTime();
  return (today - idate) < 0;

}

export function IsFutureMonthYear(input) {
  var today = new Date();

  var currentMonth = today.getMonth() + 1; 
  var currentYear = today.getFullYear();

  var inputMonth = input.substring(0, 2) - 0;
  var inputYear = input.substring(3, 7) - 0;

  if (inputYear > currentYear) {
    return true;
  }

  if (inputYear === currentYear && inputMonth > currentMonth) {
    return true;
  }

  return false;
}

export function IsPastMonthYearfromDob(input, dob) {
  dob = dob.split('-');

  var dobMonth = dob[1]; 
  var dobYear = dob[2];

  var inputMonth = input.substring(0, 2) - 0;
  var inputYear = input.substring(3, 7) - 0;

  if (inputYear < dobYear) {
    return true;
  }

  // eslint-disable-next-line radix
  if (inputYear === parseInt(dobYear) && inputMonth < dobMonth) {
    return true;
  }

  return false;
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

export function isValidMonthYear(input) {
  if (!input) {
    return false;
  }
  var month, year;

  if (input.length !== 7) {
    return false;
  }

  if (input.substring(2, 3) !== '/') {
    return false;
  }

  month = input.substring(0, 2) - 0;
  year = input.substring(3, 7) - 0;

  if (year < 1900 || year > 3000) {
    return false;
  }

  if (month < 1 || month > 12) {
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
  window.sessionStorage.setItem('quoteSelected', '');
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
  function lsTest() {
    const test = 'test';
    try {
      window.sessionStorage.setItem(test, test);
      window.sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  const sessionStorageValid = lsTest();
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
    if (sessionStorageValid) {
      window.sessionStorage.setItem(key, value);
    }
  }

  function get(key) {
    if (sessionStorageValid && checkValidString(window.sessionStorage.getItem(key))) {
      return window.sessionStorage.getItem(key) || false;
    }

    return false;
  }

  function setObject(key, value) {
    if (sessionStorageValid) {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  function getObject(key) {
    if (sessionStorageValid && checkValidString(window.sessionStorage.getItem(key))) {
      return JSON.parse(window.sessionStorage.getItem(key)) || {};
    }

    return false;
  }

  function remove(key) {
    if (sessionStorageValid) {
      return window.sessionStorage.removeItem(key);
    }
  }

  function clear() {
    if (sessionStorageValid) {
      return window.sessionStorage.clear();
    }
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

export function dateOrdinal(dom) {
  if (dom === 31 || dom === 21 || dom === 1) return dom + "st";
  else if (dom === 22 || dom === 2) return dom + "nd";
  else if (dom === 23 || dom === 3) return dom + "rd";
  else return dom + "th";
};

export function formatAMPM(date){
   // eslint-disable-next-line 
  var date = new Date(date);
  var minutes = date.getMinutes();
  var hours = date.getHours();
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
  let plainDate = date2.getDate();
  let dom = dateOrdinal(plainDate); // converts 16 to 16th, 2 to 2nd, etc.

  let month = monthNames[date2.getMonth()];
  let year = date2.getFullYear();
  let time = formatAMPM(date2);

  return { plainDate, dom, month, time, year };
}

export function getDateBreakupWithTime(date) {

  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  if (!date) {
    return '';
  }
  // fix for safari
  // date = date.replace(/ /g,"T");
  let date2 = new Date(date);
  let plainDate = date2.getDate();
  let dom = dateOrdinal(plainDate); // converts 16 to 16th, 2 to 2nd, etc.

  let month = monthNames[date2.getMonth()];
  let year = date2.getFullYear();
  let time = formatAMPM(date2);

  return { plainDate, dom, month, time, year };
}

export function formatDateAmPm(date) {
  return formattedDate(date, 'd m, t');
}

export function formattedDate(date, pattern = '', usePlainDate = false) {
  pattern = pattern.toLowerCase();
  const validPatterns = ['d m, t', 'd m y', 'd m', 'm y', 'd m, y', "d m yy'", "m yy'"];

  if (!date) return '';
  else if (!validPatterns.includes(pattern)) return date;
  const { plainDate, dom, month, time, year } = getDateBreakup(date);
  const dateVal = usePlainDate ? plainDate : dom;
  const patternMap = {
    'd m, t': `${dateVal} ${month}, ${time}`,
    'd m y': `${dateVal} ${month} ${year}`,
    'd m': `${dateVal} ${month}`,
    'm y': `${month} ${year}`,
    'd m, y': `${dateVal} ${month}, ${year}`,
    "d m yy'": `${dateVal} ${month} ${year.toString().slice(-2)}'`,
    "m yy'": `${month} ${year.toString().slice(-2)}'`,
    // Enter custom patterns here
  };
  return patternMap[pattern];
}

export function inrFormatTest(value) {
  if (value === '') {
    return true;
  }

  let rule = /^[0-9,]*$/;

  return rule.test(value);
}

export function dobFormatTest(value) {
  if (value === '') {
    return true;
  }

  let rule = /^[0-9/]*$/;

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

export function formatMonthandYear(event) {

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

    if (strokes === 2) {
      thisVal = event.target.value;
      thisVal += '/';
      event.target.value = thisVal;
    }
    // if someone deletes the first slash and then types a number this handles it
    if (strokes >= 3) {
      thisVal = event.target.value;
      if (thisVal.charAt(2) !== '/') {
        var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
        event.target.value = txt1;
      }
    }
  }
}

export function calculateAge(val, withBreakup) {
  if (!val) {
    if (withBreakup) {
      return { age: 0 };
    }
    return 0;
  }

  let format = '"DD/MM/YYYY"'; //pass value in this format only
  
  const today = moment();
  const birthDate = moment(val, format);
  const duration = moment.duration(today.diff(birthDate));
  const age = duration.asYears();

  if (withBreakup) {
    return {
      age,
      months: parseInt(duration.asMonths(), 10),
      days: parseInt(duration.asDays(), 10),
    };
  }

  return age;
}

export function toFeet(n) {
  var realFeet = ((n*0.393700) / 12);
  var feet = Math.floor(realFeet);
  var inches = Math.round((realFeet - feet) * 12);
  return feet + 'ft ' + inches + 'in';
}

export function convertToThousand(val) {
  const numVal = Number(val);
  if (isNaN(numVal) || !val) return 0;

  const roundedVal = parseInt(numVal/1000, 10);
  return `${roundedVal}K`;
}

export function capitalizeFirstLetter(string) {
  if(!string) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}


export function getEditTitle(string) {
  if(!string) {
    return;
  }

  string = 'Edit ' + (string).toLowerCase();

  return string;
}

export function isFunction(value) {
  return (typeof value === 'function') && (value instanceof Function);
}

export function isEmpty(value) {
  return value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);
}

export function nonRoundingToFixed(val, decimalPlaces) {
  if (!val) return '';
  return (Math.floor(100 * val) / 100).toFixed(decimalPlaces);
}

export function containsSpecialCharacters(value){
  var format = /[$&+,:;=?@#|'<>.^*()%!"-]/g;
  return format.test(value);
}

export function containsNumbersAndComma(value){
  var format = /^[0-9,]*$/g;
  return format.test(value);
}

export function charsNotAllowedHDFC(value){
  var format = /[$&+:;=?@|\\_[\]{}'<>^*()%!"-]/g;
  return format.test(value);
}

export function containsSpecialCharactersAndNumbers(value){
  var format = /[$&+,:;=[\]{}\\/_?@#|'<>.^*()%!"-\d]/g;
  return format.test(value);
}

export function countChars(line) {
  return line.split(' ').filter(word => !isEmpty(word)).reduce((acc, cur) => acc += cur.length, 0)
}

export function formatAmountToNumber(value){
  if(value){
    return parseFloat(value.replace(/,/g,""))
  }
}

export function disableBodyTouch(enable) {
  if(!enable) {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.pointerEvents = 'none';
  } else {
    document.body.style.overflow = 'auto';
    document.body.style.touchAction = 'unset';
    document.body.style.pointerEvents = 'unset';
  }
}

export function disableBodyOverflow(enable) {
  if(!enable) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}

export function disableContainerTouch(enable) {

  let Container = document.getElementsByClassName('Container') ? document.getElementsByClassName('Container')[0] : '';

  if(!Container) {
    return;
  }
  if(!enable) {
    Container.style.overflow = 'hidden';
    Container.style.touchAction = 'none';
    Container.style.pointerEvents = 'none';
  } else {
    Container.style.overflow = 'auto';
    Container.style.touchAction = 'unset';
    Container.style.pointerEvents = 'unset';
  }
}


export function numberToSentence(num){ //9 digit limit
  var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

  if(num){
    if(num.toString().indexOf(',') > -1){
      num = num.replace(/,/g, "");
    }
    /*eslint-disable */
    if ((num = num.toString()).length > 9) return 'over limit';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    /*eslint-enable */
    var splitted = str.split(' ');
    str = splitted[splitted.length - 2] === 'lakh' && splitted[0] !== 'one' ?  str.replace(/lakh/g, 'lakhs ') : str
    str = splitted[splitted.length - 2] === 'crore' && splitted[0] !== 'one' ?  str.replace(/crore/g, 'crores ') : str
    
    return capitalizeFirstLetter(str);
  }
}

export function Casesensitivity(str){ console.log(str)
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() + "";
}