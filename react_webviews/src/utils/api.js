import axios from 'axios';
import * as Sentry from '@sentry/browser'

import { storageService } from './validators';
import { encrypt, decrypt } from './encryption';
import { getConfig } from 'utils/functions';
import { nativeCallback } from './native_callback';

const config = getConfig();
let base_url = config.base_url;

let sdk_capabilities = config.sdk_capabilities;
let is_secure = false;

axios.defaults.baseURL = decodeURIComponent(base_url).replace(/\/$/, "");
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;
class Api {
  static get(route, params) {
    return this.xhr(route, params, 'get');
  }
  
  static put(route, params) {
    return this.xhr(route, params, 'put')
  }

  static post(route, params) {
    return this.xhr(route, params, 'post')
  }

  static delete(route, params) {
    return this.xhr(route, params, 'delete')
  }

  static xhr(route, params, verb) {
    if (verb !== 'get') {
      if (params instanceof FormData) {
        is_secure = false;
      } else {
        is_secure = storageService().get("is_secure");
      }
    }
    if (sdk_capabilities) {
      axios.defaults.headers.common['sdk-capabilities'] = sdk_capabilities;
    }
    if(route.includes("/api/") && storageService().get("x-plutus-auth") && config.isIframe) {
      axios.defaults.headers.common["X-Plutus-Auth"] = storageService().get("x-plutus-auth")
    }
    let options = Object.assign({
      method: verb,
      url: route,
      params: (verb === 'get') ? params : null,
      data: (verb !== 'get') ? (is_secure ? { _encr_payload: encrypt(JSON.stringify(params)) } : params) : null,
      res: (verb !== 'get') ? params : null
    });

    return axios(options)
      .then(response => {
        if (response.data._encr_payload) {
          response.data = JSON.parse(decrypt(response.data._encr_payload));
        }
        console.log(response.data);

        if (response.data.pfwstatus_code === 416) {
          nativeCallback({ action: '2fa_required' });
        } //TODO: CHeck with Satendra about where this code must be relative to below code

        if (response.config.url.includes("/api/") && response.headers["x-plutus-auth"] && config.isIframe) {
          storageService().set("x-plutus-auth", response.headers["x-plutus-auth"])
        }

        if (response.data?.pfwresponse?.status_code !== 200) {
          var errorMsg = response.data.pfwresponse.result.error || response.data.pfwresponse.result.message || "Something went wrong";
          var main_pathname=window.location.pathname
          var project=getConfig().project || 'Others'
          Sentry.configureScope(
            scope=>scope
            .setTag("squad",project)
            .setTag("pathname",main_pathname)
            .setTransactionName(`Error on ${verb} request`)
            .setLevel(Sentry.Severity.Warning)
            .setExtra("api_res",JSON.stringify(response.data))
          )
          var SentryError = new Error(errorMsg)
          SentryError.name= `${project} ${main_pathname}`
          Sentry.captureException(SentryError)
        }
        let force_error_api = window.sessionStorage.getItem('force_error_api');
        if(force_error_api) {
          response.data.pfwresponse.status_code = 410;
          // response.data.pfwresponse.result = {};
          response.data.pfwresponse.result.error = 'Sorry, we could not process your request';
        }

        return response.data;
      }, error => {
        console.log(error);
        Sentry.captureException(error);
        return error;
      })
      .catch(error => {
        console.log(error);

        Sentry.captureException(error);
        return error;
      });
  }
}

export default Api;
