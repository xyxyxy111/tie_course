import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器（统一错误处理）
instance.interceptors.response.use(
  (response) => {
    if (response.data.code !== 1000 && response.data.code !== 1011) {
      return Promise.reject(response.data.message);
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const request = <T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return instance(config);
};