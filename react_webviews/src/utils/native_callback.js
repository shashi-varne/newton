import { isMobile, navigate as navigateFunc } from './functions';
import { getConfig, getBasePath } from './functions';
import { open_browser_web, renameObjectKeys } from 'utils/validators';
import Api from 'utils/api';
import { storageService } from './validators';

export const nativeCallback = async ({ action = null, message = null, events = null, action_path = null } = {}) => {
  let newAction = null;
  let callbackData = {};
  let project = getConfig().project;

  let oldToNewMethodsMapper = {
    'open_pdf': 'open_url',
    'take_control_reset_hard': 'reset_back_button_control',
    'take_control_reset': 'reset_back_button_control',
    'take_control': 'take_back_button_control',
    'open_in_browser': 'open_browser',
    'exit': project === 'insurance' ? 'exit_module' : 'exit_web',
    'native_back': project === 'insurance' ? 'exit_module' : 'exit_web',
    'native_reset': 'restart_module',
    'events': 'event',
    'resume_provider': 'resume_payment',
    'show_quotes': 'native_back',
    'exit_web_sdk': 'exit_web'
  }

  if (!action && !events) {
    return;
  }
  
  if (action) {
    newAction = oldToNewMethodsMapper[action];
    callbackData.action = newAction || action;
  }

  if(events && events.properties) {
    console.log(events.properties);
  }

  if (action === 'native_back' || action === 'exit') {
    if (getConfig().isNative) callbackData.action = 'exit_web';
    else window.location.href = redirectToLanding();
  }

  if (action === 'open_pdf') {
    if (getConfig().Android) {
      message.url = "https://docs.google.com/gview?embedded=true&url=" + message.url;
    }
  }

  if (action === 'open_inapp_tab') {
    if (getConfig().Web) {
      open_browser_web(message.url, '')
    } else {
      let url = 'https://fis.do/m/module?action_type=native';
      if (getConfig().productName === 'finity') {
        url = 'https://w-ay.in/m/module?action_type=native';
      }

      url += '&native_module=' + encodeURIComponent('app/open_inapp_tab');
      url += '&url=' + encodeURIComponent(message.url);

      if(message.back_url) {
        url += '&back_redirection_url=' + message.back_url;
      }

      nativeCallback({
        action: 'open_module', message: {
          action_url: url
        }
      });

      return;
    }
  }

  if (getConfig().generic_callback) {
    if (action === 'take_control_reset_hard' || action === 'take_control_reset') {
      nativeCallback({ action: 'hide_top_bar' });
    }

    if (action === 'take_control') {
      let keysMap = {
        'back_url': 'url',
        'show_top_bar': 'show_back_top_bar',
        'top_bar_title': 'title',
        'back_text': 'message'
      };
      message = renameObjectKeys(message, keysMap);
    }

    if (action === 'resume_provider') {
      nativeCallback({ action: 'show_top_bar', message: { title: message.provider } });
      callbackData.action = 'open_url';
      message = {
        url: message.resume_link
      }
    }

    if (message) {
      callbackData.action_data = message;
    }
    if (events) {
      callbackData.event = events;
    }

  } else {

    if (events) {
      callbackData.events = events;
    }
    if (message) {
      callbackData.data = message;
    }

    if (['mandate-otm', 'isip', 'w-report', 'iw-dashboard'].includes(project)) {

      // For only events, if actions is present, then proceed to next block
      if (events) {
        // clevertap api

        // Do not send any other keys apart from event object to eventCallback
        // if (isMobile.Android()) {
        //   if (typeof window.Android !== 'undefined') window.Android.eventCallback(JSON.stringify(events));
        // }

        try {
          await Api.post('/api/clevertap/events', events);
        } catch (error) {
          console.log(error);
        }


        // if (isMobile.iOS()) {
        //   if (typeof window.webkit !== 'undefined') window.webkit.messageHandlers.callbackNative.postMessage(events);
        // }
      }

      if (!action) {
        return;
      }

      if (isMobile.Android() && action) {
        if (typeof window.Android !== 'undefined') {
          if (action === 'show_toast' || action === 'open_in_browser') {
            window.Android.callbackNative(JSON.stringify(callbackData));
            return;
          }
        }
      }

      if (isMobile.iOS() && action) {
        if (typeof window.webkit !== 'undefined') {
          window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
        }
        return;
      }

      return;
    }

    if ( project === 'insurance') {
      let notInInsuranceV2 = ['take_control', 'take_control_reset'];
      if (notInInsuranceV2.indexOf(action) !== -1) {
        return;
      }
    }
  }

  if (getConfig().app !== 'web') {
    let pathname = window.location?.pathname || ""
    if(pathname.indexOf('appl/webview') !== -1) {
      pathname = pathname.split("/")[5] || "/";
    }
    
    if (getConfig().isSdk && pathname !== "/" && (callbackData.action === 'exit_web' || callbackData.action === 'exit_module' || callbackData.action === 'open_module')) {
      window.location.href = redirectToLanding();
    } else {
      if (getConfig().app === 'android') {
        window.Android.callbackNative(JSON.stringify(callbackData));
      }

      if (getConfig().app === 'ios') {
        window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
      }
    }
  } else {
    if (action === 'open_in_browser' || action === 'open_url') {
      open_browser_web(message.url, '_blank')
    } else if (action === 'resume_provider') {
      open_browser_web(message.resume_link, '_self')
    } else {
      return;
    }
  }
};


export function openNativeModule(moduleName) {
  let url = 'https://fis.do/m/module?action_type=native';
  if (getConfig().productName === 'finity') {
    url = 'https://w-ay.in/m/module?action_type=native';
  }

  url += '&native_module=' + encodeURIComponent(moduleName);
  nativeCallback({
    action: 'open_module', message: {
      action_url: url
    }
  });
}

export function openModule(moduleName, props) {

  if (getConfig().isWebOrSdk) {

    let module_mapper = {
      'app/portfolio': '/reports',
      'app/profile': '/my-account',
      'invest/save_tax': '/invest',
      'invest/nps': '/nps/info',
    }
    
    let moduleNameWeb = module_mapper[moduleName] || '/';
    if(props) {
      const navigate = navigateFunc.bind(props);
      navigate(moduleNameWeb)
    } else {
      let module_url = `${getBasePath()}${moduleNameWeb}${getConfig().searchParams}`;
      window.location.href = module_url;
    }

  } else {
    openNativeModule(moduleName);
  }
}

export function openPdfCall(data = {}) {
  let url = data.url || '';
  if (!url) {
    return;
  }

  let current_url = window.location.href;

  if (!data.back_url) {
    data.back_url = current_url;
  }

  if (getConfig().isWebOrSdk) {
      nativeCallback({
          action: 'open_in_browser',
          message: {
              url: url
          }
      });
  } else {

    nativeCallback({
      action: 'take_control', message: {
        back_url: data.back_url,
        show_top_bar: false
      },

    });

    nativeCallback({
      action: 'show_top_bar', message: {
        title: data.header_title, icon: data.icon || 'close'
      }
    });

    nativeCallback({ action: 'open_pdf', message: { url: url } });
  }

}

export function redirectToLanding() {
  return `${getBasePath()}/${getConfig().searchParams}`;
}

export function handleNativeExit(props, data) {
  const config = getConfig();
  const navigate = navigateFunc.bind(props);
  const nativeExitActions = ["native_back", "exit"];
  const sdkExitActions = ["exit_web", "exit_module", "open_module"];
  if (
    (nativeExitActions.includes(data.action) && !config.isNative) ||
    (config.isSdk &&
      props.location?.pathname !== "/" &&
      sdkExitActions.includes(data.action))
  ) {
    if(storageService().get("flow-type") === "notification") {
      storageService().remove("flow-type");
      navigate("/notification", {
        searchParams: `base_url=${config.base_url}`
      });
    } else {
      navigate("/", {
        searchParams: `base_url=${config.base_url}`
      });
    }
  } else {
    nativeCallback(data);
  }
}