<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { authApi, userApi } from '@/api/user';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import MobileHeader from '@/components/common/MoblieHeader.vue'
import '../login.css'
import { useWindowSize } from '@/useWindowSize';
import { successCodes } from '@/utils/request';
import { goToIndex } from '@/components/common/header.ts';

// 导入共享的数据和逻辑
import { useLoginData, useFormValidation } from '../content';

// 使用共享的数据和逻辑
const {
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
} = useLoginData();

const { validateEmail, validatePassword, validateUsername } = useFormValidation();

// 登录方式：'captcha' | 'password'
const loginMethod = ref<'captcha' | 'password'>('captcha');

// 微信登录相关状态
const wxLoginVisible = ref(false);
const wxQrCode = ref<string>('');
const wxLoginStatus = ref<'waiting' | 'scanning' | 'success' | 'error'>('waiting');
const wxState = ref<string>('');

const formData = ref({
  phone: '',
  captcha: '',
  password: ''
});

// 登录状态反馈
const loginStatus = ref<{
  loading: boolean;
  error: string | null;
  success: boolean;
}>({
  loading: false,
  error: null,
  success: false
});

// 验证码按钮状态
const captchaBtn = ref({
  text: '发送验证码',
  disabled: false,
  countdown: 60
});

// 切换登录方式
const switchLoginMethod = () => {
  loginMethod.value = loginMethod.value === 'captcha' ? 'password' : 'captcha';
  // 清空表单数据
  loginForm.email = '';
  loginForm.password = '';
  // 重置登录状态
  clearError();
  clearSuccess();
  // 重置验证码按钮
  captchaBtn.value = {
    text: '发送验证码',
    disabled: false,
    countdown: 60
  };
};

// 微信登录相关方法
const openWxLogin = async () => {
  wxLoginVisible.value = true;
  wxLoginStatus.value = 'waiting';

  try {
    const response = await authApi.getWxLoginQrcode();
    // 将arraybuffer转换为base64
    const arrayBuffer = response.data as ArrayBuffer;
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64 = btoa(String.fromCharCode(...uint8Array));
    wxQrCode.value = `data:image/png;base64,${base64}`;

    // 开始轮询登录状态
    startWxLoginPolling();
  } catch (error) {
    console.error('获取微信二维码失败:', error);
    wxLoginStatus.value = 'error';
  }
};

const startWxLoginPolling = () => {
  // 这里需要根据实际的后端API调整
  // 假设后端返回的state用于轮询
  const pollInterval = setInterval(async () => {
    try {
      const response = await authApi.getWxLoginStatus(wxState.value);
      if (response.status === 1011) { // 登录成功
        wxLoginStatus.value = 'success';
        clearInterval(pollInterval);

        // 保存token并跳转
        if (response.data && typeof response.data === 'string') {
          localStorage.setItem('token', response.data);
          console.log('微信登录成功，Token已保存');
          setTimeout(() => {
            wxLoginVisible.value = false;
            goToIndex();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('轮询微信登录状态失败:', error);
    }
  }, 2000); // 每2秒轮询一次

  // 5分钟后停止轮询
  setTimeout(() => {
    clearInterval(pollInterval);
    if (wxLoginStatus.value === 'waiting') {
      wxLoginStatus.value = 'error';
    }
  }, 300000);
};

const closeWxLogin = () => {
  wxLoginVisible.value = false;
  wxQrCode.value = '';
  wxLoginStatus.value = 'waiting';
};

// 发送验证码
const sendCaptcha = async () => {
  if (!formData.value.phone) {
    alert('请输入手机号');
    return;
  }

  try {
    captchaBtn.value.disabled = true;
    const response = await authApi.sendCaptcha(formData.value.phone);

    if (successCodes.includes(response.status)) {
      // 开始倒计时
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

// 密码登录
const handleLocalPasswordLogin = async () => {
  if (!formData.value.phone || !formData.value.password) {
    alert('请输入手机号和密码');
    return;
  }

  loginStatus.value.loading = true;
  loginStatus.value.error = null;

  try {
    const response = await authApi.loginByPassword({
      phone: formData.value.phone,
      password: formData.value.password
    });

    if (successCodes.includes(response.status)) {
      // 保存token
      localStorage.setItem('token', response.data);
      loginStatus.value.success = true;

      // 跳转到首页
      setTimeout(() => {
        goToIndex();
      }, 1000);
    } else {
      loginStatus.value.error = response.message || '登录失败';
    }
  } catch (error: any) {
    loginStatus.value.error = error.message || '登录失败，请检查网络连接';
  } finally {
    loginStatus.value.loading = false;
  }
};

// 验证码登录
const handleCaptchaLogin = async () => {
  if (!formData.value.phone || !formData.value.captcha) {
    alert('请输入手机号和验证码');
    return;
  }

  loginStatus.value.loading = true;
  loginStatus.value.error = null;

  try {
    const response = await authApi.loginByCaptcha({
      phone: formData.value.phone,
      captcha: formData.value.captcha
    });

    if (successCodes.includes(response.status)) {
      // 保存token
      localStorage.setItem('token', response.data);
      loginStatus.value.success = true;

      // 跳转到首页
      setTimeout(() => {
        goToIndex();
      }, 1000);
    } else {
      loginStatus.value.error = response.message || '登录失败';
    }
  } catch (error: any) {
    loginStatus.value.error = error.message || '登录失败，请检查网络连接';
  } finally {
    loginStatus.value.loading = false;
  }
};

// 登录提交
const handleLogin = async () => {
  if (loginMethod.value === 'password') {
    await handleLocalPasswordLogin();
  } else {
    await handleCaptchaLogin();
  }
};

onMounted(() => {
  redirectIfLoggedIn();
});
</script>

<!-- html -->
<template>
  <IconSprite />
  <MobileHeader :userId="null" />
  <div class="login-container">
    <div class="content">
      <div class="login-form">
        <h1>Log in to continue your learning journey</h1>
        <div v-if="loginStatus.error" class="error-message">
          {{ loginStatus.error }}
        </div>
        <div v-if="loginStatus.success" class="success-message">
          登录成功，正在跳转...
        </div>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <!-- 验证码登录方式 -->
            <div v-if="loginMethod === 'captcha'" class="captcha-wrapper">
              <input v-model="formData.phone" placeholder="手机号" class="phone">
              <div class="captcha-input-group">
                <input v-model="formData.captcha" type="text" placeholder="验证码" class="captcha">
                <button type="button" class="send-msg" :disabled="captchaBtn.disabled" @click="sendCaptcha">
                  {{ captchaBtn.text }}
                </button>
              </div>
            </div>

            <!-- 密码登录方式 -->
            <div v-else class="password-wrapper">
              <input v-model="formData.phone" placeholder="手机号" class="phone">
              <input v-model="formData.password" type="password" placeholder="密码" class="password">
            </div>
          </div>

          <button type="submit" class="login-btn" :disabled="loginStatus.loading">
            <div class="icon">
              <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
                <use href="#ic--outline-email" />
              </svg>
              {{ loginStatus.loading ? '登录中...' : '登录' }}
            </div>
          </button>

          <!-- 登录方式切换按钮 -->
          <div class="login-method-switch">
            <button type="button" class="switch-btn" @click="switchLoginMethod">
              {{ loginMethod === 'captcha' ? '使用密码登录' : '使用验证码登录' }}
            </button>
            <!-- 微信登录按钮 -->
            <button type="button" class="wx-login-btn" @click="openWxLogin">
              <div class="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#07C160">
                  <use href="#wechat-icon" />
                </svg>
                微信登录
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 微信登录弹窗 -->
    <div v-if="wxLoginVisible" class="wx-login-modal" @click="closeWxLogin">
      <div class="wx-login-content" @click.stop>
        <div class="wx-login-header">
          <h3>微信登录</h3>
          <button class="close-btn" @click="closeWxLogin">×</button>
        </div>

        <div class="wx-login-body">
          <div v-if="wxLoginStatus === 'waiting'" class="qr-code-container">
            <img v-if="wxQrCode" :src="wxQrCode" alt="微信登录二维码" class="qr-code">
            <p class="qr-tip">请使用微信扫描二维码登录</p>
          </div>

          <div v-else-if="wxLoginStatus === 'scanning'" class="status-message">
            <div class="loading-spinner"></div>
            <p>正在验证登录...</p>
          </div>

          <div v-else-if="wxLoginStatus === 'success'" class="status-message">
            <div class="success-icon">✓</div>
            <p>登录成功，正在跳转...</p>
          </div>

          <div v-else-if="wxLoginStatus === 'error'" class="status-message">
            <div class="error-icon">✗</div>
            <p>登录失败，请重试</p>
            <button class="retry-btn" @click="openWxLogin">重新获取二维码</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.login-container .content {
  width: 70%;
  max-width: 600px;
}

.login-container .login-form {
  width: 100%;
}

/* 密码输入框样式 */
.password-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.password-wrapper .phone,
.password-wrapper .password {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.password-wrapper .phone:focus,
.password-wrapper .password:focus {
  border-color: #165c91;
}

/* 验证码输入框样式 */
.captcha-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.captcha-wrapper .phone {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.captcha-wrapper .phone:focus {
  border-color: #165c91;
}

.captcha-input-group {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 15px;
}

.captcha-input-group .captcha {
  width: calc(100% - 130px);
  border-radius: 10px 0px 0px 10px;
  padding: 5px;
  border: 1px solid #ddd;
  height: 50px;
  outline: none;
  margin: 0;
}

.captcha-input-group .send-msg {
  width: 130px;
  margin: 0;
  border-radius: 0px 10px 10px 0px;
  background-color: rgb(22, 92, 145);
  color: white;
  border: none;
  height: 50px;
  cursor: pointer;
}

/* 登录方式切换按钮样式 */
.login-method-switch {
  display: flex;
  margin-top: 20px;
  text-align: center;
  gap: 10px;
}

.switch-btn {
  flex: 1;
  background: none;
  border: none;
  color: #165c91;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.3s ease;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
}

.switch-btn:hover {
  color: #134a7a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 92, 145, 0.1);
}

/* 微信登录按钮样式 */
.wx-login-btn {
  flex: 1;
  height: 50px;
  background-color: white;
  color: #07C160;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.wx-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
}

.wx-login-btn .icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 微信登录弹窗样式 */
.wx-login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.wx-login-content {
  background: white;
  border-radius: 12px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  animation: slideUp 0.3s ease;
}

.wx-login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.wx-login-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #666;
}

.wx-login-body {
  padding: 30px;
  text-align: center;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-code {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.qr-tip {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.status-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #07C160;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.success-icon {
  width: 40px;
  height: 40px;
  background-color: #07C160;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.error-icon {
  width: 40px;
  height: 40px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.retry-btn {
  background-color: #07C160;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #06ad56;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>