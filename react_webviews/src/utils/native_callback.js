import { isMobile } from './functions';
import { getConfig } from './functions';
import { open_browser_web, renameObjectKeys } from 'utils/validators';
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
  let project = getConfig().project;

  console.log("Nativecallback..........(action, message, events)");
  console.log(action);
  console.log(JSON.stringify(message));
  console.log(JSON.stringify(events))
  if (action) {
    callbackData.action = action;
  }
  if (events) {
    callbackData.events = events;
  }
  if (!action && !events) {
    return;
  }

  let generic_callback = new URLSearchParams(getConfig().searchParams).get('generic_callback');
  generic_callback = "true";
  if (generic_callback === "true") {
    if (action === 'take_control_reset_hard' || action === 'take_control_reset') {
      callbackData.action = 'reset_back_button_control';
    }

    if (action === 'take_control') {
      let keysMap = {
        'back_url': 'url',
        'show_top_bar': 'show_back_top_bar',
        'top_bar_title': 'title',
        'back_text': 'message'
      };
      message = renameObjectKeys(message, keysMap);
      callbackData.action = 'take_back_button_control';
    }
    if (action === 'open_in_browser') {
      callbackData.action = 'open_browser';
    }

    if (action === 'exit' || action === 'native_back') {
      callbackData.action = project === 'insurance' ? 'exit_module' : 'exit_web';
    }

    if (action === 'native_reset') {
      callbackData.action = 'restart_module';
    }

    if (project === 'insurance') {
      if (action === 'resume_provider') {
        action = 'open_url';
        message = {
          url: message.resume_link
        }
      }
    }

    if (message) {
      callbackData.action_data = message;
    }
  } else {
    if (message) {
      callbackData.data = message;
    }

    if (project === 'mandate-otm' || project === 'isip') {

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

      let campaign_version = getConfig().campaign_version;

      console.log("campaign_version...................." + campaign_version);
      if (campaign_version >= 1) {
        if (isMobile.Android() && action) {
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

            // window.Android.performAction('close_webview', null);
            // return;
          }
        }

        if (isMobile.iOS() && action) {
          if (typeof window.webkit !== 'undefined') {
            window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
          }
          return;
        }
      } else {
        if (action === 'show_toast' || action === 'open_in_browser') {
          return;
        }

        if (action) {
          nativeCallbackOld(200)
        }
      }

      return;
    }

    let insurance_v2 = getConfig().insurance_v2;
    console.log('insurance_v2 :' + insurance_v2);
    if (!insurance_v2 && project === 'insurance') {

      let notInInsuranceV2 = ['take_control', 'take_control_reset'];
      if (notInInsuranceV2.indexOf(action) !== -1) {
        return;
      }

      if (action === 'take_control_reset_hard') {
        callbackData.action = 'take_control_reset';
      }

      if (action === 'resume_provider') {
        callbackData.action = 'resume_payment';
      }

      if (action === 'show_quotes') {
        callbackData.action = 'native_back';
      }
    }
  }

  if (getConfig().app === 'android') {
    console.log("Android Device")
    window.Android.callbackNative(JSON.stringify(callbackData));

  } else if (getConfig().app === 'ios') {
    console.log("iOS Device")
    window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
  } else {
    if (action === 'native_back' || action === 'exit_web') {
      let redirect_url = getConfig().searchParams;
      redirect_url = new URLSearchParams(redirect_url).get('redirect_url');
      window.location.href = redirect_url;
    } else if (action === 'open_in_browser') {

      open_browser_web(message.url, '_blank')
    } else {
      return;
    }
  }

};
