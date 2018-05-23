export const getHost = (pathname) => {
  return window.location.protocol+'//'+window.location.host+pathname;
};

export const getAcronym = (string) => {
  let split = string.split(' ' ).slice(0,2).join(' ');
  let matches = split.match(/\b(\w)/g);
  let acronym = matches.join('');

  return acronym;
};
