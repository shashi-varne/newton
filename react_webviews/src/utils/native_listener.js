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

  exports.login_required = function () {
    var callbackData = {};
    callbackData.action = "login";
    if (typeof window.Android !== "undefined") {
      window.Android.callbackNative(JSON.stringify(callbackData));
    } else if (isMobile.iOS() && typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    }
  };

  exports.open_canvas = function (listener) {
    listeners.push(listener);
    var callbackData = {};
    callbackData.action = "open_canvas";
    callbackData.action_data = { file_name: listener.doc_type };
    if (typeof window.Android !== "undefined") {
      window.Android.callbackNative(JSON.stringify(callbackData));
    } else if (isMobile.iOS() && typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    }
  };

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


  exports.get_partner_code = function () {
    var callbackData = {};
    callbackData.action = "get_partner_code";
    if (typeof window.Android !== "undefined") {
      window.Android.callbackNative(JSON.stringify(callbackData));
    } else if (isMobile.iOS() && typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    }
  };

  exports.set_partner_code = function (data) {
    document.body.setAttribute("id", data);
    document.getElementById("logo").src = "assets/img/" + data + ".png";
  };

  exports.post_error = function (data) {
    console.log("action_name -" + data.err_action_name);
    console.log("error -" + data.err_message);
  };

  exports.make_bank_payment = function (data) {
    var callbackData = {};
    callbackData.action = "make_bank_payment";
    callbackData.action_data = data;
    if (typeof window.Android !== "undefined") {
      window.Android.callbackNative(JSON.stringify(callbackData));
    } else if (isMobile.iOS() && typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    }
  };

  exports.show_top_bar = function (data) {
    var callbackData = {};
    callbackData.action = "show_top_bar";
    if (data) {
      callbackData.action_data = data;
    }
    if (typeof window.Android !== "undefined") {
      window.Android.callbackNative(JSON.stringify(callbackData));
    } else if (isMobile.iOS() && typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    }
  };

  exports.hide_top_bar = function () {
    var callbackData = {};
    callbackData.action = "hide_top_bar";
    if (typeof window.Android !== "undefined") {
      window.Android.callbackNative(JSON.stringify(callbackData));
    } else if (isMobile.iOS() && typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    }
  };

  exports.open_browser = function (data) {
    var callbackData = {};
    callbackData.action = "open_browser";
    callbackData.action_data = data;
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

  function set_session_storage(key, value) {
    value = JSON.stringify(value);
    window.sessionStorage.setItem(key, value);
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

  exports.sendEvent = function (message) {
    window.parent.postMessage(message, "*");
  };
  
  exports.eventCallback = function (data) {
    // events for partner uses
    var callbackData = {};
    callbackData.action = "event_callback";
    callbackData.action_data = data;
    if (typeof window.Android !== "undefined") {
      window.Android.callbackNative(JSON.stringify(callbackData));
    } else if (isMobile.iOS() && typeof window.webkit !== "undefined") {
      window.webkit.messageHandlers.callbackNative.postMessage(callbackData);
    }
  };
  exports.return_data = function (data_json_str) {
    var json_data = {};
    if (data_json_str !== "" && typeof data_json_str === "string") {
      json_data = JSON.parse(data_json_str);
    } else {
      json_data = data_json_str;
    }
    set_session_storage("currentUser", true);
    set_session_storage('is_secure', true);
    set_session_storage("dataSettedInsideBoot", true);

    if (json_data.partner) {
      if (json_data.partner === "bfdl") {
        set_session_storage("partner", "bfdlmobile");
      } else if (json_data.partner === "obcweb") {
        set_session_storage("partner", "obc");
      } else {
        set_session_storage("partner", json_data.partner);
      }
    }

    if (json_data.sdk_capabilities) {
      set_session_storage("sdk_capabilities", json_data.sdk_capabilities);
    }

    if (json_data.user_data) {
      set_session_storage("user", json_data.user_data.user);
      set_session_storage("kyc", json_data.user_data.kyc);
      set_session_storage("banklist", json_data.user_data.bank_list);
      set_session_storage("firstlogin", json_data.user_data.user.firstlogin);
      if (json_data.user_data.partner.partner_code) {
        var partner = json_data.user_data.partner.partner_code;
        if (partner === "bfdl") {
          set_session_storage("partner", "bfdlmobile");
        } else if (partner === "obcweb") {
          set_session_storage("partner", "obc");
        } else {
          set_session_storage("partner", partner);
        }
      }
    }
  }
  
})(window.callbackWeb ? window.callbackWeb : (window.callbackWeb = {}));