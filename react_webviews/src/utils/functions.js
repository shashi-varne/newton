import colors from '../common/theme/Style.css';
import qs from 'qs';
import createBrowserHistory from 'history/createBrowserHistory';

const myHistory = createBrowserHistory();

export const getHost = (pathname) => {
  return window.location.origin + pathname;
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

    let insurance_v2 = generic_callback === "true" ? true : main_query_params.insurance_v2;;
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
      productName: 'fisdom',
      appLink: 'http://m.onelink.me/32660e84',
      termsLink: 'https://www.fisdom.com/terms/',
      schemeLink: 'https://www.fisdom.com/scheme-offer-documents/',
      askEmail: 'ask@fisdom.com',
      mobile: '+91-8048093070',
      colorClass: 'fisdomColor',
      backgroundColorClass: 'fisdomBackColor'
    },
    'myway': {
      primary: colors.myway,
      secondary: colors.secondary,
      default: colors.default,
      label: colors.label,
      type: 'myway',
      productName: 'myway',
      mobile: '+91-8048039999',
      appLink: 'https://go.onelink.me/6fHB/b750d9ac',
      termsLink: 'https://mywaywealth.com/terms/',
      schemeLink: 'https://mywaywealth.com/scheme/',
      askEmail: 'ask@mywaywealth.com',
      colorClass: 'mywayColor',
      backgroundColorClass: 'mywayBackColor'
    }
  }


  let search = window.location.search;
  const insurance_v2 = generic_callback === "true" ? true : search.indexOf("insurance_v2") >= 0;

  const ismyway = search.indexOf("api.mywaywealth.com") >= 0;
  let productType = 'fisdom';
  if (ismyway) {
    productType = 'myway';
  }
  let returnConfig = config[productType];


  let project = 'insurance';
  if (myHistory.location.pathname.indexOf('insurance') >= 0) {
    project = 'insurance';
  } else if (myHistory.location.pathname.indexOf('risk') >= 0) {
    project = 'risk';
  } else if (myHistory.location.pathname.indexOf('mandate-otm') >= 0) {
    project = 'mandate-otm';
  } else if (myHistory.location.pathname.indexOf('mandate') >= 0) {
    project = 'mandate';
  } else if (myHistory.location.pathname.indexOf('gold') >= 0) {
    project = 'gold';
  } else if (myHistory.location.pathname.indexOf('isip') >= 0) {
    project = 'isip';
  } else if (myHistory.location.pathname.indexOf('referral') >= 0) {
    project = 'referral';
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
    let campaign_version = generic_callback === "true" ? 1 : main_query_params.campaign_version;
    let { html_camera } = main_query_params;
    searchParams += '&key=' + key + '&name=' + name
      + '&email=' + email + '&campaign_version=' + campaign_version;

    // eslint-disable-next-line
    returnConfig.campaign_version = parseInt(campaign_version);
    returnConfig.html_camera = (returnConfig.iOS && returnConfig.campaign_version) ? true : html_camera;
    if (returnConfig.iOS && !returnConfig.campaign_version) {
      returnConfig.hide_header = true;
    }
  }

  if (project === 'isip') {
    let { pc_urlsafe } = qs.parse(myHistory.location.search.slice(1));
    let campaign_version = generic_callback === "true" ? 1 : main_query_params.campaign_version;
    searchParams += '&pc_urlsafe=' + pc_urlsafe +
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


export function manageDialog(id, display, aboutScroll) {

  var body = document.getElementsByTagName('body')[0];
  var html = document.getElementsByTagName('html')[0]

  if (aboutScroll === 'disableScroll') {

    html.style.overflowX = 'hidden';
    html.style.overflowY = 'hidden';
    body.style.overflowX = 'hidden';
  } else if (aboutScroll === 'enableScroll') {
    html.style.overflowX = 'inherit';
    html.style.overflowY = 'inherit';
    body.style.overflowX = 'inherit';
  }

  let element = document.getElementById(id);
  if (element !== null && element.style.display !== 'none') {
    element.style.display = display;
    return true;
  } else if (element) {
    element.style.display = display;
    return false;
  } else {
    return false;
  }

}


export function setHeights(data) {
  let head = document.getElementsByClassName('Header')[0].offsetHeight;
  let banner = document.getElementsByClassName('Banner')[0];
  let bannerHeight = (banner) ? banner.offsetHeight : 0;
  let step = document.getElementsByClassName('Step')[0];
  let stepHeight = (step) ? step.offsetHeight : 0;

  let body = document.getElementsByTagName('body')[0].offsetHeight;
  let client = document.getElementsByClassName('ContainerWrapper')[0].offsetHeight;
  let foot = document.getElementsByClassName('Footer')[0] ? document.getElementsByClassName('Footer')[0].offsetHeight : 0;

  let HeaderHeight = bannerHeight + stepHeight + head + 'px';
  if (data.header) {

    document.getElementById('HeaderHeight').style.height = HeaderHeight;
  }


  // not using for now
  if (data.container) {
    if (client > body) {
      document.getElementsByClassName('Container')[0].style.height = body - HeaderHeight - foot - 40 + 'px';
    } else {
      document.getElementsByClassName('Container')[0].style.height = document.getElementsByClassName('Container')[0].offsetHeight;
    }

    document.getElementsByClassName('Container')[0].style.height = body - HeaderHeight - foot - 40 + 'px';
  }

}