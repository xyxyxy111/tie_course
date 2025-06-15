// 通用响应结构
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 登录/注册相关
interface LoginByCaptchaParams {
  phone: string;
  captcha: string;
}

interface LoginByPasswordParams {
  phone: string;
  password: string;
}

interface RegisterParams {
  phone: string;
  captcha: string;
}

interface CaptchaParams {
  phone: string;
}

interface PhoneAvailabilityParams {
  phone: string;
}

// 用户信息相关
interface UserProfile {
  username?: string;
  lastName?: string;
  firstName?: string;
  major?: string;
  allowEmailNotify?: boolean;
  allowSHNotify?: boolean;
  avatarUrl?: string;
}

interface ChangePhoneParams {
  phone: string;
  newPhone: string;
  captcha: string;
}


interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}


export type {
  LoginByCaptchaParams,
  LoginByPasswordParams,
  RegisterParams,
  UserProfile,
  ChangePhoneParams,
  ChangePasswordParams,
  ApiResponse
}