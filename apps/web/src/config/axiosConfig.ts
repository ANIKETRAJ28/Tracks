import axios from 'axios';

import { BACKEND_URL } from './envConfig';

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});
