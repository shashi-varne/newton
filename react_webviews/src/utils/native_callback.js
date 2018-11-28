import { isMobile } from './functions';

export const nativeCallback = ({ action = null, message = null, events = null } = {}) => {
  let callbackData = {};
  console.log("native call back");
  console.log(action);
  console.log(message);
  console.log(events);
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
    console.log("ios");
    if (typeof window.webkit !== 'undefined') window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
  }
};
