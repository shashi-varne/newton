/* -----------------------------------------------------------------*/
/*  Module: callbackWeb
/*  Apis for sending/receiving `native` callbacks
/* -----------------------------------------------------------------*/
import { getConfig } from './functions';


let generic_callback = new URLSearchParams(getConfig().searchParams).get('generic_callback');
if (generic_callback === "true") {
  (function (exports) {
    var listeners = [];

    exports.add_listener = function (listener) {
      listeners.push(listener);
    }

    exports.remove_listener = function (listener) {
      listeners = [];
    }

    exports.back_pressed = function () {
      console.log('callbackWeb ----')
      for (var i = 0, j = listeners.length; i < j; i++) {
        var l = listeners[i];

        if (l.type === 'back_pressed') {
          l.go_back();
        }
      }
    }

  })(window.callbackWeb ? window.callbackWeb : (window.callbackWeb = {}));
} else {
  (function (exports) {
    var listeners = [];

    exports.add_listener = function (listener) {
      listeners.push(listener);
    }

    exports.remove_listener = function (listener) {
      listeners = [];
    }

    exports.back_pressed = function () {
      console.log('PlutusSdk ----')
      for (var i = 0, j = listeners.length; i < j; i++) {
        var l = listeners[i];

        if (l.type === 'back_pressed') {
          l.go_back();
        }
      }
    }

  })(window.PlutusSdk ? window.PlutusSdk : (window.PlutusSdk = {}));
}