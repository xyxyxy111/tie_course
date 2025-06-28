// src/api-call-examples.ts
import {
  authApi,
  userApi,
  profileApi
} from '@/api/user';
import type {
  LoginByCaptchaParams,
  LoginByPasswordParams,
  RegisterParams,
  UserProfile,
} from '@/api/user';
import { ref, reactive } from 'vue';
import { getValidToken } from '@/utils/request';

// 1. 发送验证码
const handleSendCaptcha = async () => {
  try {
    const response = await authApi.sendCaptcha('13800138000');
    console.log('验证码发送成功', response.data);
  } catch (error) {
    console.error('发送验证码失败:', error);
  }
};

// 2. 手机号+验证码登录
const handleLoginByCaptcha = async () => {
  const params: LoginByCaptchaParams = {
    phone: '13800138000',
    captcha: '123456'
  };

  try {
    const response = await authApi.loginByCaptcha(params);
    const token = response.data;
    localStorage.setItem('token', token);
    console.log('登录成功，token已保存');
  } catch (error) {
    console.error('登录失败:', error);
  }
};

// 3. 手机号+密码登录
const handleLoginByPassword = async () => {
  const params: LoginByPasswordParams = {
    phone: '13800138000',
    password: 'yourPassword123'
  };

  try {
    const response = await authApi.loginByPassword(params);
    const token = response.data;
    localStorage.setItem('token', token);
    console.log('登录成功，token已保存');
  } catch (error) {
    console.error('登录失败:', error);
  }
};

// 4. 手机号注册
const handleRegister = async () => {
  const params: RegisterParams = {
    phone: '13800138000',
    captcha: '123456'
  };

  try {
    const response = await authApi.register(params);
    const token = response.data;
    localStorage.setItem('token', token);
    console.log('注册成功，token已保存');
  } catch (error) {
    console.error('注册失败:', error);
  }
};

// 5. 检查手机号是否注册
const checkPhoneAvailability = async () => {
  try {
    const response = await authApi.checkPhoneAvailable('13800138000');
    console.log(response.data.exist ? '手机号已注册' : '手机号可用');
  } catch (error) {
    console.error('检查失败:', error);
  }
};

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  agreeToTerms: false
});

// 微信登录相关状态
const showWechatLogin = ref(false);
const wechatQrCode = ref<string>('');
const wechatLoginStatus = ref<'waiting' | 'scanning' | 'success' | 'expired'>('waiting');
const wechatPollingInterval = ref<number | null>(null);

export const useLoginData = () => {
  // 密码登录
  const handlePasswordLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      error.value = '请填写邮箱和密码';
      return;
    }

    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      const response = await authApi.loginByPassword({
        phone: loginForm.email,
        password: loginForm.password
      });

      if (response.data) {
        // 保存token
        localStorage.setItem('token', response.data);
        if (loginForm.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        success.value = '登录成功！';

        // 跳转到首页或之前的页面
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/index.html';
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      } else {
        error.value = response.message || '登录失败';
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '登录失败，请检查网络连接';
      console.error('登录失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 微信登录
  const handleWechatLogin = async () => {
    showWechatLogin.value = true;
    wechatLoginStatus.value = 'waiting';

    try {
      // 获取微信登录二维码
      const response = await authApi.getWxLoginQrcode();
      if (response.data) {
        // wechatQrCode.value = response.data.qrCodeUrl;
        // startWechatPolling(response.data.qrCodeId);
      } else {
        error.value = '获取微信登录二维码失败';
        showWechatLogin.value = false;
      }
    } catch (err: any) {
      error.value = '获取微信登录二维码失败';
      showWechatLogin.value = false;
      console.error('获取微信二维码失败:', err);
    }
  };

  // 检查是否已登录
  const isLoggedIn = () => {
    const token = getValidToken();
    return !!token;
  };

  // 如果已登录，跳转到首页
  const redirectIfLoggedIn = () => {
    if (isLoggedIn()) {
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/index.html';
      window.location.href = redirectUrl;
    }
  };

  return {
    loading,
    error,
    success,
    loginForm,
    registerForm,
    showWechatLogin,
    wechatQrCode,
    wechatLoginStatus,
    handlePasswordLogin,
    handleRegister,
    handleWechatLogin,
    isLoggedIn,
    redirectIfLoggedIn
  };
};

// 表单验证工具函数
export const useFormValidation = () => {
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateUsername = (username: string) => {
    return username.length >= 2 && username.length <= 20;
  };

  return {
    validateEmail,
    validatePassword,
    validateUsername
  };
};

export {
  authApi, userApi, profileApi
}