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
  let rule = /^([\S]+)\s([\S]+)\s([\S]+)/;
  return rule.test(text);
}

export function validatePan(string) {
  let rule = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  return rule.test(string);
}
