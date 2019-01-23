import { isMobile } from './functions';

export const nativeCallback = ({ action = null, message = null, events = null } = {}) => {
  let callbackData = {};

  console.log(action);
  console.log(JSON.stringify(message));
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
