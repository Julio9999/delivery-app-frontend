import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const plubClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

plubClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
