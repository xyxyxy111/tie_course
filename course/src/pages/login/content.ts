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
import { successCodes } from '@/utils/request';
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const loginForm = reactive({
  phone: '',
  email: '',
  password: '',
  captcha: '',
  rememberMe: false
});

const loginStatus = ref<{
  loading: boolean;
  error: string | null;
  success: boolean;
}>({
  loading: false,
  error: null,
  success: false
});

const captchaBtn = ref({
  text: '发送验证码',
  disabled: false,
  countdown: 60
});


const loginMethod = ref("captcha");
const showWechatLogin = ref(false);
const wechatQrCode = ref<string>('');
const wechatLoginStatus = ref<'waiting' | 'scanning' | 'success' | 'expired'>('waiting');
const wechatPollingInterval = ref<number | null>(null);

const useLoginData = () => {
  const handleLogin = async () => {

    if (loginMethod.value === 'captcha') {
      await handleCaptchaLogin();
    } else if (loginMethod.value === 'password') {
      console.log("password")
      await handlePasswordLogin();
    } else if (loginMethod.value === 'email') {

    } else if (loginMethod.value === 'wechat') {

      await handleWechatLogin();
    }
  };
  //验证码登录
  const handleCaptchaLogin = async () => {
    if (!loginForm.phone || !loginForm.captcha) {
      error.value = '请填写电话号码和验证码';
      return;
    }
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      // const response = await authApi.loginByCaptcha({
      //   phone: loginForm.phone,
      //   captcha: loginForm.captcha
      // });
      const response = await authApi.loginTest();//后门登陆 数据库要有电话为17727096201的user
      if (response.data) {
        localStorage.setItem('token', response.data);
        if (loginForm.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        success.value = '登录成功！';
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

  // 密码登录
  const handlePasswordLogin = async () => {
    console.log(loginForm.phone, loginForm.password)
    if (!loginForm.phone || !loginForm.password) {
      error.value = '请填写电话号码和密码';
      return;
    }
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      const response = await authApi.loginByPassword({
        phone: loginForm.phone,
        password: loginForm.password
      });
      console.log(response)
      if (response.data) {
        localStorage.setItem('token', response.data);
        if (loginForm.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        success.value = '登录成功！';
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
    showWechatLogin,
    wechatQrCode,
    wechatLoginStatus,
    handleLogin,
    handleCaptchaLogin,
    handlePasswordLogin,
    handleWechatLogin,
    isLoggedIn,
    redirectIfLoggedIn
  };
};
const sendCaptcha = async () => {
  if (!loginForm.phone) {
    alert('请输入手机号');
    return;
  }
  try {
    captchaBtn.value.disabled = true;
    const response = await authApi.sendCaptcha(loginForm.phone);
    if (successCodes.includes(response.status)) {
      const timer = setInterval(() => {
        captchaBtn.value.countdown--;
        captchaBtn.value.text = `${captchaBtn.value.countdown}s后重新获取`;
        if (captchaBtn.value.countdown <= 0) {
          clearInterval(timer);
          captchaBtn.value = {
            text: '发送验证码',
            disabled: false,
            countdown: 60
          };
        }
      }, 1000);
    } else {
      alert(response.message || '发送验证码失败');
      captchaBtn.value.disabled = false;
    }
  } catch (error: any) {
    captchaBtn.value.disabled = false;
    alert(error.message || '发送验证码失败，请重试');
  }
};

const useFormValidation = () => {
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

const switchLoginMethod = (i: number) => {
  if (i === 0) {
    loginMethod.value = 'captcha'
  } else if (i === 1) {
    loginMethod.value = 'password'
  } else if (i === 2) {
    loginMethod.value = 'email'
  } else {
    loginMethod.value = 'wechat'
  }
  loginForm.email = '';
  loginForm.password = '';
  loginForm.captcha = '';
  captchaBtn.value = {
    text: '发送验证码',
    disabled: false,
    countdown: 60
  };
};

export {
  loginMethod, showWechatLogin, loginForm,
  wechatLoginStatus, wechatQrCode, captchaBtn, loginStatus,
  wechatPollingInterval, switchLoginMethod,
  useFormValidation, useLoginData, sendCaptcha
}
