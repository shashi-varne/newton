import axios from 'axios';


import { storageService } from './validators';
import { encrypt, decrypt } from './encryption';
import { getConfig } from 'utils/functions';

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

        if (response.config.url.includes("/api/") && response.headers["x-plutus-auth"] && config.isIframe) {
          storageService().set("x-plutus-auth", response.headers["x-plutus-auth"])
        }

        let force_error_api = window.sessionStorage.getItem('force_error_api');
        if(force_error_api) {
          response.data.pfwresponse.status_code = 410;
          // response.data.pfwresponse.result = {};
          response.data.pfwresponse.result.error = 'Sorry, we could not process your request';
        }
        return response.data;
      }, error => {
        return error;
      })
      .catch(error => {
        return error;
      });
  }
}

export default Api;
