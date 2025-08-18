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
import { ref, reactive } from 'vue';
import { getValidToken } from '@/utils/request';
import { successCodes } from '@/utils/request';
import type { RefSymbol } from '@vue/reactivity'; const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const loginForm = reactive({
  phone: '',
  email: '',
  password: '',
  captcha: '',
  rememberMe: false
});

// Registration form state
const registerForm = reactive({
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  agreeTerms: false
});

const registerStatus = ref<{
  loading: boolean;
  error: string | null;
  success: boolean;
}>({
  loading: false,
  error: null,
  success: false
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

const registerCaptchaBtn = ref({
  text: '发送验证码',
  disabled: false,
  countdown: 60
});

const loginMethod = ref("captcha");
const registerMethod = ref("phone"); // 'phone' or 'email'

interface wxQrCode {
  state: string;
  qrCodeUrl: string;
}
const qrCodeUrl = ref('')
const state = ref('')

const useLoginData = () => {
  const validatePhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone);
  const validateCaptcha = (captcha: string) => /^\d{6}$/.test(captcha);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const handleLogin = async () => {
    loginStatus.value.error = null;
    loginStatus.value.success = false;
    // 前端校验
    if (loginMethod.value === 'captcha') {
      if (!validatePhone(loginForm.phone)) {
        loginStatus.value.error = '请输入正确的手机号！';
        return;
      }
      if (!validateCaptcha(loginForm.captcha)) {
        loginStatus.value.error = '请输入正确的验证码！';
        return;
      }
    } else if (loginMethod.value === 'password') {
      if (!validatePhone(loginForm.phone)) {
        loginStatus.value.error = '请输入正确的手机号！';
        return;
      }
      if (!validatePassword(loginForm.password)) {
        loginStatus.value.error = '请输入正确的密码！';
        return;
      }
    } else if (loginMethod.value === 'email') {
      if (!validateEmail(loginForm.phone)) {
        loginStatus.value.error = '请输入正确的电子邮箱！';
        return;
      }
      if (!validatePassword(loginForm.email)) {
        loginStatus.value.error = '请输入正确的密码！';
        return;
      }
    }
    // 校验通过，开始登录
    loginStatus.value.loading = true;
    if (loginMethod.value === 'captcha') {
      await handleCaptchaLogin();
    } else if (loginMethod.value === 'password') {
      await handlePasswordLogin();
    } else if (loginMethod.value === 'email') {
      // 邮箱登录逻辑（如有）
    } else if (loginMethod.value === 'wechat') {
      await getWxLoginStatus();
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
        alert('服务器繁忙，请稍后再试');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '登录失败，请检查网络连接';
      alert('服务器繁忙，请稍后再试');
      console.error('登录失败:', err);
      loginStatus.value.loading = false;
    } finally {
      loading.value = false;
      loginStatus.value.loading = false;
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
        account: loginForm.phone,
        password: loginForm.password
      });
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
      loginStatus.value.loading = false;
    } finally {
      loading.value = false;
    }
  };

  // 微信登录
  const handleWechatLogin = async () => {
    try {
      const res = await authApi.getWxLoginQrcode();
      const data = res.data as wxQrCode;
      if (res.data) {
        qrCodeUrl.value = data.qrCodeUrl;
        state.value = data.state;
      }
    } catch (err) {
      console.error('获取微信登录二维码失败:', err);
      error.value = '获取微信登录二维码失败';
    }
  };

  const getWxLoginStatus = async () => {
    try {
      const res = await authApi.getWxLoginStatus(state.value);

      const data = res.data as string;
      if (res.data) {
        localStorage.setItem('token', data);
        if (loginForm.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        success.value = '登录成功！';
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/index.html';
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      }
    } catch (err) {
      console.error('获取微信登录二维码失败:', err);
      error.value = '获取微信登录二维码失败';
    }
  }

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
    handleLogin,
    handleCaptchaLogin,
    handlePasswordLogin,
    handleWechatLogin,
    getWxLoginStatus,
    isLoggedIn,
    redirectIfLoggedIn
  };
};

const handleRegister = async () => {
  registerStatus.value.error = null;
  registerStatus.value.success = false;
  console.log("register by " + registerMethod.value)
  if (registerMethod.value === 'phone') {
    await registerByPhone();
  } else if (registerMethod.value === 'email') {
    await registerByEmail();
  }
};

const registerByPhone = async () => {
  console.log(registerMethod.value)
  registerStatus.value.loading = true;
  try {
    const response = await authApi.registerbyphone({
      phone: registerForm.phone,
      captcha: registerForm.captcha
    });

    if (response.data) {
      registerStatus.value.success = true;
      success.value = '注册成功！';
      // Auto login after registration
      localStorage.setItem('token', response.data);
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/index.html';
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      registerStatus.value.error = response.message || '注册失败';
    }
  } catch (err: any) {
    registerStatus.value.error = err.response?.data?.message || '注册失败，请检查网络连接';
    console.error('注册失败:', err);
  } finally {
    registerStatus.value.loading = false;
  }
};

const registerByEmail = async () => {

  console.log(registerMethod.value)
  registerStatus.value.loading = true;
  try {
    const response = await authApi.registerbyemail({
      email: registerForm.email,
      captcha: registerForm.captcha
    });

    if (response.data) {
      registerStatus.value.success = true;
      success.value = '注册成功！';
      // Auto login after registration
      localStorage.setItem('token', response.data);
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/index.html';
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      registerStatus.value.error = response.message || '注册失败';
    }
  } catch (err: any) {
    registerStatus.value.error = err.response?.data?.message || '注册失败，请检查网络连接';
    console.error('注册失败:', err);
  } finally {
    registerStatus.value.loading = false;
  }
};

const sendRegisterCaptcha = async () => {
  if (registerMethod.value === 'phone' && !registerForm.phone) {
    alert('请输入手机号');
    return;
  }
  if (registerMethod.value === 'email' && !registerForm.email) {
    alert('请输入邮箱');
    return;
  }

  try {
    registerCaptchaBtn.value.disabled = true;
    const target = registerMethod.value === 'phone' ? registerForm.phone : registerForm.email;
    const response = await authApi.sendSmsCaptcha(target);
    if (successCodes.includes(response.status)) {
      const timer = setInterval(() => {
        registerCaptchaBtn.value.countdown--;
        registerCaptchaBtn.value.text = `${registerCaptchaBtn.value.countdown}s后重新获取`;
        if (registerCaptchaBtn.value.countdown <= 0) {
          clearInterval(timer);
          registerCaptchaBtn.value = {
            text: '发送验证码',
            disabled: false,
            countdown: 60
          };
        }
      }, 1000);
    } else {
      alert(response.message || '发送验证码失败');
      registerCaptchaBtn.value.disabled = false;
    }
  } catch (error: any) {
    registerCaptchaBtn.value.disabled = false;
    alert(error.message || '发送验证码失败，请重试');
  }
};

const sendSmsCaptcha = async () => {
  if (!registerForm.phone && !loginForm.phone) {
    alert('请输入手机号');
    return;
  }
  try {
    captchaBtn.value.disabled = true;
    const response = await authApi.sendSmsCaptcha(registerForm.phone ? registerForm.phone : loginForm.phone);
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

const sendEmailCaptcha = async () => {
  if (!registerForm.email && !loginForm.email) {
    alert('请输入邮箱');
    return;
  }
  try {
    captchaBtn.value.disabled = true;
    const response = await authApi.sendEmailCaptcha(registerForm.email ? registerForm.email : loginForm.email);
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

const switchRegisterMethod = (method: 'phone' | 'email') => {
  registerMethod.value = method;
  registerForm.phone = '';
  registerForm.email = '';
  registerForm.captcha = '';
  registerForm.password = '';
  registerForm.confirmPassword = '';
  registerCaptchaBtn.value = {
    text: '发送验证码',
    disabled: false,
    countdown: 60
  };
};

export {
  loginMethod, loginForm,
  registerMethod, registerForm,
  captchaBtn, registerCaptchaBtn,
  loginStatus, registerStatus,
  switchLoginMethod, switchRegisterMethod,
  qrCodeUrl, state,
  useFormValidation, useLoginData,
  sendSmsCaptcha, sendEmailCaptcha,
  handleRegister, registerByPhone, registerByEmail
}