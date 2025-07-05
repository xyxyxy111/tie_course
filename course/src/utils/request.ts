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
  if (!isValidToken(token)) return null;

  // 对于JWT token，进行额外的过期检查
  try {
    const parts = token!.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));

      // 检查token是否过期
      if (payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > payload.exp) {
          console.log('JWT token已过期，清除本地token');
          localStorage.removeItem('token');
          return null;
        }
      }
    }
  } catch (error) {
    console.error('检查token过期时出错:', error);
    // 如果检查失败，清除可能损坏的token
    localStorage.removeItem('token');
    return null;
  }

  return token;
};

// 检查token是否过期
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));

      if (payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime > payload.exp;
      }
    }
    return false; // 如果不是JWT格式或没有过期时间，认为未过期
  } catch (error) {
    console.error('检查token过期时出错:', error);
    return true; // 解析失败认为已过期
  }
};

export const clearExpiredToken = (): void => {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    console.log('检测到过期token，正在清除...');
    localStorage.removeItem('token');
  }
};

export const getUserFromToken = (): { userId?: string; username?: string } | null => {
  const token = getValidToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token payload:', payload);
      if (payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > payload.exp) {
          console.log('JWT token已过期，清除本地token');
          localStorage.removeItem('token');
          return null;
        }
      }

      return {
        userId: payload.userId || payload.sub || payload.id,
        username: payload.username || payload.name
      };
    }

    // 如果不是JWT格式，尝试解析为简单格式
    // 假设token格式为: userId:username 或其他格式
    if (token.includes(':')) {
      const [userId, username] = token.split(':');
      return { userId, username };
    }

    // 如果都不匹配，返回null
    console.log('Token格式无法识别:', token.substring(0, 20) + '...');
    return null;
  } catch (error) {
    console.error('解析token失败:', error);
    // 如果解析失败，可能是token格式错误，清除无效token
    console.log('清除无效token');
    localStorage.removeItem('token');
    return null;
  }
};

// 获取当前用户ID
export const getCurrentUserId = (): string | null => {
  const userInfo = getUserFromToken();
  return userInfo?.userId || null;
};

// 获取当前用户名
export const getCurrentUsername = (): string | null => {
  const userInfo = getUserFromToken();
  return userInfo?.username || null;
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
  1112,   // 搜索课程成功
  1120,   // 获取章节信息成功
  1130,   // 获取课信息成功
  1140,   // 获取我的课程成功
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
      return Promise.reject(response.data.message);
    }
    console.log('完整response:', response);
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

// Token管理工具类
export class TokenManager {
  private static checkInterval: number | null = null;
  private static readonly CHECK_INTERVAL = 5 * 60 * 1000; // 每5分钟检查一次

  // 启动定期检查
  static startPeriodicCheck(): void {
    if (this.checkInterval) {
      return; // 已经在运行
    }

    this.checkInterval = window.setInterval(() => {
      clearExpiredToken();
    }, this.CHECK_INTERVAL);

    console.log('Token定期检查已启动，每5分钟检查一次');
  }

  // 停止定期检查
  static stopPeriodicCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Token定期检查已停止');
    }
  }

  // 立即检查并清理过期token
  static checkAndClear(): void {
    clearExpiredToken();
  }

  // 获取token剩余有效时间（秒）
  static getTokenRemainingTime(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));

        if (payload.exp) {
          const currentTime = Math.floor(Date.now() / 1000);
          const remainingTime = payload.exp - currentTime;
          return remainingTime > 0 ? remainingTime : 0;
        }
      }
    } catch (error) {
      console.error('获取token剩余时间时出错:', error);
    }

    return null;
  }

  // 检查token是否即将过期（默认5分钟内）
  static isTokenExpiringSoon(warningMinutes: number = 5): boolean {
    const remainingTime = this.getTokenRemainingTime();
    if (remainingTime === null) return false;

    return remainingTime <= warningMinutes * 60;
  }
}