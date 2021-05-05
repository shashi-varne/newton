/* -----------------------------------------------------------------*/
/*  Module: callbackWeb
/*  Apis for sending/receiving `native` callbacks
/* -----------------------------------------------------------------*/
import { isMobile } from './functions';
import { getConfig } from './functions';

(function (exports) {

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  exports.native_receiver_image = function (listener) {
    listeners.push(listener);
  }

  exports.upload_blob = function (data_json_str) {

    for (let j = 0; j < listeners.length; j++) {
      let lis = listeners[j];
      if (lis.type === 'native_receiver_image') {
        lis.show_loader(true);
        listeners.splice(j, 1);
        break;
      }
    }
    // native_receiver_image({ type: 'native_receiver_image' })
    let d
    if (typeof window.Android !== 'undefined') {
      d = JSON.parse(data_json_str);  // Handle Exception
    } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
      d = data_json_str;
    }
    for (let i = 0; i < listeners.length; i++) {
      let l = listeners[i];
      if (l.type === 'doc' && (l.doc_type === d.file_name || l.doc_type === d.doc_type)) {
        let file = b64toBlob(d.blobBase64, d.mime_type || d.file_type, '');
        file.file_name = d.file_name_local;
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

  exports.open_video_camera = function (listener) {
    listeners.push(listener);
    let callbackData = {};
    callbackData.action = "take_video";
    callbackData.action_data = { file_name: listener.doc_type, message: listener.message, otp: listener.ipv_code };
    if (typeof window.Android !== "undefined") {
      window.Android.callbackNative(JSON.stringify(callbackData));
    } else if (isMobile.iOS() && typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    }
  };

  let listeners = [];

  exports.add_listener = function (listener) {
    listeners.push(listener);
  }

  exports.remove_listener = function (listener) {
    listeners = [];
  }

  exports.back_pressed = function () {
    for (let i = 0, j = listeners.length; i < j; i++) {
      let l = listeners[i];

      if (l.type === 'back_pressed') {
        l.go_back();
      }
    }
  }

  exports.get_device_data = function (listener) {
    console.log("get device data")
    listeners.push(listener);
    let callbackData = {};
    callbackData.action = 'get_device_data';
    if (typeof window.Android !== 'undefined') {
      console.log("android")
      window.Android.callbackNative(JSON.stringify(callbackData));
    } else if (isMobile.iOS() && typeof window.webkit !== 'undefined') {
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    } else {
      navigator.permissions.query({
        name: 'geolocation'
      }).then(function(result) {
          navigator.geolocation.getCurrentPosition(position => {
            let data = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              location_permission_denied: false
            }
            window.callbackWeb.send_device_data(data);
          })
  
          if (result.state === 'denied') {
            let data = {
              location_permission_denied: true
            }
            window.callbackWeb.send_device_data(data);
          }
  
          result.onchange = function() {
            if (result.state === 'denied') {
              let data = {
                location_permission_denied: true
              }
              window.callbackWeb.send_device_data(data);
            }
          }
      })
    }

    // for testing added
    // if(getConfig().Web) {
    //   window.callbackWeb.send_device_data();
    // }

  }

  exports.send_device_data = function (data_json_str) {
    let json_data = {};

    if(getConfig().Web) {
      json_data = {
        'location': {
          lat: data_json_str.latitude || '',
          lng: data_json_str.longitude || ''
        },
        'location_permission_denied': data_json_str.location_permission_denied,
        nsp: "ABC",
        device_id: "0000000000000000"
      }
    } else {
      if (data_json_str !== "" && typeof data_json_str === "string") {
        json_data = JSON.parse(data_json_str);
      } else {
        json_data = data_json_str;
      }
    }

    for (let j = 0; j < listeners.length; j++) {
      let lis = listeners[j];
      if (lis.type === 'location_nsp_received') {
        lis.location_nsp_received(json_data);
        break;
      }
    }
  }
})(window.callbackWeb ? window.callbackWeb : (window.callbackWeb = {}));