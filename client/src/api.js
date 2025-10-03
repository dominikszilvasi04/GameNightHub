import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

/*
  This is the interceptor. It's a function that runs on every request
  before it's sent.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, add it to the 'x-auth-token' header
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;