import axios from 'axios';

import { GLOBAL_CONFIG } from '../global-config';
import { clearAuth, getToken } from '../utils';

export const axiosInstance = axios.create({
  baseURL: GLOBAL_CONFIG.apiBaseUrl,
  timeout: 8_000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuth();
    }

    return Promise.reject(error);
  },
);
