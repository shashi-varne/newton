/* -----------------------------------------------------------------*/
/*  Module: PlutusSdk
/*  Apis for sending/receiving `native` callbacks
/* -----------------------------------------------------------------*/
import { isMobile } from './functions';
import { getConfig } from './functions';
// eslint-disable-next-line
import { nativeCallback } from 'utils/native_callback'
(function (exports) {

  let next_generation = getConfig().next_generation;

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
    console.log("from android............");

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
    console.log(JSON.stringify(d));
    console.log(JSON.stringify(listeners));
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


  exports.upload_doc = function (data_json_str) {
    console.log("from android............");

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
    console.log(JSON.stringify(d));
    console.log(JSON.stringify(listeners));
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
      if (!next_generation) {
        window.Android.performAction('take_picture', listener.doc_type);
      } else {
        window.Android.callbackNative(JSON.stringify(callbackData));
      }
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
      if (!next_generation) {
        window.Android.performAction('open_picture_gallery', listener.doc_type);
      } else {
        window.Android.callbackNative(JSON.stringify(callbackData));
      }
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