import { request } from '@/utils/request';
export interface LoginByCaptchaParams {
  phone: string;
  captcha: string;
}

export interface LoginByEmailParams {
  email: string;
  captcha: string;
}

export interface LoginByPasswordParams {
  account: string;
  password: string;
}

export interface RegisterByPhoneParams {
  phone: string;
  captcha: string;
}

export interface RegisterByEmailParams {
  email: string;
  captcha: string;
}

export interface CaptchaParams {
  phone: string;
}

export interface PhoneAvailabilityParams {
  phone: string;
}

export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  major: string;
  avatarUrl: string;
  allowEmailNotify?: boolean;
  allowSMSNotify?: boolean;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

export interface MyListVO {
  id: number;
  myCourseId: number;
  userId: string;
  courseId: number;
  title: string;
  coverImgUrl: string;
  watchProgress: number;
  lastViewedChapterId: number;
  lastViewedLessonId: number;
  lastViewedAt: number;
  lastViewedTime: string;
  createTime: string;
  updateTime: string | null;
  deleteTime: string | null;
  unused: any;
}

export interface WishListVO {
  courseId: number;
  title: string;
  originalPrice: number;
  currentPrice: number;
  coverImgUrl: string;
  score: number;
  totalMinutes: number;
}

export interface UserLogVO {
  username: string;
  IP: string;
  location: string;
  action: string;
  time: string;
}

export interface ChangePhoneParams {
  phone: string;
  newPhone: string;
  captcha: string;
  newCaptcha: string;
}


export interface ChangeEmailParams {
  email: string;
  captcha: string;
  newEmail: string;
}

export interface ChangePasswordParams {
  account: string;
  newPassword: string;
  captcha: string;
}

export const authApi = {
  // 发送验证码
  sendSmsCaptcha: (phone: string) => {
    return request({
      method: 'POST',
      url: '/auth/sms-captcha',
      params: {
        phone: phone.trim()
      }
    });
  },

  sendEmailCaptcha: (email: string) => {
    return request({
      method: 'POST',
      url: '/auth/email-captcha',
      params: {
        email: email.trim()
      }
    });
  },

  // 手机号+验证码登录
  loginTest: () => {
    return request<string>({
      method: 'POST',
      url: '/auth/loginTest',
    });
  },

  // 手机号+验证码登录
  loginByCaptcha: (data: LoginByCaptchaParams) => {
    return request<string>({
      method: 'POST',
      url: '/auth/sessions/by-phone',
      data
    });
  },

  loginByEmail: (data: LoginByEmailParams) => {
    return request<string>({
      method: 'POST',
      url: '/auth/sessions/by-email',
      data
    });
  },

  // 手机号+密码登录
  loginByPassword: (data: LoginByPasswordParams) => {
    return request<string>({
      method: 'POST',
      url: '/auth/sessions/by-password',
      data
    });
  },

  registerbyphone: (data: RegisterByPhoneParams) => {
    return request<string>({
      method: 'POST',
      url: '/auth/registrations/by-phone',
      data
    });
  },

  registerbyemail: (data: RegisterByEmailParams) => {
    return request<string>({
      method: 'POST',
      url: '/auth/registrations/by-email',
      data
    });
  },


  // 检查手机号是否注册
  checkPhoneAvailable: (phone: string) => {
    return request<{ exist: boolean }>({
      method: 'GET',
      url: '/auth/phone-availability',
      params: {
        phone: phone.trim()
      }
    });
  },

  //登出
  logout: () => {
    return request<{}>({
      method: 'DELETE',
      url: '/account/user/sessions'
    });
  },

  // 获取微信登录二维码
  getWxLoginQrcode: () => {
    return request({
      method: 'GET',
      url: '/auth/wxLogin-qrcode'
    });
  },

  // 获取微信登录状态
  getWxLoginStatus: (state: string) => {
    return request({
      method: 'GET',
      url: '/auth/sessions/by-wx',
    });
  }
};

// 用户相关API（需要认证）
export const userApi = {

  getAccountInfo: () => {
    return request({
      method: 'GET',
      url: '/account/user'
    });
  },
  // {
  // "code": 1016,
  // "message": "获取⽤⼾认证信息成功",
  // "data": {
  //   "phone": "⼿机号",
  //   "email": "邮箱",
  //   "passwordSet": "是否设置密码(boolen)",
  //   "wxInfo": "微信信息",
  //   "qqInfo": "QQ信息"
  // }
  //}


  // 修改手机号
  changePhone: (data: ChangePhoneParams) => {
    return request({
      method: 'PUT',
      url: '/account/user/phone',
      data
    });
  },

  // 修改密码
  changePasswordByPhone: (data: ChangePasswordParams) => {
    return request({
      method: 'PUT',
      url: '/account/user/password/by-phone',
      data
    });
  },

  changePasswordByEmail: (data: ChangePasswordParams) => {
    return request({
      method: 'PUT',
      url: '/account/user/password/by-email',
      data
    });
  },

  // 获取微信绑定二维码
  getWxBindQrcode: () => {
    return request({
      method: 'GET',
      url: '/account/user/wxBind-qrcode',
      responseType: 'arraybuffer'
    });
  },

  // 获取微信绑定状态
  getWxBindStatus: (state: string) => {
    return request({
      method: 'GET',
      url: '/account/user/result/wxBind',
      params: { state }
    });
  },

  // 修改邮箱
  changeEmail: (data: ChangeEmailParams) => {
    return request({
      method: 'PUT',
      url: '/account/user/email',
      data
    });
  },


};

export const profileApi = {
  // 获取个人资料
  getProfile: () => {
    return request<UserProfile>({
      method: 'GET',
      url: '/account/profile'
    });
  },

  // 更新个人资料
  updateProfile: (data: UserProfile) => {
    return request({
      method: 'PUT',
      url: '/account/profile',
      data
    });
  },

  // 上传头像
  uploadAvatar: (formData: FormData) => {
    return request<UploadAvatarResponse>({
      method: 'POST',
      url: '/account/profile/avatar',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

export const wishlistApi = {

  // 添加到心愿单
  addToWishlist: (courseId: number) => {
    return request({
      url: '/account/wishlist',
      method: 'POST',
      params: { courseId }
    })
  },

  // 获取用户心愿单
  getWishlist: () => {
    return request({
      url: '/account/wishlist',
      method: 'GET'
    })
  },

  // 从心愿单移除课程
  removeFromWishlist: (courseId: number) => {
    return request({
      url: '/account/wishlist',
      method: 'DELETE',
      params: { courseId }
    })
  },

  // 清空心愿单
  clearWishlist: () => {
    return request({
      url: '/account/wishlist/all',
      method: 'DELETE'
    })
  }
}



export const logApi = {

  getUserLogs: (num: number) => {
    return request({
      url: '/account/log',
      method: 'GET',
      params: { num }
    })
  },


  clearUserLogs: () => {
    return request({
      url: '/account/log',
      method: 'DELETE'
    })
  }
}

export const myListApi = {
  getMyList: () => {
    return request({
      url: '/my-courses/',
      method: 'GET'
    })
  },
}