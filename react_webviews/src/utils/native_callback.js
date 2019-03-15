import { isMobile } from './functions';
import { getConfig } from './functions';
import Api from 'utils/api';

export const nativeCallbackOld = (status_code, message, action) => {
  if (!message) {
    message = null;
  }
  if (!status_code) {
    status_code = 200;
  }
  let url = 'http://app.fisdom.com/page/invest/campaign/callback?name=mandate-otm&message=' +
    message + '&code=' + status_code + '&destination=' + null;
  console.log('status_code ' + status_code);
  console.log(url);
  window.location.replace(url);
};


export const nativeCallback = async ({ action = null, message = null, events = null } = {}) => {
  let callbackData = {};



  console.log("Nativecallback..........(action, message, events)");
  console.log(action);
  console.log(JSON.stringify(message));
  console.log(JSON.stringify(events))
  if (action) {
    callbackData.action = action;
  }
  if (message) {
    callbackData.data = message;
  }
  if (events) {
    callbackData.events = events;
  }

  if (!action && !events) {
    return;
  }

  let project = getConfig().project;

  if (project === 'mandate-otm') {

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

      return;
    }

    let campaign_version = getConfig().campaign_version;

    console.log("campaign_version...................." + campaign_version);
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

          if (action === 'native_back') {
            nativeCallbackOld(400);
            return;
          }

          if (action === 'exit') {
            nativeCallbackOld(200);
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
      if (action === 'show_toast' || action === 'open_in_browser') {
        return;
      }

      nativeCallbackOld(200)
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



  if (isMobile.Android()) {
    console.log("Android")
    if (typeof window.Android !== 'undefined') window.Android.callbackNative(JSON.stringify(callbackData));

  }

  if (isMobile.iOS()) {
    if (typeof window.webkit !== 'undefined') window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
  }
};
