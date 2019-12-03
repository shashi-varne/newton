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
  window.location.replace(url);
};


export const nativeCallback = async ({ action = null, message = null, events = null } = {}) => {
  let callbackData = {};
  let project = getConfig().project;
  let redirect_url = new URLSearchParams(getConfig().searchParams).get('redirect_url');
  if (action) {
    callbackData.action = action;
  }
  if (!action && !events) {
    return;
  }

  if (getConfig().generic_callback) {
    if (action === 'take_control_reset_hard' || action === 'take_control_reset') {
      callbackData.action = 'reset_back_button_control';
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

    if (action === 'events') {
      callbackData.action = 'event';
    }

    if (project === 'insurance') {
      if (action === 'resume_provider') {
        nativeCallback({ action: 'show_top_bar', message: { title: message.provider } });
        callbackData.action = 'open_url';
        message = {
          url: message.resume_link
        }
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

  if (getConfig().app !== 'web') {
    if (redirect_url && redirect_url !== 'undefined' && (callbackData.action === 'exit_web' || callbackData.action === 'exit_module')) {
      window.location.href = redirect_url
    } else {
      if (action === 'exit_web_sdk') {
        callbackData.action = 'exit_web';
      }

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
        redirect_url = "https://app.fisdom.com/"
      }
      window.location.href = redirect_url;
    } else if (action === 'open_in_browser') {
      open_browser_web(message.url, '_blank')
    } else {
      return;
    }
  }

};
