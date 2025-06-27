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
  ChangePhoneParams,
  ChangePasswordParams
} from '@/types/user';
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

// 6. 修改手机号
const handleChangePhone = async () => {
  const params: ChangePhoneParams = {
    phone: '13800138000',
    newPhone: '13900139000',
    captcha: '654321'
  };

  try {
    await userApi.changePhone(params);
    console.log('手机号修改成功');
  } catch (error) {
    console.error('修改失败:', error);
  }
};

// 7. 修改密码
const handleChangePassword = async () => {
  const params: ChangePasswordParams = {
    oldPassword: 'oldPassword123',
    newPassword: 'newPassword456'
  };

  try {
    await userApi.changePassword(params);
    console.log('密码修改成功');
  } catch (error) {
    console.error('修改失败:', error);
  }
};

// 8. 获取个人资料
const fetchProfile = async () => {
  try {
    const response = await profileApi.getProfile();
    console.log('个人资料:', response.data);
  } catch (error) {
    console.error('获取资料失败:', error);
  }
};

// 9. 更新个人资料
const updateUserProfile = async () => {
  const params: UserProfile = {
    username: 'newUsername',
    avatarUrl: 'https://example.com/avatar.jpg',
    allowEmailNotify: true
  };

  try {
    await profileApi.updateProfile(params);
    console.log('资料更新成功');
  } catch (error) {
    console.error('更新失败:', error);
  }
};

// 共享的响应式数据
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

// 登录表单数据
const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
});

// 注册表单数据
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

// 共享的登录逻辑
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
      const response = await userApi.login({
        email: loginForm.email,
        password: loginForm.password
      });

      if (response.code === 200) {
        // 保存token
        localStorage.setItem('token', response.data.token);
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

  // 注册
  const handleRegister = async () => {
    if (!registerForm.email || !registerForm.password || !registerForm.confirmPassword || !registerForm.username) {
      error.value = '请填写所有必填字段';
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      error.value = '两次输入的密码不一致';
      return;
    }

    if (!registerForm.agreeToTerms) {
      error.value = '请同意用户协议和隐私政策';
      return;
    }

    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      const response = await userApi.register({
        email: registerForm.email,
        password: registerForm.password,
        username: registerForm.username
      });

      if (response.code === 200) {
        success.value = '注册成功！请登录';
        // 清空注册表单
        Object.assign(registerForm, {
          email: '',
          password: '',
          confirmPassword: '',
          username: '',
          agreeToTerms: false
        });
      } else {
        error.value = response.message || '注册失败';
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '注册失败，请检查网络连接';
      console.error('注册失败:', err);
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
      const response = await userApi.getWechatQrCode();
      if (response.code === 200) {
        wechatQrCode.value = response.data.qrCodeUrl;
        startWechatPolling(response.data.qrCodeId);
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

  // 开始轮询微信登录状态
  const startWechatPolling = (qrCodeId: string) => {
    wechatPollingInterval.value = window.setInterval(async () => {
      try {
        const response = await userApi.checkWechatLoginStatus(qrCodeId);
        if (response.code === 200) {
          const status = response.data.status;

          if (status === 'SCANNED') {
            wechatLoginStatus.value = 'scanning';
          } else if (status === 'CONFIRMED') {
            wechatLoginStatus.value = 'success';
            clearWechatPolling();

            // 保存token
            localStorage.setItem('token', response.data.token);
            success.value = '微信登录成功！';

            // 跳转到首页或之前的页面
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/index.html';
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1000);
          } else if (status === 'EXPIRED') {
            wechatLoginStatus.value = 'expired';
            clearWechatPolling();
          }
        }
      } catch (err) {
        console.error('检查微信登录状态失败:', err);
      }
    }, 2000); // 每2秒检查一次
  };

  // 清除微信登录轮询
  const clearWechatPolling = () => {
    if (wechatPollingInterval.value) {
      clearInterval(wechatPollingInterval.value);
      wechatPollingInterval.value = null;
    }
  };

  // 关闭微信登录弹窗
  const closeWechatLogin = () => {
    showWechatLogin.value = false;
    clearWechatPolling();
    wechatLoginStatus.value = 'waiting';
    wechatQrCode.value = '';
  };

  // 刷新微信二维码
  const refreshWechatQrCode = async () => {
    closeWechatLogin();
    await handleWechatLogin();
  };

  // 清空错误信息
  const clearError = () => {
    error.value = null;
  };

  // 清空成功信息
  const clearSuccess = () => {
    success.value = null;
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
    closeWechatLogin,
    refreshWechatQrCode,
    clearError,
    clearSuccess,
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