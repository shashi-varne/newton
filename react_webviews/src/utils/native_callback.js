import { isMobile } from './functions';
import { getConfig } from './functions';
import { open_browser_web, renameObjectKeys } from 'utils/validators';
import Api from 'utils/api';

export const nativeCallback = async ({ action = null, message = null, events = null, action_path = null } = {}) => {
  let newAction = null;
  let callbackData = {};
  let project = getConfig().project;
  let redirect_url = getConfig().redirect_url;
  redirect_url = decodeURIComponent(redirect_url);

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
    if (redirect_url && redirect_url !== 'undefined' && (callbackData.action === 'exit_web' || callbackData.action === 'exit_module' || callbackData.action === 'open_module')) {
      window.location.href = redirect_url
    } else {
      if (getConfig().app === 'android') {
        window.Android.callbackNative(JSON.stringify(callbackData));
      }

      if (getConfig().app === 'ios') {
        window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
      }
    }
  } else {
    if (action === 'native_back' || action === 'exit_web' || action === 'exit' ||
      action === 'open_module') {
      if (!redirect_url) {
        redirect_url = getConfig().webAppUrl;
      }
      window.location.href = redirect_url;
    } else if (action === 'open_in_browser' || action === 'open_url') {
      open_browser_web(message.url, '_blank')
    } else if (action === 'resume_provider') {
      open_browser_web(message.resume_link, '_self')
    } else {
      return;
    }
  }
};


export function getWebUrlByPath(path) {
  if (!path) {
    path = '';
  }

  let web_url = getConfig().webAppUrl + path //can accept params with path also, below it handlled

  if (getConfig().webAppParams) {
    // eslint-disable-next-line
    web_url += (web_url.match(/[\?]/g) ? "&" : "?") + getConfig().webAppParams;
  }

  return web_url;
}

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

export function openModule(moduleName) {
  if (getConfig().isWebCode) {

    let module_mapper = {
      'app/portfolio': 'reports',
      'app/profile': 'my-account',
      'invest/save_tax': 'invest',
      'invest/nps': 'nps/info',
    }

    let moduleNameWeb = module_mapper[moduleName] || '';
    let module_url = getWebUrlByPath(moduleNameWeb);

    window.location.href = module_url;
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

  if (getConfig().isWebCode) {
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