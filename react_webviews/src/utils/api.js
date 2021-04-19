import axios from 'axios';
import * as Sentry from '@sentry/browser'

import { checkValidString } from './validators';
import { encrypt, decrypt } from './encryption';
import { getConfig } from 'utils/functions';

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
        let force_error_api = window.sessionStorage.getItem('force_error_api');
        if(force_error_api) {
          response.data.pfwresponse.status_code = 410;
          // response.data.pfwresponse.result = {};
          response.data.pfwresponse.result.error = 'Sorry, we could not process your request';
        }
        if (response.data.pfwresponse.status_code !== 200) {
          var errorMsg = response.data.pfwresponse.result.error || response.data.pfwresponse.result.message || "Something went wrong";
          var main_pathname=window.location.pathname
          var project='admin'
          if (main_pathname.indexOf('group-insurance') >= 0) {
            project = 'group-insurance';
          } else if (main_pathname.indexOf('insurance') >= 0) {
            project = 'insurance';
          } else if (main_pathname.indexOf('risk') >= 0) {
            project = 'risk';
          } else if (main_pathname.indexOf('mandate-otm') >= 0) {
            project = 'mandate-otm';
          } else if (main_pathname.indexOf('e-mandate') >= 0) {
            project = 'e-mandate';
          } else if (main_pathname.indexOf('mandate') >= 0) {
            project = 'mandate';
          } else if (main_pathname.indexOf('gold') >= 0) {
            project = 'gold';
          } else if (main_pathname.indexOf('isip') >= 0) {
            project = 'isip';
          } else if (main_pathname.indexOf('referral') >= 0) {
            project = 'referral';
          } else if (main_pathname.indexOf('help') >= 0) {
            project = 'help';
          } else if (main_pathname.indexOf('loan') >= 0) {
            project = 'loan';
          } else if (main_pathname.indexOf('w-report') >= 0) {
            project = 'w-report';
          } else if (main_pathname.indexOf('kyc-esign') >= 0) {
            project = 'kyc-esign';
          } else if (main_pathname.indexOf('pg') >= 0) {
            project = 'pg';
          } else if (main_pathname.indexOf('portfolio-rebalancing') >= 0) {
            project = 'portfolio-rebalancing';
          } else if (main_pathname.indexOf('iw-dashboard') >= 0) {
            project = 'iw-dashboard';
          }
          Sentry.configureScope(
            scope=>scope
            .setTag("squad",project)
            .setTag("pathname",main_pathname)
            .setTransactionName(`Error on ${verb} request`)
            // .setUser({"email":"test@example.com"})
            .setLevel(Sentry.Severity.Critical)
            .setExtra("api_res",JSON.stringify(response.data))
          )
          var SentryError = new Error(errorMsg)
          SentryError.name= `${project} ${main_pathname}`
          Sentry.captureException(SentryError)
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

export default Api;
