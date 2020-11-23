import axios from 'axios';

import qs from 'qs';
import createBrowserHistory from 'history/createBrowserHistory';
import { checkValidString } from './validators';
import { encrypt, decrypt } from './encryption';
import { getConfig } from 'utils/functions'
const myHistory = createBrowserHistory();
let { base_url } = qs.parse(myHistory.location.search.slice(1));

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
