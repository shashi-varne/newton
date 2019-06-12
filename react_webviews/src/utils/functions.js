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

  // let main_query_params = qs.parse(myHistory.location.search.slice(1));
  let main_query_params = qs.parse(window.location.search.slice(1));
  let { base_url } = main_query_params;
  let { generic_callback } = main_query_params;
  let { redirect_url } = main_query_params;
  let searchParams = `?base_url=${base_url}&generic_callback=${generic_callback}&redirect_url=${redirect_url}`;
  let isInsurance = myHistory.location.pathname.indexOf('insurance') >= 0 ? true : false;
  if (isInsurance) {
    let { insurance_v2 } = main_query_params;
    let { insurance_id } = main_query_params;
    searchParams += '&insurance_id=' + insurance_id +
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
  // const ismyway = search.indexOf("api.mywaywealth.com") >= 0;
  const insurance_v2 = search.indexOf("insurance_v2") >= 0;
  let productType = 'fisdom';
  const ismyway = false;
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
  } else if (myHistory.location.pathname.indexOf('isip') >= 0) {
    project = 'isip';
  }
  returnConfig.project = project;
  returnConfig.generic_callback = generic_callback;
  let { insurance_allweb } = main_query_params;
  if (insurance_allweb) {
    returnConfig.insurance_allweb = insurance_allweb;
    searchParams += '&insurance_allweb=' + insurance_allweb;
  }

  if (isMobile.Android() && typeof window.Android !== 'undefined') {
    returnConfig.app = 'android';
    returnConfig.Android = true;
  } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
    returnConfig.app = 'ios';
    returnConfig.iOS = true;
  } else {
    returnConfig.app = 'web';
    returnConfig.Android = true;
  }

  if (insurance_v2) {
    returnConfig.insurance_v2 = true;
  }

  if (project === 'mandate-otm') {
    let { key } = main_query_params;
    let { name } = main_query_params;
    let { email } = main_query_params;
    let { campaign_version } = main_query_params;
    let { html_camera } = main_query_params;
    searchParams += '&key=' + key + '&name=' + name
      + '&email=' + email + '&campaign_version=' + campaign_version;

    returnConfig.campaign_version = campaign_version;
    returnConfig.html_camera = (returnConfig.iOS && returnConfig.campaign_version) ? true : html_camera;
    if (returnConfig.iOS && !returnConfig.campaign_version) {
      returnConfig.hide_header = true;
    }
  }

  if (project === 'isip') {
    let { pc_urlsafe } = qs.parse(myHistory.location.search.slice(1));
    let { campaign_version } = qs.parse(myHistory.location.search.slice(1));
    searchParams = '?base_url=' + encodeURIComponent(base_url) + '&pc_urlsafe=' + pc_urlsafe +
      '&campaign_version=' + campaign_version;

    // eslint-disable-next-line
    returnConfig.campaign_version = parseInt(campaign_version);
    if (returnConfig.iOS && !returnConfig.campaign_version) {
      returnConfig.hide_header = true;
    }
  }

  returnConfig.searchParams = searchParams;
  return returnConfig;
}
