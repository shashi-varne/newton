// import colors from '../common/theme/Style.scss';
import { checkValidString, getUrlParams, storageService } from './validators';
import { isArray, isEmpty, isFunction } from 'lodash';
import $ from 'jquery';
import {  getPartnerData  } from './partnerConfigs';

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
    origin.indexOf('app.finity.in') >= 0 ||
    origin.indexOf('app.mywaywealth.com') >= 0 || 
    origin.indexOf('wv.mywaywealth.com') >= 0 || 
    origin.indexOf('wv.finity.in') >= 0 || 
    origin.indexOf('my.preprod.finity.in') >= 0 || 
    origin.indexOf('app2.finity.in') >= 0;
  const isminvest = search.indexOf('my.barodaminvest.com') >= 0;
  const isStaging = search.indexOf('staging') >= 0;
  let productType = 'fisdom';
  const finityPartners = ["bfdlmobile", "finity", "moneycontrol"]
  if (ismyway || finityPartners.includes(partner_code)) {
    productType = 'finity';
  }

  if (isminvest) {
    productType = "minvest";
  }

  // Generating partnerData
  const partnerData = getPartnerData(productType, partner_code); 
  let config_to_return = partnerData;

  if (isStaging) {
    // config_to_return.webAppUrl = 'https://mayank-dot-plutus-web.appspot.com/#!/';
    // config_to_return.webAppUrl = 'http://localhost:3001/#!/';
    config_to_return.webAppUrl = window.location.origin + "/appl/web/view#!/";
  }

  config_to_return.isStaging = isStaging;

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
  html.style.setProperty("--color-action-disable", `${config_to_return.uiElements.button.disabledBackgroundColor}`);
  html.style.setProperty('--dark', '#0A1D32');
  html.style.setProperty('--steelgrey', '#767E86');
  html.style.setProperty('--whitegrey', '#EEEEEE');
  html.style.setProperty('--on-focus-background', `${config_to_return.uiElements.button.focusBackgroundColor}`);
  html.style.setProperty('--on-hover-background', `${config_to_return.uiElements.button.hoverBackgroundColor || config_to_return.styles.secondaryColor}`);
  html.style.setProperty('--on-hover-secondary-background', `${config_to_return.uiElements.button.hoverSecondaryBackgroundColor || config_to_return.styles.secondaryColor}`);
  html.style.setProperty('--secondary-green', `${config_to_return.styles.secondaryGreen}`);
  html.style.setProperty(`--mustard`, '#FFDA2C');
  html.style.setProperty(`--pink`, '#F16FA0');
  html.style.setProperty(`--purple`, '#A38CEB');
  html.style.setProperty(`--lime`, '#7ED321');
  html.style.setProperty(`--red`, '#D0021B');
  html.style.setProperty(`--primaryVariant1`, `${config_to_return.styles.primaryVariant1}`);
  html.style.setProperty(`--primaryVariant2`, `${config_to_return.styles.primaryVariant2}`);
  html.style.setProperty(`--primaryVariant4`, `${config_to_return.styles.primaryVariant4}`);
  html.style.setProperty(`--primaryVariant5`, `${config_to_return.styles.primaryVariant5}`);
  html.style.setProperty(`--spacing`, '10px');
  html.style.setProperty(`--gunmetal`, '#161A2E');
  html.style.setProperty(`--darkBackground`, `${config_to_return.styles.darkBackground}`);
  html.style.setProperty(`--linkwater`, '#D3DBE4');
  html.style.setProperty(`--border-radius`, `${config_to_return.uiElements.button.borderRadius}px`);
  html.style.setProperty(`--whitegrey`, '#EEEEEE');

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
  let config = {
    Web: false, 
    Android: false,
    iOS: false
  };
  
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
  let { base_url = ""  } = main_query_params;
  let origin = window.location.origin;
  let generic_callback = true;

  let isProdFisdom = origin.indexOf('app.fisdom.com') >= 0  || origin.indexOf('wv.fisdom.com') >= 0 || 
        origin.indexOf('app2.fisdom.com') >= 0;

  let isProdMyway = origin.indexOf('app.mywaywealth.com') >= 0 || 
                origin.indexOf('wv.mywaywealth.com') >= 0;

  let isProdFinity = origin.indexOf('app.finity.in') >= 0 || 
             origin.indexOf('app2.finity.in') >= 0 || origin.indexOf('wv.finity.in') >= 0;
  let isPreprodFisdom = origin.indexOf('fisdom.equityapppreprod.finwizard.co.in') >= 0;
  let isPreprodFinity = origin.indexOf('finity.equityapppreprod.finwizard.co.in') >= 0;

  let apiKey = '6Ldah04eAAAAAM7-gR7PWL35nSMvNZRMsngMgObG';
  if(isProdFisdom) {
    apiKey = '6LcUeDweAAAAAJ7gWP6OkmCuO1WXN54Qju-fJPLg';
  }

  if(isProdFinity || isProdMyway) {
    apiKey = '6LdSjzweAAAAAHSGjqfOVjy_vVQ_n8iBWe9xCSrL';
  }

  let base_url_default = '';
  
  const isStaging = origin.indexOf('plutus-web-staging') >= 0;
  const isSDKStaging = origin.indexOf('sdk-dot-plutus-web.appspot.com') >= 0;
  const isIosSdkStaging = origin.indexOf('app.gaeuat.finwizard.co.in') >= 0;
  const isFisdomStaging = origin.indexOf('fisdom.equityappuat.finwizard.co.in') >= 0 || origin.indexOf('fisdomapp.staging.finwizard.co.in') >= 0;
  const isFinityStaging = origin.indexOf('finity.equityappuat.finwizard.co.in') >= 0 || origin.indexOf('finityapp.staging.finwizard.co.in') >= 0;
  const isLocal = origin.indexOf('localhost') >=0;

  // if(base_href) {
  //   base_url_default = window.location.origin;
  // }

  // default base url for commit id build
  if(main_pathname.includes('/appl/web/') || main_pathname.includes('/appl/webview/')) {
    base_url_default = window.location.origin;
  }

  if(!base_url) {
    if(isProdFisdom) {
      base_url_default = 'https://my.fisdom.com';
    }
  
    if(isProdFinity) {
      base_url_default = 'https://api.finity.in';
    }

    if(isProdMyway) {
      base_url_default = 'https://api.mywaywealth.com';
    }

    if(isPreprodFisdom) {
      base_url_default = 'https://fisdom.uat.finwizard.co.in';
    }

    if(isPreprodFinity) {
      base_url_default = 'https://finity.uat.finwizard.co.in';
    }

    // change server url here for local and staging url builds (Not commit id one's)
    if (isStaging || isLocal) {
      base_url_default = "https://mpin-dot-plutus-staging.appspot.com";
    }

    if (isSDKStaging) {
      base_url_default = "https://sdk-dot-plutus-staging.appspot.com";
    }

    if (isIosSdkStaging) {
      base_url_default = "https://my.gaeuat.finwizard.co.in";
    }

    if(isFisdomStaging) {
      base_url_default = 'https://fisdomapp.staging.finwizard.co.in';
    }
  
    if(isFinityStaging) {
      base_url_default = 'https://finityapp.staging.finwizard.co.in';
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
  let { diet = false } = main_query_params;
  let project = '';
  let project_child = '';
  if (main_pathname.indexOf('group-insurance') >= 0) {
    project = 'group-insurance';
    project_child = 'bhartiaxa';
    if (main_pathname.indexOf('term') >= 0) {
      project_child = 'term';
    }
  } else if (main_pathname.indexOf('fhc') >= 0) {
    project = 'fhc';
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
  } else if (main_pathname.indexOf('tax-filing') >= 0) {
    project = 'tax-filing';
  } else if (main_pathname.indexOf('kyc') >= 0) {
    project = 'kyc';
  } else if (main_pathname.indexOf('reports') >= 0) {
    project = 'reports';
  } else if (main_pathname.indexOf('withdraw') >= 0) {
    project = 'withdraw';
  } else if (main_pathname.indexOf('nps') >= 0) {
    project = 'nps';
  } else if (main_pathname.indexOf('diy') >= 0) {
    project = 'diy';
  } else if (main_pathname.indexOf('invest') >= 0) {
    project = 'invest';
  }

  if(!sdk_capabilities) {
    sdk_capabilities = storageService().get("sdk_capabilities") || "";
  }

  if(storageService().get("partner")) {
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
  
  if( main_pathname === '/webview/help-conversation' ) {
    const { ticket_id } = main_query_params;
    if (checkValidString(ticket_id)) {
      searchParams += getParamsMark(searchParams) + `ticket_id=${ticket_id}`;
      searchParamsMustAppend += getParamsMark(searchParams) + `ticket_id=${ticket_id}`;
    }
  }

  if(checkValidString(diet)) {
    returnConfig.diet = diet;
    searchParams += getParamsMark(searchParams) + `diet=${diet}`;
    searchParamsMustAppend +=  getParamsMark(searchParams) + `diet=${diet}`;
  }
  
  if( main_pathname === '/webview/help-conversation' ) {
    const { ticket_id } = main_query_params;
    if (checkValidString(ticket_id)) {
      searchParams += getParamsMark(searchParams) + `ticket_id=${ticket_id}`;
      searchParamsMustAppend += getParamsMark(searchParams) + `ticket_id=${ticket_id}`;
    }
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
  returnConfig.apiKey = apiKey;

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
  let isProdEnv = isProdFinity || isProdFisdom || isProdMyway;
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
  returnConfig.isProdEnv = isProdEnv

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
  const headerClass = 'Header';
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

export function stripTrailingSlash (str) {
  return str.endsWith('/') ? str.slice(0, -1) : str;
};

export function getBasePath() {
  var basename = window.localStorage.getItem('base_href') || '';
  if(basename && basename.indexOf('appl/web') !== -1) {
    basename = basename ? basename + 'view' : '';
  }
  return window.location.origin + stripTrailingSlash(basename);
}

export function isTradingEnabled(userKyc = {}) {
  const kyc = !isEmpty(userKyc) ? userKyc : storageService().getObject("kyc");
  const androidSdkVersionCode = storageService().get("android_sdk_version_code");
  const iosSdkVersionCode = storageService().get("ios_sdk_version_code");
  const config = getConfig();
  const equityEnabled = storageService().getBoolean('equityEnabled'); // Used to enable kyc equity flow from native/external side
  if (config.isNative) {
    return equityEnabled && kyc?.equity_enabled;
  }
  if(config.isSdk) {
    // eslint-disable-next-line
    return kyc?.equity_enabled && (parseInt(androidSdkVersionCode) >= 21 || parseInt(iosSdkVersionCode) >= 999)
  }
  return kyc?.equity_enabled;
}

export const isTradingFlow = (kyc) => {
  kyc = !isEmpty(kyc) ? kyc : storageService().getObject("kyc");
	return isTradingEnabled(kyc) && kyc?.kyc_product_type === "equity";
};

export const isIndbSdkTradingFlow = (kyc) => {
  kyc = !isEmpty(kyc) ? kyc : storageService().getObject("kyc");
  const config = getConfig();
	return isTradingEnabled(kyc) && config.isSdk && ["indb", "fisdom"].includes(config.code);
};

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

  if (fromState === "/nps" ||
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

export const base64ToBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export function openFilePicker (
  filePickerId,
  methodName,
  docName,
  nativeHandler,
  fileHandlerParams = {},
  onFilePicked
) {
  if (getConfig().Web) {
    const filepicker = document.getElementById(filePickerId);

    if (filepicker) {
      filepicker.value = null; // Required to allow same file to be picked again QA-4238 (https://stackoverflow.com/questions/12030686)
      filepicker.click();
    }
  } else {
    window.callbackWeb[methodName]({
      type: 'doc',
      doc_type: docName,
      upload: nativeHandler,
      ...fileHandlerParams // callback from native
    });

    if (isFunction(onFilePicked)) {
      // This callback is triggered once a user selects a file
      window.callbackWeb.add_listener({
        type: "native_receiver_image",
        show_loader: function () {
          onFilePicked();
        },
      });
    }
  }
}

export function validateFileTypeAndSize (file, supportedTypes, sizeLimit) {
  const fileType = file.type.split("/")[1];
  const sizeInBytes = sizeLimit * 1000 * 1000;

  if (!isArray(supportedTypes)) {
    supportedTypes = [supportedTypes];
  }

  if (!supportedTypes.includes(fileType)) {
    return "File type not supported";
  } else if (file.size > sizeInBytes) {
    return `File size cannot exceed ${sizeLimit}MB`;
  }

  return "";
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

export const getInvestCards = (keysToCheck=[]) => {
  const config = getConfig();
  const investSections = config.investSections || [];
  const investSubSectionMap = config.investSubSectionMap;
  const cardsToShow = {};
  investSections.forEach(section => {
    if(!isEmpty(investSubSectionMap[section])) {
      investSubSectionMap[section].forEach(subSections => {
        if (keysToCheck.includes(subSections)) {
          cardsToShow[subSections] = true;
        }
      })
    }
  })
  return cardsToShow;
}

export function stringToHexa(str) {
  const arr1 = []
  for (let i = 0; i < str.length; ++i) {
    const hex = Number(str.charCodeAt(i)).toString(16)
    arr1.push(hex)
  }
  return arr1.join('')
}

export const getCssVarObject = () => {
  const config = getConfig();
  const cssVarObj = {
    '--secondary': config.styles.secondaryColor,
    '--highlight': config.styles.highlightColor,
    '--skelton-color':  config.styles.skeletonColor,
    '--primary':  config.styles.primaryColor,
    '--header-background':  config?.uiElements?.header?.backgroundColor,
    '--default':  config.styles.default,
    '--label':  config.uiElements.formLabel.color,
    '--desktop-width':  "640px",
    '--tooltip-width':  "540px",
    '--color-action-disable':  config.uiElements.button.disabledBackgroundColor,
    '--dark':  '#0A1D32',
    '--steelgrey':  '#767E86',
    '--on-focus-background':  config.uiElements.button.focusBackgroundColor,
    '--on-hover-background':  config.uiElements.button.hoverBackgroundColor || config.styles.secondaryColor,
    '--on-hover-secondary-background':  config.uiElements.button.hoverSecondaryBackgroundColor || config.styles.secondaryColor,
    '--secondary-green':  config.styles.secondaryGreen,
    '--mustard':  '#FFDA2C',
    '--pink':  '#F16FA0',
    '--purple':  '#A38CEB',
    '--lime':  '#7ED321',
    '--red':  '#D0021B',
    '--primaryVariant1':  config.styles.primaryVariant1,
    '--primaryVariant4':  config.styles.primaryVariant4,
    '--spacing':  '10px',
    '--gunmetal':  '#161A2E',
    '--linkwater':  '#D3DBE4',
    '--border-radius':  `${config.uiElements.button.borderRadius}px`
  }
  return cssVarObj;
}
export function isAuthenticatedUser(props) {
  const fromState = props.location?.state?.fromState || "";
  const navigation = navigate.bind(props);
  const data = {
    state: {
      goBack: "/"
    }
  }
  if (getConfig().isLoggedIn) {
    if (!fromState || isUnAuthenticatedPath(fromState)) {
      navigation("/", data)
    } else {
      navigation(fromState, data);
    }
    return true;
  }
}

export function isUnAuthenticatedPath(path) {
  const unAuthenticatedPaths = ["/login", "/register", "/forgot-password", "/mobile/verify", "/logout", "/prepare"];
  const unAuthenticatedPathsWithParams = ["/partner-authentication"];
  const pathname = unAuthenticatedPathsWithParams.find(el => path.match(el))
  return unAuthenticatedPaths.includes(path) || !isEmpty(pathname); 
}

export function getGuestUserRoute(apiUrl){
  var guest_id = storageService().get('guestLeadId') || getUrlParams().guestLeadId;
  
  if(guest_id){ // true only for RM/guest journey
      var url_char = apiUrl.indexOf('?') >= 0 ? '&' : '?';
      return apiUrl + `${url_char}guest_lead_id=${guest_id}`
  }
  return apiUrl
}

export function requireAsset(assetName, partner, extension = 'svg') {
  try {
    return require(`assets/${partner ? (partner + '/' + assetName) : assetName}.${extension}`);
  } catch (err) {
    try {
      return require(`assets/${assetName}`);
    } catch (err) {
      console.log('Could not find the asset you are looking for!', err);
    }
  }
}

export function isDietProduct() {
  const {diet = ''} = getUrlParams();
  return diet.toLowerCase() === 'true';
}

export const loadClevertapScript = () => {
  let clevertap = {
    event: [],
    profile: [],
    account: [],
    onUserLogin: [],
    notifications: [],
    privacy: []
  };
  const config  = getConfig()
  const productName = config.productName;
  const isProd = config.isProdEnv;
  if (isProd) {
    if (productName === 'finity') {
      clevertap.account.push({ id: "R78-KRW-KK5Z" });
    } else {
      clevertap.account.push({ id: "R74-Z4W-R74Z" });
    }
  } else {
    clevertap.account.push({ id: "TEST-K7R-49R-W74Z" });
  }
  clevertap.privacy.push({ optOut: false }); //set the flag to true, if the user of the device opts out of sharing their data
  clevertap.privacy.push({ useIP: false }); //set the flag to true, if the user agrees to share their IP data
  window.clevertap = clevertap;
  let wzrk = document.createElement("script");
  wzrk.type = "text/javascript";
  wzrk.id="clevertap-id";
  wzrk.src =
    ("https:" === document.location.protocol
      ? "https://d2r1yp2w7bby2u.cloudfront.net"
      : "http://static.clevertap.com") + "/js/a.js";
  const s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(wzrk, s);
}

export const initializeClevertapProfile = (user) => {
  try {
    if (!isEmpty(user) && window.clevertap) {
      const payload = {
        Site: {
          Name: user.name,
          Identity: user.user_id,
          Email: user.email,
          "MSG-email": true,
          "MSG-push": true,
          "MSG-sms": true
        }
      };
      window.clevertap.profile = [...window.clevertap.profile, payload];
    }
  } catch (e) {
    console.log(e);
  }
}