import axios from 'axios';
import * as Sentry from '@sentry/browser'

import { checkValidString } from './validators';
import { isEmpty } from 'lodash';
import { encrypt, decrypt } from './encryption';
import { getConfig } from 'utils/functions';

const genericErrMsg = "Something went wrong";

let base_url = getConfig().base_url;
let redirect_url = getConfig().redirect_url;
let sdk_capabilities = getConfig().sdk_capabilities;
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
    if (redirect_url && verb !== 'get') {
      if (params instanceof FormData) {
        is_secure = false;
      } else {
        redirect_url = decodeURIComponent(redirect_url);
        let redirect_url_data = redirect_url.split("?is_secure=")
        if (redirect_url_data.length === 2) {
          is_secure = checkValidString(redirect_url_data[1]);
        }

      }
    }
    if (sdk_capabilities) {
      axios.defaults.headers.common['sdk-capabilities'] = sdk_capabilities;
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

        const pfwResponseData = response?.data?.pfwresponse;

        if (isEmpty(pfwResponseData)) {
          const errorMsg = response.data?.pfwmessage || genericErrMsg;
          triggerSentryError(verb, response.data, errorMsg);
        } else if (pfwResponseData.status_code !== 200 && pfwResponseData.status_code !== 400) {
          const errorMsg = pfwResponseData.result.error || pfwResponseData.result.message || genericErrMsg;
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
        Sentry.captureException(error);
        return error;
      })
      .catch(error => {
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
