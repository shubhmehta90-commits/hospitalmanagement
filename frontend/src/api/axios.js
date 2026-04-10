import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT access token
API.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('hms_tokens');
    if (tokens) {
      const { access } = JSON.parse(tokens);
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (token expired)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem('hms_tokens');
        if (tokens) {
          const { refresh } = JSON.parse(tokens);
          const res = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh,
          });

          const newTokens = {
            access: res.data.access,
            refresh: res.data.refresh || refresh,
          };
          localStorage.setItem('hms_tokens', JSON.stringify(newTokens));

          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('hms_tokens');
        localStorage.removeItem('hms_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
