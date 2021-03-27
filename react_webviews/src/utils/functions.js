// import colors from '../common/theme/Style.scss';
import { checkValidString, getUrlParams } from './validators';
import $ from 'jquery';

const partnersConfigBase = {
  obc: {
    logo: 'obc.png',
    primary_color: '#4DB848',
    code: 'obc',
    email: 'obc@fisdom.com',
    mobile: '+91-7829228887',
    message:
      "Make smart investments with zero paper work, use OBC m-pay app if you're a registered user on m-pay app or download fisdom http:m.onelink.me/32660e84. Use my referral code ",
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
  },
  lvb: {
    logo: 'lvb.png',
    primary_color: '#CC0E00',
    code: 'lvb',
    email: 'lvb@fisdom.com',
    mobile: '+91-7829228886',
    message:
      "Make smart investments with zero paper work, use LVB Mobile app if you're a registered user on lvb app or download fisdom http:m.onelink.me/32660e84. Use my referral code ",
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
  },
  svc: {
    logo: 'svc.png',
    primary_color: '#213B68',
    code: 'svc',
    email: 'svc@fisdom.com',
    mobile: '+91-7829228886',
    message:
      "Make smart investments with zero paper work, use SVC app if you're a registered user on svc app or download fisdom http:m.onelink.me/32660e84. Use my referral code ",
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
  },
  fisdom: {
    logo: 'logo_white.png',
    primary_color: '#4f2da7',
    code: 'fisdom',
    email: 'ask@fisdom.com',
    mobile: '+91-7829228886',
    message: '',
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    invest_screen_cards: {
      nps: true,
      gold: true,
      insurance: true,
      risk_profile: true,
      instaredeem: true,
      fhc: true,
    },
  },
  finity: {
    logo: 'finity_white_logo.png',
    primary_color: '#3792FC',
    code: 'finity',
    email: 'ask@finity.in',
    mobile: '+91-9916149111',
    message: '',
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    invest_screen_cards: {
      nps: true,
      gold: true,
      insurance: true,
      risk_profile: true,
      instaredeem: true,
      fhc: true,
    },
  },
  test: {
    logo: 'logo_white.png',
    primary_color: '#4f2da7',
    code: 'fisdom',
    email: 'ask@fisdom.com',
    mobile: '+91-7829228886',
    message: '',
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    invest_screen_cards: {
      nps: true,
      gold: true,
      insurance: true,
      risk_profile: true,
      instaredeem: true,
      fhc: true,
    },
  },
  bfdlmobile: {
    logo: 'bfdl_white_sdk_logo.svg',
    primary_color: '#004164',
    secondary_color: '#ff5928',
    cta_disabled_color: '#ffffff',
    code: 'bfdlmobile',
    email: 'bajajfinserv@finity.in',
    mobile: '+91-7829331118',
    message: '',
    banner: 'bfdl_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'bfdlmobile_search.png',
    invest_screen_cards: {
      risk_profile: true,
    },
    invest_cards_handling: {
      our_recommendations: ['100_sip', 'instaredeem', 'buildwealth', 'savetax'],
    },
    landing_marketing_banners: [
      { image: 'mb_4.svg', type: '100_sip' },
      { image: 'mb_6.svg', type: 'diy' },
      { image: 'mb_5.svg', type: 'buildwealth' },
    ],
    feature_manager: {
      hide_apply_refferal: true,
      hide_share_refferal: true,
    },
  },
  alb: {
    logo: 'alb.png',
    primary_color: '#2E3192',
    back_button_color: '#2E3192',
    notifications_color: '#00aeef',
    secondary_color: '#00aeef',
    header_title_color: '#2E3192',
    code: 'alb',
    email: 'alb@fisdom.com',
    mobile: '+91-7829733111',
    message:
      "Make smart investments with zero paper work, use emPower app if you're a registered user on emPower app or download emPower app http://onelink.to/uuxsss. Use my referral code ",
    banner: 'alb_banner.png',
    back_button: 'alb_back_icon.png',
    close_button: 'alb_close_nav_icon.svg',
    search_button: 'alb_search.png',
    invest_screen_cards: {
      nps: true,
    },
  },
  tvscredit: {
    logo: 'tvs.png',
    primary_color: '#2d2851',
    code: 'tvscredit',
    email: 'tvscredit@fisdom.com',
    mobile: '+91-7829228886',
    message:
      "Make smart investments with zero paper work, use Tvs Credit app if you're a registered user on Tvs Credit app or download fisdom http:m.onelink.me/32660e84. Use my referral code ",
    banner: 'tvs_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    invest_cards_handling: {
      our_recommendations: ['100_sip', 'instaredeem', 'buildwealth', 'savetax'],
    },
  },
  ktb: {
    logo: 'logo_white.png',
    primary_color: '#8C0094',
    code: 'ktb',
    email: 'kbl@fisdom.com',
    mobile: '+91-7829229997',
    message: '',
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    feature_manager: {
      hide_share_refferal: true,
    },
  },
  cub: {
    logo: 'cub.png',
    primary_color: '#000180',
    code: 'cub',
    mobile: '+91-7829228886',
    email: 'cub@fisdom.com',
    message: '',
    banner: 'bfdl_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
  },
  fpg: {
    logo: 'text_investments.svg',
    primary_color: '#EB6024',
    secondary_color: '#EB6024',
    cta_disabled_background: '#F1D5C9',
    cta_disabled_color: '#ffffff',
    code: 'fpg',
    mobile: '1800-212-5997',
    email: 'care.futuremoney@fisdom.com',
    message: '',
    banner: 'bfdl_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    landing_marketing_banners: [
      { image: 'Gold_updated_banner.svg', type: 'gold' },
      { image: 'fpg_mb_insta.svg', type: 'instaredeem' },
      { image: 'fpg_mb_100.svg', type: 'buildwealth' },
    ],
    feature_manager: {
      hide_apply_refferal: true,
      hide_share_refferal: true,
    },
    invest_screen_cards: {
      nps: true,
      gold: true,
    },
    invest_cards_handling: {
      our_recommendations: ['instaredeem', 'buildwealth', 'gold', 'savetax'],
      diy: ['diyv2'],
      bottom_scroll_cards: ['parkmoney', 'savegoal'],
      bottom_cards: ['nfo'],
      popular_cards: ['top_equity', 'nps'],
    },
    invest_render_cards: [
      'kyc',
      'our_recommendations',
      'popular_cards',
      'diy',
      'bottom_scroll_cards',
      'bottom_cards',
      'financial_tools',
    ],
    entry: {
      nps: 'inside_sdk',
    },
  },
  hbl: {
    logo: 'hbl.png',
    primary_color: '#0066B3',
    code: 'hbl',
    mobile: '+91-7829228886',
    email: 'ask@fisdom.com',
    message: '',
    banner: 'bfdl_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    invest_screen_cards: {
      nps: true,
      gold: true,
      insurance: true,
      risk_profile: true,
    },
  },
  subh: {
    logo: 'subh.svg',
    primary_color: '#F5821F',
    secondary_color: '#F5821F',
    cta_disabled_color: '#ffffff',
    code: 'subh',
    email: 'support@shubhloans.com',
    mobile: '+91-9019900199',
    message: '',
    banner: 'bfdl_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    invest_cards_handling: {
      our_recommendations: ['100_sip', '300_sip', 'instaredeem'],
      diy: ['diyv2'],
    },
    invest_render_cards: ['kyc', 'our_recommendations', 'diy'],
  },
  sbm: {
    logo: 'sbm.svg',
    primary_color: '#1e3769',
    code: 'sbm',
    mobile: '+91-7829228886',
    email: 'sbm@fisdom.com',
    message: '',
    banner: 'bfdl_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
  },
  flexi: {
    logo: 'logo_white.png',
    primary_color: '#4f2da7',
    code: 'flexi',
    email: 'ask@fisdom.com',
    mobile: '+91-7829228886',
    message: '',
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    invest_screen_cards: {
      nps: true,
      gold: true,
      insurance: true,
      risk_profile: true,
    },
  },
  medlife: {
    logo: 'logo_white.png',
    primary_color: '#4f2da7',
    code: 'medlife',
    email: 'ask@fisdom.com',
    mobile: '+91-7829228886',
    message: '',
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    invest_screen_cards: {
      nps: true,
      gold: true,
      insurance: true,
      risk_profile: true,
    },
  },
  life99: {
    logo: 'logo_white.png',
    primary_color: '#4f2da7',
    code: 'life99',
    email: 'ask@fisdom.com',
    mobile: '+91-7829228886',
    message: '',
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
  },
  google: {
    logo: 'logo_white.png',
    primary_color: '#4f2da7',
    code: 'google',
    email: 'ask@fisdom.com',
    mobile: '+80-48-093070',
    message: '',
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
    white_header: true,
  },
  indb: {
    logo: 'logo_white.png',
    primary_color: '#173883',
    secondary_color: '#173883',
    code: 'indb',
    email: 'ask@fisdom.com',
    mobile: '+80-48-093070',
    message: '',
    banner: 'obc_banner.png',
    back_button: 'back_icon_white.png',
    close_button: 'close_nav_icon.svg',
    search_button: 'search.png',
  },
  taxwin: {
    logo: "logo_white.png",
    primary_color: "#4f2da7",
    code: "taxwin",
    email: "ask@fisdom.com",
    mobile: "+91-7829228886",
    message: "",
    banner: "obc_banner.png",
    back_button: "back_icon_white.png",
    close_button: "close_nav_icon.svg",
    search_button: "search.png"
  }
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
  any: () =>
    isMobile.Android() ||
    isMobile.BlackBerry() ||
    isMobile.iOS() ||
    isMobile.Opera() ||
    isMobile.Windows(),
};

function getPartnerConfig(partner_code) {
  let search = window.location.search;
  let baseConfig = {
    fisdom: {
      primary: '#4f2da7',
      secondary: '#35cb5d',
      default: '#4a4a4a',
      highlight_color: '#f6f2ff',
      skelton_color: '#E7E7E7',
      label: '#a2a2a2',
      type: 'fisdom',
      // inputFocusedColor: '#4f2da7',
      productName: 'fisdom',
      appLink: 'https://fisdom.onelink.me/CQFA/3e75c8f6',
      termsLink: 'https://www.fisdom.com/terms/',
      schemeLink: 'https://www.fisdom.com/scheme-offer-documents/',
      askEmail: 'ask@fisdom.com',
      mobile: '+91-7829228886',
      configPrimaryColorClass: 'configPrimaryColorClass',
      configPrimaryBackgroundColorClass: 'fisdomBackColor',
      webAppUrl: 'https://app.fisdom.com/#!/',
      email_domain: 'fisdom.com',
    },
    finity: {
      primary: '#3792fc',
      secondary: '#35cb5d',
      default: '#4a4a4a',
      highlight_color: '#F0F7FF',
      skelton_color: '#E7E7E7',
      label: '#a2a2a2',
      type: 'finity',
      // inputFocusedColor: '#3792fc',
      productName: 'finity',
      mobile: '+91-8048039999',
      appLink: 'https://myway.onelink.me/W4GN/1f539fd2',
      termsLink: 'https://finity.in/terms/',
      schemeLink: 'https://finity.in/scheme/',
      askEmail: 'ask@finity.in',
      configPrimaryColorClass: 'configPrimaryColorClass',
      configPrimaryBackgroundColorClass: 'mywayBackColor',
      webAppUrl: 'https://app.mywaywealth.com/#!/',
      email_domain: 'finity.in',
    },
    minvest: {
      primary: '#FF5C34',
      secondary: '#35cb5d',
      default: '#4a4a4a',
      highlight_color: '#f6f2ff',
      label: '#a2a2a2',
      type: 'minvest',
      productName: 'minvest',
      appLink: 'https://fisdom.onelink.me/CQFA/3e75c8f6',
      termsLink: 'https://www.fisdom.com/terms/',
      schemeLink: 'https://www.fisdom.com/scheme-offer-documents/',
      askEmail: 'ask@fisdom.com',
      mobile: '+91-8048093070',
      configPrimaryColorClass: 'configPrimaryColorClass',
      configPrimaryBackgroundColorClass: 'fisdomBackColor',
      webAppUrl: 'https://app.fisdom.com/#!/',
      email_domain: 'fisdom.com',
    },
  };

  const ismyway =
    search.indexOf('api.mywaywealth.com') >= 0 ||
    search.indexOf('plutus-finwizard-pro.appspot.com') >= 0;
  const isminvest = search.indexOf('my.barodaminvest.com') >= 0;
  const isStaging = search.indexOf('staging') >= 0;
  let productType = 'fisdom';
  if (ismyway || partner_code === 'bfdlmobile' || partner_code === 'finity') {
    productType = 'finity';
  }

  if (isminvest) {
    productType = 'minvest';
  }

  let config_to_return = baseConfig[productType];

  if (isStaging) {
    // config_to_return.webAppUrl = 'https://mayank-dot-plutus-web.appspot.com/#!/';
    // config_to_return.webAppUrl = 'http://localhost:3001/#!/';
    config_to_return.webAppUrl = window.location.origin + '/appl/web/view#!/';
  }

  config_to_return.isStaging = isStaging;

  let partnerKeysMapper = {
    askEmail: 'email',
    mobile: 'mobile',
    primary: 'primary_color',
    secondary: 'secondary_color',
    cta_disabled_color: 'cta_disabled_color',
    cta_disabled_background: 'cta_disabled_background',
    back_button_color: 'back_button_color',
    notifications_color: 'notifications_color',
    header_title_color: 'header_title_color',
    inputFocusedColor: 'inputFocusedColor',
    white_header: 'white_header',
  };

  config_to_return.isFinwiz = true;

  if (
    checkValidString(partner_code) &&
    partner_code !== 'fisdom' &&
    partner_code !== 'finity' &&
    partner_code !== 'test'
  ) {
    if (partner_code === 'bfdl') {
      partner_code = 'bfdlmobile';
    }
    let partnerData = partnersConfigBase[partner_code] || partnersConfigBase['fisdom'];
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
  html.style.setProperty(`--skelton-color`, `${config_to_return.skelton_color}`);
  html.style.setProperty(`--primary`, `${config_to_return.primary}`);
  html.style.setProperty(`--default`, `${config_to_return.default}`);
  html.style.setProperty(`--label`, `${config_to_return.label}`);
  html.style.setProperty(`--desktop-width`, '640px');
  html.style.setProperty(`--tooltip-width`, '540px');
  html.style.setProperty('--color-action-disable', '#E8ECF1');

  return config_to_return;
}

export function setWebAppParams(redirect_url) {
  redirect_url = decodeURIComponent(redirect_url);
  let redirect_url_data = redirect_url.split('?is_secure=');

  let is_secure = false;
  if (redirect_url_data.length === 2) {
    is_secure = redirect_url_data[1];
  }

  let web_params = '';
  if (checkValidString(is_secure)) {
    web_params += 'is_secure=' + is_secure;
  }

  return web_params;
}

export const isMobileDevice = () => {
  var mobileDevice = isMobile.any() || window.innerWidth < 767;
  if (mobileDevice) {
    $('body').attr('data-device', 'mobile');
  } else {
    $('body').attr('data-device', 'web');
  }

  return mobileDevice;
};

export function getParamsMark(data) {
  return (data.match(/[?]/g) ? "&": "?");
}

export const getConfig = () => {
  let main_pathname = window.location.pathname;
  let main_query_params = getUrlParams();


  let { base_url } = main_query_params;

  let origin = window.location.origin;

  let isProdFisdom = origin.indexOf('wv.fisdom.com') >= 0;
  let isProdFinity = origin.indexOf('wv.mywaywealth.com') >= 0;

  var base_href = window.sessionStorage.getItem('base_href') || '';
  let base_url_default = '';

  if(base_href) {
    base_url_default = window.location.origin;
  }

  if(!base_url) {
    if(isProdFisdom) {
      base_url_default = 'https://my.fisdom.com';
    }
  
    if(isProdFinity) {
      base_url_default = 'https://api.mywaywealth.com';
    }
  }
  

  if(base_url_default) {
    base_url = base_url_default;
  }


  let { generic_callback } = main_query_params;
  let { redirect_url } = main_query_params;
  let { sdk_capabilities } = main_query_params;
  let { partner_code } = main_query_params;
  let { app_version } = main_query_params;
  let { pc_urlsafe } = main_query_params;
  let project = '';
  let project_child = '';
  if (main_pathname.indexOf('group-insurance') >= 0) {
    project = 'group-insurance';
    generic_callback = 'true';
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
    generic_callback = 'true';
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
    generic_callback = 'true';
  } else if (main_pathname.indexOf('loan') >= 0) {
    project = 'loan';
  } else if (main_pathname.indexOf('w-report') >= 0) {
    project = 'w-report';
  } else if (main_pathname.indexOf('kyc-esign') >= 0) {
    project = 'kyc-esign';
  } else if (main_pathname.indexOf('pg') >= 0) {
    project = 'pg';
    generic_callback = 'true';
  } else if (main_pathname.indexOf('portfolio-rebalancing') >= 0) {
    project = 'portfolio-rebalancing';
    generic_callback = 'true';
  } else if (main_pathname.indexOf('iw-dashboard') >= 0) {
    project = 'iw-dashboard';
  }

  let search = window.location.search;
  const insurance_v2 = generic_callback === 'true' ? true : search.indexOf('insurance_v2') >= 0;

  let returnConfig = getPartnerConfig(partner_code);

  let searchParams = ``;
  let searchParamsMustAppend = ``;


  base_url_default = '' // removing as of now, because from backend its getting appended & in plutus_redirect_url, so need atleast one from from webview
  if(!base_url_default) {
    searchParams += getParamsMark(searchParams) + `base_url=${base_url}`;
    searchParamsMustAppend += getParamsMark(searchParams) + `base_url=${base_url}`;
  }
  

  if (checkValidString(generic_callback)) {
    returnConfig.generic_callback = generic_callback;
    searchParams += getParamsMark(searchParams) + `generic_callback=${generic_callback}`;
    searchParamsMustAppend +=  getParamsMark(searchParams) + `generic_callback=${generic_callback}`;
  }

  returnConfig.redirect_url = '';
  if (checkValidString(redirect_url)) {
    returnConfig.webAppParams = setWebAppParams(redirect_url);

    returnConfig.webAppUrl = decodeURIComponent(redirect_url).split('#')[0] + '#!/';
    redirect_url = encodeURIComponent(redirect_url);
    returnConfig.redirect_url = redirect_url;
    searchParams +=  getParamsMark(searchParams) +  `redirect_url=${redirect_url}`;
    searchParamsMustAppend += getParamsMark(searchParams) +  `redirect_url=${redirect_url}`;
  }

  if (sdk_capabilities) {
    returnConfig.sdk_capabilities = sdk_capabilities;
    searchParams += getParamsMark(searchParams) +  `sdk_capabilities=${sdk_capabilities}`;
    searchParamsMustAppend += getParamsMark(searchParams) +  `sdk_capabilities=${sdk_capabilities}`;
  }

  if (checkValidString(partner_code)) {
    returnConfig.partner_code = partner_code;
    searchParams += getParamsMark(searchParams) + `partner_code=${partner_code}`;
    searchParamsMustAppend += getParamsMark(searchParams) +  `partner_code=${partner_code}`;
  }

  if (checkValidString(pc_urlsafe)) {
    returnConfig.pc_urlsafe = pc_urlsafe;
    searchParams += getParamsMark(searchParams) + `pc_urlsafe=${pc_urlsafe}`;
    searchParamsMustAppend += getParamsMark(searchParams) + `pc_urlsafe=${pc_urlsafe}`;
  }

  if (project === 'insurance' || project_child === 'term') {
    let insurance_v2 = generic_callback === 'true' ? true : main_query_params.insurance_v2;
    let { insurance_id } = main_query_params;
    let { isJourney } = main_query_params;

    searchParams += getParamsMark(searchParams) + 'insurance_id=' + insurance_id + '&insurance_v2=' + insurance_v2;
    searchParamsMustAppend += getParamsMark(searchParams) + 'insurance_v2=' + insurance_v2;

    if (checkValidString(isJourney)) {
      searchParams += getParamsMark(searchParams) + 'isJourney=' + isJourney;
      searchParamsMustAppend += getParamsMark(searchParams) + 'isJourney=' + isJourney;
    }
  }

  returnConfig.project = project;
  returnConfig.project_child = project_child;
  returnConfig.isMobileDevice = isMobileDevice();

  let { insurance_allweb } = main_query_params;
  if (insurance_allweb) {
    returnConfig.insurance_allweb = insurance_allweb;
    searchParams += getParamsMark(searchParams) + 'insurance_allweb=' + insurance_allweb;
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
    let campaign_version = generic_callback === 'true' ? 1 : main_query_params.campaign_version;
    let { html_camera } = main_query_params;
    searchParams += getParamsMark(searchParams) + 
      'key=' + key + '&name=' + name + '&email=' + email + '&campaign_version=' + campaign_version;

    // eslint-disable-next-line
    returnConfig.campaign_version = parseInt(campaign_version);
    returnConfig.html_camera =
      (returnConfig.iOS || returnConfig.Web) && returnConfig.campaign_version ? true : html_camera;
    if (returnConfig.iOS && !returnConfig.campaign_version) {
      returnConfig.hide_header = true;
    }
  }

  if (project === 'loan') {
    // eslint-disable-next-line
    returnConfig.html_camera = returnConfig.iOS || returnConfig.Web ? true : false;
  }

  if (project === 'isip') {
    let campaign_version = generic_callback === 'true' ? 1 : main_query_params.campaign_version;
    searchParams += getParamsMark(searchParams) + 'campaign_version=' + campaign_version;

    // eslint-disable-next-line
    returnConfig.campaign_version = parseInt(campaign_version);
    if (returnConfig.iOS && !returnConfig.campaign_version) {
      returnConfig.hide_header = true;
    }
  }

  returnConfig.app_version = '';
  if (checkValidString(app_version)) {
    returnConfig.app_version = app_version;
    searchParams += getParamsMark(searchParams) + `app_version=${app_version}`;
    searchParamsMustAppend += getParamsMark(searchParams) + `app_version=${app_version}`;
  }

  // should be last
  returnConfig.current_params = main_query_params;
  returnConfig.base_url = base_url;
  returnConfig.searchParams = searchParams;
  returnConfig.searchParamsMustAppend = searchParamsMustAppend;

  returnConfig.isWebCode = returnConfig.Web || returnConfig.redirect_url;

  return returnConfig;
};

export function isFeatureEnabled(config, feature) {
  let partner_code = config.type;
  let app = config.app;
  let app_version = config.app_version;

  if (config.isStaging) {
    app_version = '999';
  }

  if (app === 'web') {
    return true;
  }

  if (feature === 'etli_download' && app === 'android' && parseInt(app_version, 10) >= 999) {
    return true;
  }

  let mapper = {
    'open_inapp_tab': {
      'fisdom': {
        'android': '205',
        'ios': '5.4'
      },
      'myway': {
        'android': '102',
        'ios': '5.2'
      }
    }
  }

  if (
    mapper[feature] &&
    mapper[feature][partner_code] &&
    mapper[feature][partner_code][app] &&
    mapper[feature][partner_code][app] === app_version
  ) {
    return true;
  }

  return false;
}

export function manageDialog(id, display, aboutScroll) {
  var body = document.getElementsByTagName('body')[0];
  var html = document.getElementsByTagName('html')[0];

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
  let head =
    document.getElementsByClassName('Header') && document.getElementsByClassName('Header')[0]
      ? document.getElementsByClassName('Header')[0].offsetHeight
      : 0;
  let banner = document.getElementsByClassName('Banner')[0];
  let bannerHeight = banner ? banner.offsetHeight : 0;
  let step = document.getElementsByClassName('Step')[0];
  let stepHeight = step ? step.offsetHeight : 0;

  let body =
    document.getElementsByTagName('body') && document.getElementsByTagName('body')[0]
      ? document.getElementsByTagName('body')[0].offsetHeight
      : 0;
  let client =
    document.getElementsByClassName('ContainerWrapper') &&
    document.getElementsByClassName('ContainerWrapper')[0]
      ? document.getElementsByClassName('ContainerWrapper')[0].offsetHeight
      : 0;
  let foot =
    document.getElementsByClassName('Footer') && document.getElementsByClassName('Footer')[0]
      ? document.getElementsByClassName('Footer')[0].offsetHeight
      : 0;

  let HeaderHeight = bannerHeight + stepHeight + head + 'px';
  if (data.header && document.getElementById('HeaderHeight')) {
    document.getElementById('HeaderHeight').style.height = HeaderHeight;
  }

  // not using for now
  if (data.container) {
    if (client > body) {
      document.getElementsByClassName('Container')[0].style.height =
        body - HeaderHeight - foot - 40 + 'px';
    } else {
      document.getElementsByClassName(
        'Container'
      )[0].style.height = document.getElementsByClassName('Container')[0].offsetHeight;
    }

    document.getElementsByClassName('Container')[0].style.height =
      body - HeaderHeight - foot - 40 + 'px';
  }
}
export function capitalize(string) {
  if (!string) {
    return;
  }
  return string.toLowerCase().replace(/(^|\s)[a-z]/g, function (f) {
    return f.toUpperCase();
  });
}

export function isIframe() {
  if (window.top !== window.self) {
    return true;
  } else {
    return false;
  }
}
export function getBasePath() {
  var basename = window.sessionStorage.getItem('base_href') || '';
  if(basename && basename.indexOf('appl/webview') !== -1) {
    basename = basename ? basename + 'view' : '';
  }
  return window.location.origin + basename;
}
