export function validateAlphabets(string) {
  return string.match(/^[a-z A-Z]+$/);
}

export function validateEmail(string) {
  let rule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return rule.test(string);
}

export function validateNumber(number) {
  let rule = /^[0-9]+$/;
  return rule.test(number);
}

export function validateAddress(text) {
  return (text.length > 0) ? true : false;
}

export function validatePan(string) {
  let rule = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  return rule.test(string);
}

export function formatAmount(amount) {
  amount = amount.toString();
  let lastThree = amount.substring(amount.length-3);
  let otherNumbers = amount.substring(0,amount.length-3);
  if (otherNumbers !== '')
      lastThree = ',' + lastThree;
  let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return res;
}

export function numDifferentiation(val) {
  if(val >= 10000000) val = (val/10000000).toFixed(1) + ' Crores';
  else if(val >= 100000) val = (val/100000).toFixed(1) + ' Lakhs';
  else if(val >= 1000) val = (val/1000).toFixed(1) + ' Thousand';
  return val;
}

export function validateName(string) {
  return string.trim().indexOf(' ') !== -1;
}
