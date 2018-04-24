import axios from 'axios';

axios.defaults.baseURL = 'https://girish-dot-plutus-staging.appspot.com';
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
        return error.response.data;
      })
      .catch(error => {
        return error.response.data;
      });
  }
}

export default Api;
