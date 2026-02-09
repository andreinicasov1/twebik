import axios from 'axios';
import { CONFIG } from '../global-config';

export const axiosInstance = axios.create({
  baseURL: CONFIG.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});
