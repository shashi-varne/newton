// import colors from '../common/theme/Style.css';
import { checkValidString, getUrlParams } from './validators';
import $ from 'jquery';

const partnersConfigBase = {
  obc: {
    logo: "obc.png",
    primary_color: "#4DB848",
    code: "obc",
    email: "obc@fisdom.com",
    mobile: "+11-41-134848",
    message:
      "Make smart investments with zero paper work, use OBC m-pay app if you're a registered user on m-pay app or download fisdom http:m.onelink.me/32660e84. Use my referral code ",
    banner: "obc_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  },
  lvb: {
    logo: "lvb.png",
    primary_color: "#CC0E00",
    code: "lvb",
    email: "lvb@fisdom.com",
    mobile: "+80-48-093070",
    message:
      "Make smart investments with zero paper work, use LVB Mobile app if you're a registered user on lvb app or download fisdom http:m.onelink.me/32660e84. Use my referral code ",
    banner: "obc_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  },
  svc: {
    logo: "svc.png",
    primary_color: "#213B68",
    code: "svc",
    email: "svc@fisdom.com",
    mobile: "+80-48-093070",
    message:
      "Make smart investments with zero paper work, use SVC app if you're a registered user on svc app or download fisdom http:m.onelink.me/32660e84. Use my referral code ",
    banner: "obc_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  },
  fisdom: {
    logo: "logo_white.png",
    primary_color: "#4f2da7",
    code: "fisdom",
    email: "ask@fisdom.com",
    mobile: "+80-48-093070",
    message: "",
    banner: "obc_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png",
    invest_screen_cards: {
      nps: true,
      gold: true
    }
  },
  myway: {
    logo: "myway_white_logo.png",
    primary_color: "#3792FC",
    code: "myway",
    email: "ask@mywaywealth.com",
    mobile: "+80-48-039999",
    message: "",
    banner: "obc_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png",
    invest_screen_cards: {
      nps: true,
      gold: true
    }
  },
  test: {
    logo: "logo_white.png",
    primary_color: "#4f2da7",
    code: "fisdom",
    email: "ask@fisdom.com",
    mobile: "+80-48-093070",
    message: "",
    banner: "obc_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png",
    invest_screen_cards: {
      nps: true,
      gold: true
    }
  },
  bfdlmobile: {
    logo: "bfdl_white_sdk_logo.svg",
    primary_color: '#004164',
    secondary_color: "#ff5928",
    cta_disabled_color: "#ffffff",
    code: "bfdlmobile",
    email: "bajajfinserv@mywaywealth.com",
    mobile: "+91-76191-71846",
    message: "",
    banner: "bfdl_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "bfdlmobile_search.png",
    inputFocusedColor: '#00ffbc'
  },
  alb: {
    logo: "alb.png",
    primary_color: "#2E3192",
    back_button_color: "#2E3192",
    notifications_color: "#00aeef",
    secondary_color: "#00aeef",
    header_title_color: "#2E3192",
    code: "alb",
    email: "alb@fisdom.com",
    mobile: "+91-76191-71839",
    message:
      "Make smart investments with zero paper work, use emPower app if you're a registered user on emPower app or download emPower app http://onelink.to/uuxsss. Use my referral code ",
    banner: "alb_banner.png",
    back_button: "alb_back_icon.png",
    close_button: "alb_close_nav_icon.svg",
    search_button: "alb_search.png"
  },
  tvscredit: {
    logo: "tvs.png",
    primary_color: "#2d2851",
    code: "tvscredit",
    email: "tvscredit@fisdom.com",
    mobile: "+80-48-093070",
    message:
      "Make smart investments with zero paper work, use Tvs Credit app if you're a registered user on Tvs Credit app or download fisdom http:m.onelink.me/32660e84. Use my referral code ",
    banner: "tvs_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  },
  ktb: {
    logo: "logo_white.png",
    primary_color: "#8C0094",
    code: "ktb",
    email: "kbl@fisdom.com",
    mobile: "+91-63663-70477",
    message: "",
    banner: "obc_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  },
  cub: {
    logo: "cub.png",
    primary_color: "#000180",
    code: "cub",
    mobile: "+80-48-093070",
    email: "cub@fisdom.com",
    message: "",
    banner: "bfdl_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  },
  fpg: {
    logo: "fpg.png",
    primary_color: "#EB6024",
    secondary_color: "#EB6024",
    cta_disabled_background: "#F1D5C9",
    cta_disabled_color: "#ffffff",
    code: "fpg",
    mobile: "1800-212-5997",
    email: "care.futuremoney@fisdom.com",
    message: "",
    banner: "bfdl_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png",
    invest_screen_cards: {
      nps: true,
      gold: true
    }
  },
  hbl: {
    logo: "hbl.png",
    primary_color: "#0066B3",
    code: "hbl",
    mobile: "+80-48-093070",
    email: "hbl@fisdom.com",
    message: "",
    banner: "bfdl_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  },
  subh: {
    logo: "subh.svg",
    primary_color: "#F5821F",
    secondary_color: "#F5821F",
    cta_disabled_color: "#ffffff",
    code: "subh",
    email: "ask@fisdom.com",
    mobile: "+91-76191-71846",
    message: "",
    banner: "bfdl_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  },
  sbm: {
    logo: "sbm.svg",
    primary_color: "#1e3769",
    code: "sbm",
    mobile: "+80-48-093070",
    email: "sbm@fisdom.com",
    message: "",
    banner: "bfdl_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  },
  flexi: {
    logo: "logo_white.png",
    primary_color: "#4f2da7",
    code: "flexi",
    email: "ask@fisdom.com",
    mobile: "+80-48-093070",
    message: "",
    banner: "obc_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png",
    invest_screen_cards: {
      nps: true,
      gold: true
    }
  },
};

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

function getPartnerConfig(partner_code) {

  let search = window.location.search;
  let baseConfig = {
    'fisdom': {
      primary: '#4f2da7',
      secondary: '#35cb5d',
      default: '#4a4a4a',
      highlight_color: '#f6f2ff',
      label: '#a2a2a2',
      type: 'fisdom',
      // inputFocusedColor: '#4f2da7', 
      productName: 'fisdom',
      appLink: 'http://m.onelink.me/32660e84',
      termsLink: 'https://www.fisdom.com/terms/',
      schemeLink: 'https://www.fisdom.com/scheme-offer-documents/',
      askEmail: 'ask@fisdom.com',
      mobile: '+91-8048093070',
      configPrimaryColorClass: 'configPrimaryColorClass',
      configPrimaryBackgroundColorClass: 'fisdomBackColor',
      webAppUrl: 'https://app.fisdom.com/#!/'
    },
    'myway': {
      primary: '#3792fc',
      secondary: '#35cb5d',
      default: '#4a4a4a',
      highlight_color: '#F0F7FF',
      label: '#a2a2a2',
      type: 'myway',
      // inputFocusedColor: '#3792fc',
      productName: 'myway',
      mobile: '+91-8048039999',
      appLink: 'https://go.onelink.me/6fHB/b750d9ac',
      termsLink: 'https://mywaywealth.com/terms/',
      schemeLink: 'https://mywaywealth.com/scheme/',
      askEmail: 'ask@mywaywealth.com',
      configPrimaryColorClass: 'configPrimaryColorClass',
      configPrimaryBackgroundColorClass: 'mywayBackColor',
      webAppUrl: 'https://app.mywaywealth.com/#!/'
    }
  }

  const ismyway = search.indexOf("api.mywaywealth.com") >= 0;
  const isStaging = search.indexOf("staging") >= 0;
  let productType = 'fisdom';
  if (ismyway || partner_code === 'bfdlmobile' ||
    partner_code === 'myway') {
    productType = 'myway';
  }

  let config_to_return = baseConfig[productType];

  if (isStaging) {
    config_to_return.webAppUrl = 'https://sdk-dot-plutus-web.appspot.com/#!/';
    // config_to_return.webAppUrl = 'http://localhost:3001/#!/';
  }

  let partnerKeysMapper = {
    'askEmail': 'email',
    'mobile': 'mobile',
    'primary': 'primary_color',
    'secondary': 'secondary_color',
    'cta_disabled_color': 'cta_disabled_color',
    'cta_disabled_background': 'cta_disabled_background',
    'back_button_color': 'back_button_color',
    'notifications_color': 'notifications_color',
    'header_title_color': 'header_title_color',
    'inputFocusedColor': 'inputFocusedColor'
  };

  config_to_return.isFinwiz = true;

  if (checkValidString(partner_code) && partner_code !== 'fisdom' &&
    partner_code !== 'myway' && partner_code !== 'test') {
    if (partner_code === 'bfdl') {
      partner_code = 'bfdlmobile';
    }
    let partnerData = partnersConfigBase[partner_code];
    config_to_return.partner_code = partner_code;
    config_to_return.isFinwiz = false;
    for (var key in partnerKeysMapper) {

      let key_to_copy = partnerKeysMapper[key];
      if (partnerData[key_to_copy]) {
        config_to_return[key] = partnerData[key_to_copy];
      }
    }


  }

  let html = document.querySelector(`html`);
  html.style.setProperty(`--secondary`, `${config_to_return.secondary}`);
  html.style.setProperty(`--highlight`, `${config_to_return.highlight_color}`);
  html.style.setProperty(`--primary`, `${config_to_return.primary}`);
  html.style.setProperty(`--default`, `${config_to_return.default}`);
  html.style.setProperty(`--label`, `${config_to_return.label}`);
  html.style.setProperty(`--desktop-width`, '640px');

  return config_to_return;
}

export function setWebAppParams(redirect_url) {
  redirect_url = decodeURIComponent(redirect_url);
  let redirect_url_data = redirect_url.split("?is_secure=");

  let is_secure = false;
  if (redirect_url_data.length === 2) {
    is_secure = redirect_url_data[1]
  }

  let web_params = 'is_secure=' + is_secure;
  return web_params;

}

export const isMobileDevice = () => {
  var mobileDevice = isMobile.any() || window.innerWidth < 767;
  if (mobileDevice) {
    $("body").attr('data-device', 'mobile');
  } else {
    $("body").attr('data-device', 'web');
  }

  return mobileDevice;
}

export const getConfig = () => {

  let main_pathname = window.location.pathname;
  let main_query_params = getUrlParams();
  let { base_url } = main_query_params;
  let { generic_callback } = main_query_params;
  let { redirect_url } = main_query_params;
  let { partner_code } = main_query_params;
  let { pc_urlsafe } = main_query_params;

  let project = 'insurance';
  let project_child = '';
  if (main_pathname.indexOf('group-insurance') >= 0) {
    project = 'group-insurance';
    generic_callback = "true";
    project_child = 'bhartiaxa';
    if (main_pathname.indexOf('term') >= 0) {
      project_child = 'term';
    }

  } else if (main_pathname.indexOf('insurance') >= 0) {
    project = 'insurance';

  } else if (main_pathname.indexOf('risk') >= 0) {
    project = 'risk';
  } else if (main_pathname.indexOf('mandate-otm') >= 0) {
    project = 'mandate-otm';
  } else if (main_pathname.indexOf('e-mandate') >= 0) {
    project = 'e-mandate';
    generic_callback = "true";
  } else if (main_pathname.indexOf('mandate') >= 0) {
    project = 'mandate';
  } else if (main_pathname.indexOf('gold') >= 0) {
    project = 'gold';
  } else if (main_pathname.indexOf('isip') >= 0) {
    project = 'isip';
  } else if (main_pathname.indexOf('referral') >= 0) {
    project = 'referral';
  } else if (main_pathname.indexOf('help') >= 0) {
    project = 'help';
    generic_callback = "true";
  }

  let search = window.location.search;
  const insurance_v2 = generic_callback === "true" ? true : search.indexOf("insurance_v2") >= 0;

  let returnConfig = getPartnerConfig(partner_code);

  let searchParams = `?base_url=${base_url}`;
  let searchParamsMustAppend = `?base_url=${base_url}`;

  if (checkValidString(generic_callback)) {
    returnConfig.generic_callback = generic_callback;
    searchParams += `&generic_callback=${generic_callback}`;
    searchParamsMustAppend += `&generic_callback=${generic_callback}`;
  }

  if (checkValidString(redirect_url)) {
    returnConfig.webAppParams = setWebAppParams(redirect_url);

    returnConfig.webAppUrl = decodeURIComponent(redirect_url).split('#')[0] + '#!/';
    redirect_url = encodeURIComponent(redirect_url)
    returnConfig.redirect_url = redirect_url;
    searchParams += `&redirect_url=${redirect_url}`;
    searchParamsMustAppend += `&redirect_url=${redirect_url}`;
  }

  if (checkValidString(partner_code)) {
    returnConfig.partner_code = partner_code;
    searchParams += `&partner_code=${partner_code}`;
    searchParamsMustAppend += `&partner_code=${partner_code}`;
  }

  if (checkValidString(pc_urlsafe)) {
    returnConfig.pc_urlsafe = pc_urlsafe;
    searchParams += `&pc_urlsafe=${pc_urlsafe}`;
    searchParamsMustAppend += `&pc_urlsafe=${pc_urlsafe}`;
  }

  if (project === 'insurance' || project_child === 'term') {
    let insurance_v2 = generic_callback === "true" ? true : main_query_params.insurance_v2;
    let { insurance_id } = main_query_params;
    let { isJourney } = main_query_params;

    searchParams += '&insurance_id=' + insurance_id +
      '&insurance_v2=' + insurance_v2;
    searchParamsMustAppend += '&insurance_v2=' + insurance_v2;

    if (checkValidString(isJourney)) {
      searchParams += '&isJourney=' + isJourney;
      searchParamsMustAppend += '&isJourney=' + isJourney;
    }
  }

  returnConfig.project = project;
  returnConfig.project_child = project_child;
  returnConfig.isMobileDevice = isMobileDevice();

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
    returnConfig.Web = true;
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
    returnConfig.html_camera = ((returnConfig.iOS || returnConfig.Web) && returnConfig.campaign_version) ? true : html_camera;
    if (returnConfig.iOS && !returnConfig.campaign_version) {
      returnConfig.hide_header = true;
    }
  }

  if (project === 'isip') {
    let campaign_version = generic_callback === "true" ? 1 : main_query_params.campaign_version;
    searchParams += '&campaign_version=' + campaign_version;

    // eslint-disable-next-line
    returnConfig.campaign_version = parseInt(campaign_version);
    if (returnConfig.iOS && !returnConfig.campaign_version) {
      returnConfig.hide_header = true;
    }
  }

  returnConfig.current_params = main_query_params;
  returnConfig.base_url = base_url;
  returnConfig.searchParams = searchParams;
  returnConfig.searchParamsMustAppend = searchParamsMustAppend;
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
  let head = document.getElementsByClassName('Header') && document.getElementsByClassName('Header')[0] ? document.getElementsByClassName('Header')[0].offsetHeight : 0;
  let banner = document.getElementsByClassName('Banner')[0];
  let bannerHeight = (banner) ? banner.offsetHeight : 0;
  let step = document.getElementsByClassName('Step')[0];
  let stepHeight = (step) ? step.offsetHeight : 0;

  let body = document.getElementsByTagName('body') && document.getElementsByTagName('body')[0]
    ? document.getElementsByTagName('body')[0].offsetHeight : 0;
  let client = document.getElementsByClassName('ContainerWrapper') && document.getElementsByClassName('ContainerWrapper')[0]
    ? document.getElementsByClassName('ContainerWrapper')[0].offsetHeight : 0;
  let foot = document.getElementsByClassName('Footer') && document.getElementsByClassName('Footer')[0] ? document.getElementsByClassName('Footer')[0].offsetHeight : 0;

  let HeaderHeight = bannerHeight + stepHeight + head + 'px';
  if (data.header && document.getElementById('HeaderHeight')) {
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