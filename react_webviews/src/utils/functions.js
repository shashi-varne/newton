// import colors from '../common/theme/Style.scss';
import { checkValidString, getUrlParams, storageService } from './validators';
import $ from 'jquery';
import { 
  basePartnerConfig, 
  baseStylesConfig, 
  baseTypographyConfig, 
  baseUIElementsConfig, 
  commonCardsConfig, 
  partnerConfigs 
} from './partnerConfigs';

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
  let origin = window.location.origin;

  const ismyway =
    search.indexOf('api.mywaywealth.com') >= 0 ||
    search.indexOf('plutus-finwizard-pro.appspot.com') >= 0 || 
    origin.indexOf('wv.mywaywealth.com') >= 0 || 
    origin.indexOf('wv.finity.in') >= 0 || 
    origin.indexOf('api.mywaywealth.com') >= 0;
  const isminvest = search.indexOf('my.barodaminvest.com') >= 0;
  const isStaging = search.indexOf('staging') >= 0;
  let productType = 'fisdom';
  if (ismyway || partner_code === 'bfdlmobile' || partner_code === 'finity' || partner_code === 'moneycontrol') {
    productType = 'finity';
  }

  if (isminvest) {
    productType = "minvest";
  }

  // Appending base config of the productType(fisdom/finity) with the common config accross all partners
  let config_to_return = {
    ...commonCardsConfig,
    ...basePartnerConfig[productType],
  };

  if (isStaging) {
    // config_to_return.webAppUrl = 'https://mayank-dot-plutus-web.appspot.com/#!/';
    // config_to_return.webAppUrl = 'http://localhost:3001/#!/';
    config_to_return.webAppUrl = window.location.origin + "/appl/web/view#!/";
  }

  config_to_return.isStaging = isStaging;

  if (partner_code === "bfdl") {
    partner_code = "bfdlmobile";
  }

  // Generating partnerData
  let partnerData = partnerConfigs[partner_code] || partnerConfigs["fisdom"];
  config_to_return = {
    ...config_to_return, // taking the base config of the productType(fisdom/finity)
    ...partnerData, // overriding with particular partner config
    styles: {
      ...baseStylesConfig.common,
      ...baseStylesConfig[productType], //taking common base styles config
      ...partnerData?.styles, // overriding with the partner styles
    },
    uiElements: {
      ...baseUIElementsConfig,
      ...partnerData?.uiElements,
    },
    typography: {
      ...baseTypographyConfig[productType],
      ...partnerData?.typography,
    }
  };

  let html = document.querySelector(`html`);
  html.style.setProperty(`--secondary`,`${config_to_return.styles.secondaryColor}`);
  html.style.setProperty(`--highlight`,`${config_to_return.styles.highlightColor}`);
  html.style.setProperty(`--skelton-color`, `${config_to_return.styles.skeletonColor}`);
  html.style.setProperty(`--primary`, `${config_to_return.styles.primaryColor}`);
  html.style.setProperty(`--header-background`, `${config_to_return?.uiElements?.header?.backgroundColor}`);
  html.style.setProperty(`--default`, `${config_to_return.styles.default}`);
  html.style.setProperty(`--label`, `${config_to_return.uiElements.formLabel.color}`);
  html.style.setProperty(`--desktop-width`, "640px");
  html.style.setProperty(`--tooltip-width`, "540px");
  html.style.setProperty("--color-action-disable", "#E8ECF1");
  html.style.setProperty('--dark', '#0A1D32');
  html.style.setProperty('--steelgrey', '#767E86');

  return config_to_return;
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

export const getPlatformConfig = () => {
  const config = {};
  if (isMobile.Android() && typeof window.Android !== 'undefined') {
    config.app = 'android';
    config.Android = true;
  } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
    config.app = 'ios';
    config.iOS = true;
  } else {
    if (storageService().get("is_secure")) {
      return;
    }
    config.app = 'web';
    config.Web = true;
  }

  return config;
}

export const getConfig = () => {
  let main_pathname = window.location.pathname;
  let main_query_params = getUrlParams();
  let { base_url="https://rewrite-iframe-dot-plutus-staging.appspot.com" } = main_query_params;
  let origin = window.location.origin;
  let generic_callback = true;

  let isProdFisdom = origin.indexOf('wv.fisdom.com') >= 0;
  let isProdFinity = origin.indexOf('wv.mywaywealth.com') >= 0;

  let base_href = window.sessionStorage.getItem('base_href') || '';
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

  let { is_secure = false } = main_query_params;
  let { from_notification } = main_query_params;
  let { sdk_capabilities } = main_query_params;
  let { partner_code } = main_query_params;
  let { app_version } = main_query_params;
  let { pc_urlsafe } = main_query_params;
  let project = '';
  let project_child = '';
  if (main_pathname.indexOf('group-insurance') >= 0) {
    project = 'group-insurance';
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
  } else if (main_pathname.indexOf('loan') >= 0) {
    project = 'loan';
  } else if (main_pathname.indexOf('w-report') >= 0) {
    project = 'w-report';
  } else if (main_pathname.indexOf('kyc-esign') >= 0) {
    project = 'kyc-esign';
  } else if (main_pathname.indexOf('pg') >= 0) {
    project = 'pg';
  } else if (main_pathname.indexOf('portfolio-rebalancing') >= 0) {
    project = 'portfolio-rebalancing';
  } else if (main_pathname.indexOf('iw-dashboard') >= 0) {
    project = 'iw-dashboard';
  }

  if(!partner_code) {
    partner_code = storageService().get("partner") || ""
  }

  if (is_secure === "true") storageService().set("is_secure", true);

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
  
  if (checkValidString(from_notification)) {
    returnConfig.from_notification = from_notification;
    searchParams += getParamsMark(searchParams) + `from_notification=${from_notification}`;
    searchParamsMustAppend +=  getParamsMark(searchParams) + `from_notification=${from_notification}`;
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
    let { insurance_id } = main_query_params;
    let { isJourney } = main_query_params;

    searchParams += getParamsMark(searchParams) + 'insurance_id=' + insurance_id;
    searchParamsMustAppend += getParamsMark(searchParams);

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

  const platformConfig = getPlatformConfig();
  if (platformConfig) {
    returnConfig = {
      ...returnConfig,
      ...platformConfig
    }
  }

  // eslint-disable-next-line
  returnConfig.html_camera = returnConfig.iOS || returnConfig.Web ? true : false;

  if (project === 'mandate-otm') {
    let { key } = main_query_params;
    let { name } = main_query_params;
    let { email } = main_query_params;
    let { html_camera } = main_query_params;
    searchParams += getParamsMark(searchParams) + 
      'key=' + key + '&name=' + name + '&email=' + email;

    // eslint-disable-next-line
    returnConfig.html_camera =
      (returnConfig.iOS || returnConfig.Web) ? true : html_camera;
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

  returnConfig.isSdk = storageService().get("is_secure");
  returnConfig.isWebOrSdk = returnConfig.Web || returnConfig.isSdk;
  returnConfig.isNative = !returnConfig.Web && !returnConfig.isSdk;
  returnConfig.isIframe = isIframe();
  returnConfig.platform = !returnConfig.isIframe ? (returnConfig.Web ? "web" : "sdk" ): "iframe";
  returnConfig.isLoggedIn = storageService().get("currentUser");
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
  const newIframeDesktopLayout = isNewIframeDesktopLayout();
  const config = getConfig();
  const headerClass = newIframeDesktopLayout ? 'IframeHeader' : 'Header';
  const containerClass = newIframeDesktopLayout ? 'iframeContainerWrapper' : config.isIframe && config.code === "bfdlmobile" ? 'bfdlContainerWrapper' : 'ContainerWrapper'
  let head =
    document.getElementsByClassName(headerClass) && document.getElementsByClassName(headerClass)[0]
      ? document.getElementsByClassName(headerClass)[0].offsetHeight
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
    document.getElementsByClassName(containerClass) &&
    document.getElementsByClassName(containerClass)[0]
      ? document.getElementsByClassName(containerClass)[0].offsetHeight
      : 0;
  let foot =
    document.getElementsByClassName('Footer') && document.getElementsByClassName('Footer')[0]
      ? document.getElementsByClassName('Footer')[0].offsetHeight
      : 0;

  const navbar =
      document.getElementsByClassName('NavBar') && document.getElementsByClassName('NavBar')[0]
        ? document.getElementsByClassName('NavBar')[0].offsetHeight
        : 0;

  let HeaderHeight = bannerHeight + stepHeight + head + 'px';
  const HeaderTop = head + navbar + 'px';
  if (data.header && document.getElementById('HeaderHeight')) {
    document.getElementById('HeaderHeight').style.height = HeaderHeight;
    document.getElementById('HeaderHeight').style.top = HeaderTop;
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

const { checkBeforeRedirection, checkAfterRedirection, backButtonHandler } = require(`./${getConfig().platform}_app`);

export function navigate(pathname, data = {}) {
  let fromState = this?.location?.pathname || ""
  let toState = pathname
  
  const redirectPath = checkBeforeRedirection(fromState, toState)
  if (redirectPath) {
    toState = redirectPath
  }

  data.state = {
    ...data?.state,
    fromState,
    toState
  }

  if (data.edit) {
    this.history.replace({
      pathname: pathname,
      search: data.searchParams || getConfig().searchParams,
      params: data.params || {},
      state: data.state || {},
    });
  } else {
    this.history.push({
      pathname: pathname,
      search: data.searchParams || getConfig().searchParams,
      params: data.params || {},
      state: data.state || {},
    });
  }
}

export function isNpsOutsideSdk(fromState, toState) {
  let config = getConfig();
  if (config?.landingconfig?.nps === 'inside_sdk') {
    return false;
  }

  if (fromState === "/nps/sdk" ||
    ((fromState.indexOf("/nps/amount") !== -1) && toState === "/nps/info") ||
    ((fromState.indexOf("/nps/payment/callback") !== -1) &&
      ((toState.indexOf("/nps/amount") !== -1) || toState === "/nps/investments" ||
        toState === "/nps/performance"))) {
    return true;
  }
}

export function listenPartnerEvents(cb) {
  window.addEventListener("message", function (e) {
    if (e.data !== "" && typeof e.data === "string") {
      /* Parse events */
      var data = JSON.parse(e.data);
      /* Match whitelisted domains */
      if (e.origin !== data.targetOrigin) {
        return;
      }

      /* Store event */
      // setEvent(data);
      /* return events to callback */
      cb(data);
    } else {
      // setEvent(e.data);
      cb(e.data);
    }
  });
}

export {
  checkBeforeRedirection, 
  checkAfterRedirection, 
  backButtonHandler
}

export const popupWindowCenter = (w, h, url) => {
  let dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  let dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;
  let left = window.screen.width / 2 - w / 2 + dualScreenLeft;
  let top = window.screen.height / 2 - h / 2 + dualScreenTop;
  return window.open(
    url,
    "_blank",
    "width=" +
      w +
      ",height=" +
      h +
      ",resizable,scrollbars,status,top=" +
      top +
      ",left=" +
      left
  );
}

export const isNewIframeDesktopLayout = () => {
  const config = getConfig();
  return config.code === "moneycontrol" && !config.isMobileDevice && config.isIframe
}