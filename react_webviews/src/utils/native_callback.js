import { isMobile } from './functions';
import { getConfig } from './functions';

export const nativeCallback = ({ action = null, message = null, events = null } = {}) => {
  let callbackData = {};



  console.log("Nativecallback..........(action, message, events)");
  console.log(action);
  console.log(JSON.stringify(message));
  console.log(JSON.stringify(events))


  let project = getConfig().project;

  if (project === 'mandate-otm') {


    let campaign_version = getConfig().campaign_version;

    if (campaign_version >= 1) {
      if (isMobile.Android()) {
        if (typeof window.Android !== 'undefined') {
          if (action === 'show_toast') {
            window.Android.performAction('show_toast', message.message);
            return;
          }

          if (action === 'open_in_browser') {
            window.Android.performAction('open_in_browser', message.url);
            return;
          }

          window.Android.performAction('close_webview', null);
          return;
        }
      }

      if (isMobile.iOS()) {
        if (typeof window.webkit !== 'undefined') {
          window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
        }
        return;
      }
    } else {
      let message = 'back', status_code = 200;
      let url = 'http://app.fisdom.com/#/page/invest/campaign/callback?name=mandate-otm&message=' +
        message + '&code=' + status_code + '&destination=';
      window.location.replace(url);
    }

    return;
  }

  let insurance_v2 = getConfig().insurance_v2;
  if (!insurance_v2 && project === 'insurance') {

    let notInInsuranceV2 = ['take_control', 'take_control_reset'];
    if (notInInsuranceV2.indexOf(action) !== -1) {
      return;
    }

    if (action === 'resume_provider') {
      action = 'resume_payment';
    }

    if (action === 'show_quotes') {
      action = 'native_back';
    }
  }

  if (action) {
    callbackData.action = action;
  }
  if (message) {
    callbackData.data = message;
  }
  if (events) {
    callbackData.events = events;
  }

  if (isMobile.Android()) {
    console.log("Android")
    if (typeof window.Android !== 'undefined') window.Android.callbackNative(JSON.stringify(callbackData));

  }

  if (isMobile.iOS()) {
    if (typeof window.webkit !== 'undefined') window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
  }
};
