/* -----------------------------------------------------------------*/
/*  Module: callbackWeb
/*  Apis for sending/receiving `native` callbacks
/* -----------------------------------------------------------------*/
import { isMobile } from './functions';
import { getConfig } from './functions';


let generic_callback = new URLSearchParams(getConfig().searchParams).get('generic_callback');
if (generic_callback === "true") {
  (function (exports) {

    function b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }

    exports.native_receiver_image = function (listener) {
      listeners.push(listener);
    }

    exports.upload_blob = function (data_json_str) {

      for (var j = 0; j < listeners.length; j++) {
        var lis = listeners[j];
        if (lis.type === 'native_receiver_image') {
          lis.show_loader(true);
          listeners.splice(j, 1);
          break;
        }
      }
      // native_receiver_image({ type: 'native_receiver_image' })
      var d
      if (typeof window.Android !== 'undefined') {
        d = JSON.parse(data_json_str);  // Handle Exception
      } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
        d = data_json_str;
      }
      for (var i = 0; i < listeners.length; i++) {
        var l = listeners[i];
        if (l.type === 'doc' && (l.doc_type === d.file_name || l.doc_type === d.doc_type)) {
          var file = b64toBlob(d.blobBase64, d.mime_type || d.file_type, '');
          l.upload(file);
          listeners.splice(i, 1);
          i--;
        }
      }
    }

    exports.open_camera = function (listener) {
      listeners.push(listener);
      let callbackData = {};
      callbackData.action = 'take_picture';
      callbackData.action_data = { file_name: listener.doc_type };
      if (typeof window.Android !== 'undefined') {
        window.Android.callbackNative(JSON.stringify(callbackData));
      } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
        window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
      }
    }

    exports.open_gallery = function (listener) {
      listeners.push(listener);
      let callbackData = {};
      callbackData.action = 'pick_picture';
      callbackData.action_data = { file_name: listener.doc_type };
      if (typeof window.Android !== 'undefined') {
        window.Android.callbackNative(JSON.stringify(callbackData));
      } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
        window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
      }
    }

    exports.open_file = function (listener) {
      listeners.push(listener);
      let callbackData = {};
      callbackData.action = 'get_blob';
      callbackData.action_data = { file_name: listener.doc_type, mime_types: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'image/bmp'] };
      if (typeof window.Android !== 'undefined') {
        window.Android.callbackNative(JSON.stringify(callbackData));
      } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
        window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
      }
    }

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

  })(window.callbackWeb ? window.callbackWeb : (window.callbackWeb = {}));
} else {
  (function (exports) {

    function b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }

    exports.native_receiver_image = function (listener) {
      listeners.push(listener);
    }

    exports.upload_doc = function (data_json_str) {
      for (var j = 0; j < listeners.length; j++) {
        var lis = listeners[j];
        if (lis.type === 'native_receiver_image') {
          lis.show_loader(true);
          listeners.splice(j, 1);
          break;
        }
      }
      // native_receiver_image({ type: 'native_receiver_image' })
      var d
      if (typeof window.Android !== 'undefined') {
        d = JSON.parse(data_json_str);  // Handle Exception
      } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
        d = data_json_str;
      }
      for (var i = 0; i < listeners.length; i++) {
        var l = listeners[i];
        if (l.type === 'doc' && l.doc_type === d.doc_type) {
          var file = b64toBlob(d.blobBase64, d.file_type, '');
          l.upload(file);
          listeners.splice(i, 1);
          i--;
        }
      }
    }
    exports.open_camera = function (listener) {
      listeners.push(listener);
      let callbackData = {};
      callbackData.action = 'take_picture';
      callbackData.action_data = { file_name: listener.doc_type };
      if (typeof window.Android !== 'undefined') {
        window.Android.performAction('take_picture', listener.doc_type);
      } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
        window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
      }
    }

    exports.open_gallery = function (listener) {
      listeners.push(listener);
      let callbackData = {};
      callbackData.action = 'pick_picture';
      callbackData.action_data = { file_name: listener.doc_type };
      if (typeof window.Android !== 'undefined') {
        window.Android.performAction('open_picture_gallery', listener.doc_type);
      } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
        window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
      }
    }

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

  })(window.PaymentCallback ? window.PaymentCallback : (window.PaymentCallback = {}));
}