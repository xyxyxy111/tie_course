import {
  authApi,
  userApi,
  profileApi
} from '@/api/user';

import type {
  LoginByCaptchaParams,
  LoginByPasswordParams,
  RegisterByPhoneParams,
  RegisterByEmailParams,
  UserProfile,
} from '@/api/user';

import { ref, reactive, computed } from 'vue';
import { getValidToken } from '@/utils/request';
import { successCodes } from '@/utils/request';

interface LoginStatus {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface RegisterStatus {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface CaptchaButton {
  text: string;
  disabled: boolean;
  countdown: number;
}

interface WxQrCode {
  state: string;
  qrCodeUrl: string;
}

const loginMethod = ref<"captcha" | "password" | "email" | "wechat">("captcha");
const registerMethod = ref<"phone" | "email">("phone");
const qrCodeUrl = ref('');
const state = ref('');
const validatePhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone);
const validateCaptcha = (captcha: string) => /^\d{6}$/.test(captcha);
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string) => password.length >= 6;

const useLogin = () => {
  const loginForm = reactive({
    phone: '',
    email: '',
    password: '',
    captcha: '',
    rememberMe: false
  });

  const loginStatus = reactive<LoginStatus>({
    loading: false,
    error: null,
    success: false
  });

  // 分别创建手机和邮箱验证码按钮
  const phoneCaptchaBtn = reactive<CaptchaButton>({
    text: '发送验证码',
    disabled: false,
    countdown: 60
  });

  const emailCaptchaBtn = reactive<CaptchaButton>({
    text: '发送验证码',
    disabled: false,
    countdown: 60
  });

  // 验证码登录
  const handleCaptchaLogin = async () => {
    if (!loginForm.phone || !loginForm.captcha) {
      loginStatus.error = '请填写电话号码和验证码';
      return;
    }

    loginStatus.loading = true;
    loginStatus.error = null;

    try {
      const response = await authApi.loginByCaptcha({
        phone: loginForm.phone,
        captcha: loginForm.captcha
      });

      if (response.data) {
        handleLoginSuccess(response.data);
      } else {
        loginStatus.error = response.message || '登录失败';
      }
    } catch (err: any) {
      loginStatus.error = err.response?.data?.message || '登录失败，请检查网络连接';
      console.error('登录失败:', err);
    } finally {
      loginStatus.loading = false;
    }
  };

  // 邮箱登录
  const handleEmailLogin = async () => {
    if (!loginForm.email || !loginForm.captcha) {
      loginStatus.error = '请填写邮箱和验证码';
      return;
    }

    loginStatus.loading = true;
    loginStatus.error = null;

    try {
      const response = await authApi.loginByEmail({
        email: loginForm.email,
        captcha: loginForm.captcha
      });

      if (response.data) {
        handleLoginSuccess(response.data);
      } else {
        loginStatus.error = response.message || '登录失败';
      }
    } catch (err: any) {
      loginStatus.error = err.response?.data?.message || '登录失败，请检查网络连接';
      console.error('登录失败:', err);
    } finally {
      loginStatus.loading = false;
    }
  };

  // 密码登录
  const handlePasswordLogin = async () => {
    if (!loginForm.phone || !loginForm.password) {
      loginStatus.error = '请填写电话号码和密码';
      return;
    }

    loginStatus.loading = true;
    loginStatus.error = null;

    try {
      const response = await authApi.loginByPassword({
        account: loginForm.phone,
        password: loginForm.password
      });

      if (response.data) {
        handleLoginSuccess(response.data);
      } else {
        loginStatus.error = response.message || '登录失败';
      }
    } catch (err: any) {
      loginStatus.error = err.response?.data?.message || '登录失败，请检查网络连接';
      console.error('登录失败:', err);
    } finally {
      loginStatus.loading = false;
    }
  };

  // 微信登录
  const handleWechatLogin = async () => {
    try {
      const res = await authApi.getWxLoginQrcode();
      const data = res.data as WxQrCode;

      if (res.data) {
        qrCodeUrl.value = data.qrCodeUrl;
        state.value = data.state;
      }
    } catch (err) {
      console.error('获取微信登录二维码失败:', err);
      loginStatus.error = '获取微信登录二维码失败';
    }
  };

  const getWxLoginStatus = async () => {
    try {
      const res = await authApi.getWxLoginStatus(state.value);
      const data = res.data as string;

      if (res.data) {
        handleLoginSuccess(data);
      }
    } catch (err) {
      console.error('微信登录状态检查失败:', err);
      loginStatus.error = '微信登录失败';
    }
  };

  // 登录成功处理
  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);

    if (loginForm.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }

    loginStatus.success = true;
    loginStatus.error = null;

    const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/index.html';
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  };

  // 主登录方法
  const handleLogin = async () => {
    loginStatus.error = null;
    loginStatus.success = false;

    // 表单验证
    if (loginMethod.value === 'captcha') {
      if (!validatePhone(loginForm.phone)) {
        loginStatus.error = '请输入正确的手机号！';
        return;
      }
      if (!validateCaptcha(loginForm.captcha)) {
        loginStatus.error = '请输入正确的验证码！';
        return;
      }
      await handleCaptchaLogin();
    } else if (loginMethod.value === 'password') {
      if (!validatePhone(loginForm.phone)) {
        loginStatus.error = '请输入正确的手机号！';
        return;
      }
      if (!validatePassword(loginForm.password)) {
        loginStatus.error = '请输入正确的密码！';
        return;
      }
      await handlePasswordLogin();
    } else if (loginMethod.value === 'email') {
      if (!validateEmail(loginForm.email)) {
        loginStatus.error = '请输入正确的电子邮箱！';
        return;
      }
      if (!validatePassword(loginForm.captcha)) {
        loginStatus.error = '请输入正确的密码！';
        return;
      }
      await handleEmailLogin();
    } else if (loginMethod.value === 'wechat') {
      await getWxLoginStatus();
    }
  };

  const sendSmsCaptcha = async () => {
    if (!loginForm.phone) {
      loginStatus.error = '请填写手机号!';
      return;
    }
    if (!validatePhone(loginForm.phone)) {
      loginStatus.error = '请输入正确的手机号！';
      return;
    }
    try {
      phoneCaptchaBtn.disabled = true;
      const response = await authApi.sendSmsCaptcha(loginForm.phone);

      if (successCodes.includes(response.status)) {
        startCountdown(phoneCaptchaBtn);
        loginStatus.error = '';
      } else {
        loginStatus.error = response.message || '发送验证码失败';
        phoneCaptchaBtn.disabled = false;
      }
    } catch (error: any) {
      phoneCaptchaBtn.disabled = false;
      loginStatus.error = error.message || '发送验证码失败，请重试';
    }
  };

  const sendEmailCaptcha = async () => {
    if (!loginForm.email) {
      loginStatus.error = '请输入邮箱';
      return;
    }
    try {
      emailCaptchaBtn.disabled = true;
      const response = await authApi.sendEmailCaptcha(loginForm.email);

      if (successCodes.includes(response.status)) {
        startCountdown(emailCaptchaBtn);
        loginStatus.error = '';
      } else {
        loginStatus.error = response.message || '发送验证码失败';
        emailCaptchaBtn.disabled = false;
      }
    } catch (error: any) {
      emailCaptchaBtn.disabled = false;
      loginStatus.error = error.message || '发送验证码失败，请重试';
    }
  };

  const switchLoginMethod = (method: "captcha" | "password" | "email" | "wechat") => {
    loginMethod.value = method;
    resetLoginForm();
  };

  // 重置登录表单
  const resetLoginForm = () => {
    loginForm.password = '';
    loginForm.captcha = '';
  };

  return {
    loginForm,
    loginStatus,
    phoneCaptchaBtn,
    emailCaptchaBtn,
    handleLogin,
    handleWechatLogin,
    sendSmsCaptcha,
    sendEmailCaptcha,
    switchLoginMethod
  };
};

const useRegister = () => {
  const registerForm = reactive({
    phone: '',
    email: '',
    captcha: ''
  });

  const registerStatus = reactive<RegisterStatus>({
    loading: false,
    error: null,
    success: false
  });

  // 分别创建手机和邮箱验证码按钮
  const registerPhoneCaptchaBtn = reactive<CaptchaButton>({
    text: '发送验证码',
    disabled: false,
    countdown: 60
  });

  const registerEmailCaptchaBtn = reactive<CaptchaButton>({
    text: '发送验证码',
    disabled: false,
    countdown: 60
  });

  // 手机号注册
  const registerByPhone = async () => {
    registerStatus.loading = true;
    registerStatus.error = null;

    try {
      const response = await authApi.registerbyphone({
        phone: registerForm.phone,
        captcha: registerForm.captcha
      });

      if (response.data) {
        handleRegisterSuccess(response.data);
      } else {
        registerStatus.error = response.message || '注册失败';
      }
    } catch (err: any) {
      registerStatus.error = err.response?.data?.message || '注册失败，请检查网络连接';
      console.error('注册失败:', err);
    } finally {
      registerStatus.loading = false;
    }
  };

  // 邮箱注册
  const registerByEmail = async () => {
    registerStatus.loading = true;
    registerStatus.error = null;

    try {
      const response = await authApi.registerbyemail({
        email: registerForm.email,
        captcha: registerForm.captcha
      });

      if (response.data) {
        handleRegisterSuccess(response.data);
      } else {
        registerStatus.error = response.message || '注册失败';
      }
    } catch (err: any) {
      registerStatus.error = err.response?.data?.message || '注册失败，请检查网络连接';
      console.error('注册失败:', err);
    } finally {
      registerStatus.loading = false;
    }
  };

  // 注册成功处理
  const handleRegisterSuccess = (token: string) => {
    localStorage.setItem('token', token);
    registerStatus.success = true;
    registerStatus.error = null;

    const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/index.html';
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  };

  // 主注册方法
  const handleRegister = async () => {
    registerStatus.error = null;
    registerStatus.success = false;

    if (registerMethod.value === 'phone') {
      if (!validatePhone(registerForm.phone)) {
        registerStatus.error = '请输入正确的手机号！';
        return;
      }
      if (!validateCaptcha(registerForm.captcha)) {
        registerStatus.error = '请输入正确的验证码！';
        return;
      }
      await registerByPhone();
    } else if (registerMethod.value === 'email') {
      if (!validateEmail(registerForm.email)) {
        registerStatus.error = '请输入正确的电子邮箱！';
        return;
      }
      if (!validateCaptcha(registerForm.captcha)) {
        registerStatus.error = '请输入正确的验证码！';
        return;
      }
      await registerByEmail();
    }
  };

  // 发送手机注册验证码
  const sendRegisterPhoneCaptcha = async () => {
    if (!registerForm.phone) {
      registerStatus.error = '请输入手机号';
      return;
    }
    if (!validatePhone(registerForm.phone)) {
      registerStatus.error = '请输入正确的手机号！';
      return;
    }
    try {
      registerPhoneCaptchaBtn.disabled = true;
      const response = await authApi.sendSmsCaptcha(registerForm.phone);

      if (successCodes.includes(response.status)) {
        startCountdown(registerPhoneCaptchaBtn);
        registerStatus.error = null;
      } else {
        registerStatus.error = response.message || '发送验证码失败';
        registerPhoneCaptchaBtn.disabled = false;
      }
    } catch (error: any) {
      registerPhoneCaptchaBtn.disabled = false;
      registerStatus.error = error.message || '发送验证码失败，请重试';
    }
  };

  // 发送邮箱注册验证码
  const sendRegisterEmailCaptcha = async () => {
    if (!registerForm.email) {
      registerStatus.error = '请输入邮箱';
      return;
    }

    try {
      registerEmailCaptchaBtn.disabled = true;
      const response = await authApi.sendEmailCaptcha(registerForm.email);

      if (successCodes.includes(response.status)) {
        startCountdown(registerEmailCaptchaBtn);
        registerStatus.error = null;
      } else {
        registerStatus.error = response.message || '发送验证码失败';
        registerEmailCaptchaBtn.disabled = false;
      }
    } catch (error: any) {
      registerEmailCaptchaBtn.disabled = false;
      registerStatus.error = error.message || '发送验证码失败，请重试';
    }
  };

  // 切换注册方式
  const switchRegisterMethod = (method: "phone" | "email") => {
    registerMethod.value = method;
    resetRegisterForm();
  };

  // 重置注册表单
  const resetRegisterForm = () => {
    // registerForm.phone = '';
    // registerForm.email = '';
    registerForm.captcha = '';
  };

  return {
    registerForm,
    registerStatus,
    registerPhoneCaptchaBtn,
    registerEmailCaptchaBtn,
    handleRegister,
    sendRegisterPhoneCaptcha,
    sendRegisterEmailCaptcha,
    switchRegisterMethod
  };
};

const startCountdown = (button: CaptchaButton) => {
  const timer = setInterval(() => {
    button.countdown--;
    button.text = `${button.countdown}s后重新获取`;
    if (button.countdown <= 0 && !button.disabled) {
      clearInterval(timer);
      console.log("timer");
      resetCaptchaButton(button);
    }
  }, 1000);
};

// 重置验证码按钮
const resetCaptchaButton = (button: CaptchaButton) => {
  button.text = '发送验证码';
  button.disabled = false;
  button.countdown = 60;
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

export {
  loginMethod,
  registerMethod,
  qrCodeUrl,
  state,
  useLogin,
  useRegister,
  isLoggedIn,
  redirectIfLoggedIn
};