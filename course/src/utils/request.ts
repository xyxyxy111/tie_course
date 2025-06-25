// src/utils/request.ts
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
  token: string;
}

// 检查token是否有效
export const isValidToken = (token: string | null): boolean => {
  return token !== null && token !== undefined && token !== 'undefined' && token.trim() !== '';
};

// 获取有效的token
export const getValidToken = (): string | null => {
  const token = localStorage.getItem('token');
  return isValidToken(token) ? token : null;
};

const instance = axios.create({
  baseURL: 'http://localhost:5173/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = getValidToken();
  if (token) {
    config.headers.Authorization = `${token}`;
    console.log('请求头已设置Authorization:', `${token.substring(0, 20)}...`);
  } else {
    console.log('未找到有效token，跳过Authorization设置');
  }
  return config;
});

// 这里维护所有"成功"code
export const successCodes = [
  1,      // 通用成功
  1000,   // 操作成功
  1010,   // 用户注册成功
  1011,   // 用户登录成功
  1012,   // 用户登出成功
  1013,   // 获取验证码成功
  1014,   // 用户手机号修改成功
  1015,   // 用户密码修改成功
  1016,   // 获取用户认证信息成功
  1017,   // 微信绑定成功
  1020,   // 用户信息更新成功
  1021,   // 获取用户信息成功
  1030,   // 日志获取成功
  1031,   // 日志清除成功
  1040,   // 愿望单添加成功
  1041,   // 愿望单移除成功
  1042,   // 愿望单获取成功
  1043,   // 愿望单清空成功
  1100,   // 获取分类列表成功
  1101,   // 获取标签列表成功
  1110,   // 获取课程列表信息成功
  1111,   // 获取单个课程详情成功
  1120,   // 获取章节信息成功
  1130,   // 获取课信息成功
  1200,   // 获取订单信息成功
  1201,   // 获取订单列表信息成功
  1202,   // 订单创建成功
  1203,   // 订单支付成功
  1204,   // 订单状态更新成功
  1300,   // 获取购物车信息成功
  1301,   // 创建购物车成功
  1302    // 购物车信息更新成功
];

instance.interceptors.response.use(
  (response) => {
    if (!successCodes.includes(response.data.status)) {
      console.log('完整response:', response);
      console.log('response.data:', response.data);
      return Promise.reject(response.data.message);
    }
    console.log('完response:', response);
    console.log('response.data:', response.data);
    return response.data;
  },
  (error) => {
    // 处理token相关错误
    if (error.response) {
      const { status, data } = error.response;

      // 401 未授权，可能是token过期或无效
      if (status === 401) {
        console.log('Token无效或已过期，清除本地token');
        localStorage.removeItem('token');

        // 如果不是登录页面，则重定向到登录页面
        if (!window.location.pathname.includes('login.html')) {
          console.log('重定向到登录页面');
          window.location.href = '/login.html';
        }
      }

      // 403 禁止访问
      if (status === 403) {
        console.log('访问被禁止，可能需要重新登录');
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('login.html')) {
          window.location.href = '/login.html';
        }
      }
    }

    return Promise.reject(error);
  }
);

export const request = <T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return instance(config);
};