import { request } from '@/utils/request.ts';
import type {
  LoginByCaptchaParams,
  LoginByPasswordParams,
  RegisterParams,
  UserProfile,
  ChangePhoneParams,
  ChangePasswordParams
} from '@/types/user';

// 认证相关API
export const authApi = {
  // 发送验证码
  sendCaptcha: (phone:string) => {
    return request({
      method: 'POST',
      url: '/auth/captcha',
      data: {
        phone: phone.trim()
      }
    });
  },

  // 手机号+验证码登录
  loginByCaptcha: (data: LoginByCaptchaParams) => {
    return request<{ token: string }>({
      method: 'POST',
      url: '/auth/sessions/by-captcha',
      data
    });
  },

  // 手机号+密码登录
  loginByPassword: (data: LoginByPasswordParams) => {
    return request<{ token: string }>({
      method: 'POST',
      url: '/auth/sessions/by-password',
      data
    });
  },

  // 手机号注册
  register: (data: RegisterParams) => {
    return request<{ token: string }>({
      method: 'POST',
      url: '/auth/registrations',
      data
    });
  },

  // 检查手机号是否注册
  checkPhoneAvailable: ( phone: string ) => {
    return request<{ exist: boolean }>({
      method: 'GET',
      url: '/auth/phone-availability',
      params: {
        phone:phone.trim()
      }
    });
  }
};

// 用户相关API（需要认证）
export const userApi = {
    // 修改手机号
  changePhone: (data: ChangePhoneParams) => {
    return request({
      method: 'PUT',
      url: '/api/user/phone',
      data
    });
  },

  // 修改密码
  changePassword: (data: ChangePasswordParams) => {
    return request({
      method: 'PUT',
      url: '/api/user/password',
      data
    });
  }
};

export const profileApi = {
  //获取个人资料
  getProfile: () => {
    return request({
      method: 'GET',
      url: '/api/profile'
    });
  },

  // 更新个人资料
  updateProfile: (data: UserProfile) => {
    return request({
      method: 'PUT',
      url: '/api/profile',
      data
    });
  },


}
