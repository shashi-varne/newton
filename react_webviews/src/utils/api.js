import axios from 'axios';

import qs from 'qs';
import createBrowserHistory from 'history/createBrowserHistory';

const myHistory = createBrowserHistory();
let { base_url } = qs.parse(myHistory.location.search.slice(1));
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
    let options = Object.assign({
      method: verb,
      url: route,
      params: (verb === 'get') ? params : null,
      data: (verb !== 'get') ? params : null
    });

    return axios(options)
      .then(response => {
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
