import { request } from '@/utils/request.ts';
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

interface UserProfile {
  username: string;
  lastName: string;
  firstName: string;
  title: string;
  bio: string;
}

// allowEmailNotify: boolean;
//allowSMSNotify: boolean;
//avatarUrl: string;

interface WishListVO {
  title: string;
  originalPrice: number;
  currentPrice: number;
  coverImgUrl: string;
  score: number;
  totalMinutes: number;
}

interface UserLogVO {
  username: string;
  IP: string;
  location: string;
  action: string;
  time: string;
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

export const authApi = {
  // 发送验证码
  sendCaptcha: (phone: string) => {
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
      url: '/auth/sessions'
    });
  }
};

// 用户相关API（需要认证）
export const userApi = {
  // 修改手机号
  changePhone: (data: ChangePhoneParams) => {
    return request({
      method: 'PUT',
      url: '/account/user/phone',
      data
    });
  },

  // 修改密码
  changePassword: (data: ChangePasswordParams) => {
    return request({
      method: 'PUT',
      url: '/account/user/password',
      data
    });
  },
  getAccountInfo: () => {
    return request({
      method: 'GET',
      url: '/account/user'
    });
  },
};

export const profileApi = {
  //获取个人资料
  getProfile: () => {
    return request({
      method: 'GET',
      url: '/profile'
    });
  },

  // 更新个人资料
  updateProfile: (data: UserProfile) => {
    return request({
      method: 'PUT',
      url: '/profile',
      data
    });
  }
}

export const wishlistApi = {

  // 添加到心愿单
  addToWishlist: (courseId: number) => {
    return request({
      url: '/account/wishlist',
      method: 'POST',
      data: { courseId }
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
      url: '/account/log/all',
      method: 'DELETE'
    })
  }
}
