import colors from '../common/theme/Style.css';
import qs from 'qs';
import createBrowserHistory from 'history/createBrowserHistory';

const myHistory = createBrowserHistory();


export const getHost = (pathname) => {
  return window.location.protocol + '//' + window.location.host + pathname;
};

export const getBase64 = (file, callback) => {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    callback(reader.result);
  };
  reader.onerror = function (error) {
    callback(null);
  };
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

  let { base_url } = qs.parse(myHistory.location.search.slice(1));
  let searchParams;
  let isInsurance = myHistory.location.pathname.indexOf('insurance') >= 0 ? true : false;
  if (isInsurance) {
    let { insurance_v2 } = qs.parse(myHistory.location.search.slice(1));
    let { insurance_id } = qs.parse(myHistory.location.search.slice(1));
    searchParams = '?insurance_id=' + insurance_id + '&base_url=' + base_url +
      '&insurance_v2=' + insurance_v2;
  }

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
  // console.log(search);

  const isPrime = search.indexOf("mypro.fisdom.com") >= 0;
  const ismyway = search.indexOf("api.mywaywealth.com") >= 0;
  const insurance_v2 = search.indexOf("insurance_v2") >= 0;
  let productType = 'fisdom';
  if (ismyway) {
    productType = 'myway';
  } else if (isPrime) {
    productType = 'Fisdom Prime';
  }
  let returnConfig = config[productType];

  let project = 'insurance';
  if (myHistory.location.pathname.indexOf('risk') >= 0) {
    project = 'risk';
  } else if (myHistory.location.pathname.indexOf('mandate-otm') >= 0) {
    project = 'mandate-otm';
  } else if (myHistory.location.pathname.indexOf('mandate') >= 0) {
    project = 'mandate';
  } else if (myHistory.location.pathname.indexOf('gold') >= 0) {
    project = 'gold';
  }
  returnConfig.project = project;




  if (insurance_v2) {
    returnConfig.insurance_v2 = true;
  }

  if (isInsurance) {
    returnConfig.searchParams = searchParams;
  }
  if (project === 'mandate-otm') {
    let { key } = qs.parse(myHistory.location.search.slice(1));
    let { name } = qs.parse(myHistory.location.search.slice(1));
    let { email } = qs.parse(myHistory.location.search.slice(1));
    let { campaign_version } = qs.parse(myHistory.location.search.slice(1));
    let { html_camera } = qs.parse(myHistory.location.search.slice(1));
    searchParams = '?base_url=' + encodeURIComponent(base_url) + '&key=' + key + '&name=' + name
      + '&email=' + email + '&campaign_version=' + campaign_version;

    returnConfig.campaign_version = campaign_version;
    returnConfig.html_camera = html_camera;
    returnConfig.searchParams = searchParams;
  }
  returnConfig.iOS = isMobile.iOS();
  returnConfig.Android = isMobile.Android();

  return returnConfig;
}
