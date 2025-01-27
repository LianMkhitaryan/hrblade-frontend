import { API_BASE_PATH } from '../const/index.js';

const apiRequest = async (path, method, body, withHeader = false) => {
  const lang = localStorage.getItem('lang');

  let options = {
    method,
    headers: {
      'Accept-Language': lang || 'en'
    }
  };

  if (body) {
    options = Object.assign({}, options, { body });
  }

  if (withHeader) {
    options = Object.assign({}, options, {
      headers: {
        ...options.headers,
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  }

  const res = await fetch(`${API_BASE_PATH}${path}`, options);
  const data = await res.json();

  return data;
};

export default apiRequest;
