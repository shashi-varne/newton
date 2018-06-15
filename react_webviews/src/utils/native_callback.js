import { isMobile } from './functions';

export const nativeCallback = ({ action = null, message = null, events = null } = {}) => {
  let callbackData = {};

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
    window.Android.callbackNative(JSON.stringify(callbackData));
  }

  if (isMobile.iOS()) {
    window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
  }
};
