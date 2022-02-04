import axios from 'axios';
import * as Sentry from '@sentry/browser'

import isEmpty from 'lodash/isEmpty';
import { storageService } from './validators';
import { encrypt, decrypt } from './encryption';
import { nativeCallback } from './native_callback';
import { getConfig, getGuestUserRoute } from 'utils/functions';

const genericErrMsg = "Something went wrong";
let base_url = getConfig().base_url;

let is_secure = false;

axios.defaults.baseURL = decodeURIComponent(base_url).replace(/\/$/, "");
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

class Api {
  constructor() {
    this.genericErrMsg = 'Something went wrong. Please try again!'
  }
  
  static handleApiResponse(res) {
    if (res.pfwstatus_code !== 200 || !res.pfwresponse || isEmpty(res.pfwresponse)) {
      throw genericErrMsg;
    }

    const { result, status_code: status } = res.pfwresponse;

    if (status === 200) {
      return result;
    } else {
      throw result.error || result.message || genericErrMsg;
    }
  }
  
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
    const config = getConfig();
    if (verb !== 'get') {
      if (params instanceof FormData) {
        is_secure = false;
      } else {
        is_secure = storageService().get("is_secure");
      }
    }
    const sdk_capabilities = config.sdk_capabilities;
    if (sdk_capabilities) {
      axios.defaults.headers.common['sdk-capabilities'] = sdk_capabilities;
    }

    if(route.includes("/api/user/login/v5/initiate")) {
      axios.defaults.headers.common["X-Platform"] = "web";
    }

    // if(route.includes("/api/") && storageService().get("x-plutus-auth") && config.isIframe) {
    //   axios.defaults.headers.common["X-Plutus-Auth"] = storageService().get("x-plutus-auth")
    // }
    if(route.includes('api/insurance')){  
      route = getGuestUserRoute(route)
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

        if (response.data.pfwstatus_code === 416) {
          nativeCallback({ action: '2fa_expired' });
        } else if (response.data.pfwstatus_code === 403) {
          nativeCallback({ action: 'login_required' });
        }

        // if (response.config.url.includes("/api/") && response.headers["x-plutus-auth"] && config.isIframe) {
        //   storageService().set("x-plutus-auth", response.headers["x-plutus-auth"])
        // }

        const pfwResponseData = response?.data?.pfwresponse;

        if (isEmpty(pfwResponseData)) {
          const errorMsg = response.data?.pfwmessage || genericErrMsg;
          if(response?.data?.pfwstatus_code === 403){
            // We are Neglecting Login Required in Sentry, Which is not Importent Event to capture.
         } else {
           triggerSentryError(verb, response.data, errorMsg);
         }
        } else if (
          pfwResponseData.status_code !== 200 &&
          pfwResponseData.status_code !== 400 &&
          pfwResponseData.status_code !== 403 &&
          pfwResponseData.status_code !== 402 &&
          pfwResponseData.status_code !== 401 &&
          pfwResponseData.status_code !== 405 &&
          pfwResponseData.status_code !== 414 &&
          pfwResponseData.status_code !== 408
        ) {
          const errorMsg =
            pfwResponseData.result.error ||
            pfwResponseData.result.message ||
            genericErrMsg;
          triggerSentryError(verb, response.data, errorMsg);
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

function triggerSentryError(verb, response, errorMsg) {
  var main_pathname = window.location.pathname;
  var project = getConfig().project || 'Others';
  Sentry.configureScope(
    scope => scope
      .setTag("squad", project)
      .setTag("pathname", main_pathname)
      .setTransactionName(`Error on ${verb} request`)
      .setLevel(Sentry.Severity.Warning)
      .setExtra("api_res", JSON.stringify(response))
  )
  var SentryError = new Error(errorMsg)
  SentryError.name = `${project} ${main_pathname}`
  Sentry.captureException(SentryError)
}

export default Api;
