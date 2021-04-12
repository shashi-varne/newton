/* -----------------------------------------------------------------*/
/*  Module: callbackWeb
/*  Apis for sending/receiving `native` callbacks
/* -----------------------------------------------------------------*/

(function (exports) {
  var listeners = [];

  exports.add_listener = function (listener) {
    listeners.push(listener);
  }

  exports.remove_listener = function (listener) {
    listeners = [];
  }

  exports.back_pressed = function () {
    for (var i = 0, j = listeners.length; i < j; i++) {
      var l = listeners[i];

      if (l.type === 'back_pressed') {
        l.go_back();
      }
    }
  }

  exports.post_error = function (data) {
  }

})(window.callbackWeb ? window.callbackWeb : (window.callbackWeb = {}));