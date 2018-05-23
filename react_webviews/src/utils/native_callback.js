export const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i),
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
  iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  Opera: () => navigator.userAgent.match(/Opera Mini/i),
  Windows: () => navigator.userAgent.match(/IEMobile/i),
  any: () => (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()),
};

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
