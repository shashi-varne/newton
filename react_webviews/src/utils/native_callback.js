import { isMobile } from './functions';
import { getConfig } from './functions';

export const nativeCallback = ({ action = null, message = null, events = null } = {}) => {
  let callbackData = {};

  console.log("Nativecallback..........(action, message, events)");
  console.log(action);
  console.log(JSON.stringify(message));
  console.log(JSON.stringify(events))


  let project = getConfig().project;
  let insurance_v2 = getConfig().insurance_v2;
  console.log('insurance_v2 :' + insurance_v2);
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
    if (typeof window.Android !== 'undefined') window.Android.callbackNative(JSON.stringify(callbackData));
  }

  if (isMobile.iOS()) {
    if (typeof window.webkit !== 'undefined') window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
  }
};
