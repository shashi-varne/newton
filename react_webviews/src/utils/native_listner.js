/* -----------------------------------------------------------------*/
/*  Module: PlutusSdk
/*  Apis for sending/receiving `native` callbacks
/* -----------------------------------------------------------------*/
import { isMobile } from './functions';
// eslint-disable-next-line
import { nativeCallback } from 'utils/native_callback'
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
  exports.upload_doc = function (data_json_str) {
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
    if (typeof window.Android !== 'undefined') {
      // nativeCallback({
      //   action: 'take_picture',
      //   args: 'otm'

      // })
      window.Android.performAction('take_picture', 'heloo');
    } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
      let callbackData = {};
      callbackData.action = 'open_camera';
      callbackData.data = listener.doc_type;
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    }
  }

  exports.open_gallery = function (listener) {
    listeners.push(listener);
    if (typeof window.Android !== 'undefined') {
      // nativeCallback({
      //   action: 'open_picture_gallery', message: {
      //     fileName: 'otm'
      //   }
      // })
      window.Android.performAction('open_picture_gallery', 'heloo');
      // window.Android.openGallery(listener.doc_type);
    } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
      let callbackData = {};
      callbackData.action = 'open_gallery';
      callbackData.data = listener.doc_type;
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

})(window.PlutusSdk ? window.PlutusSdk : (window.PlutusSdk = {}));