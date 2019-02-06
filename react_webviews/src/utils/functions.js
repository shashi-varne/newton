import colors from '../common/theme/Style.css';

export const getHost = (pathname) => {
  return window.location.protocol + '//' + window.location.host + pathname;
};

export const getAcronym = (string) => {
  let split = string.split(' ').slice(0, 2).join(' ');
  let matches = split.match(/\b(\w)/g);
  let acronym = matches.join('');

  return acronym;
};

export const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i),
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
  iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  Opera: () => navigator.userAgent.match(/Opera Mini/i),
  Windows: () => navigator.userAgent.match(/IEMobile/i),
  any: () => (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()),
};


export const getConfig = () => {
  let config = {
    'fisdom': {
      primary: colors.fisdom,
      secondary: colors.secondary,
      default: colors.default,
      label: colors.label,
      type: 'fisdom',
      colorClass: 'fisdomColor',
      backgroundColorClass: 'fisdomBackColor'
    },
    'myway': {
      primary: colors.myway,
      secondary: colors.secondary,
      default: colors.default,
      label: colors.label,
      type: 'myway',
      colorClass: 'mywayColor',
      backgroundColorClass: 'mywayBackColor'
    },
    'Fisdom Prime': {
      primary: colors.myway,
      secondary: colors.secondary,
      default: colors.default,
      label: colors.label,
      type: 'Fisdom Prime',
      colorClass: 'mywayColor',
      backgroundColorClass: 'mywayBackColor'
    }
  }

  let search = window.location.search;
  const isPrime = search.indexOf("mypro.fisdom.com") >= 0;
  const ismyway = search.indexOf("api.mywaywealth.com") >= 0;
  // const ismyway = true;
  let productType = 'fisdom';

  if (ismyway) {
    productType = 'myway';
  } else if (isPrime) {
    productType = 'Fisdom Prime';
  }

  return config[productType];
}