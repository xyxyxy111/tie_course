<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { authApi, userApi } from '@/api/user';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize'
import { goToIndex } from '@/components/common/header.ts'
import '../login.css'
import axios from 'axios';
import { successCodes } from '@/utils/request';

// 导入共享的数据和逻辑
import { useLoginData, useFormValidation } from '../content';

const { width, height } = useWindowSize()

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
  captchaBtn.value = {
    text: '发送验证码',
    disabled: false,
    countdown: 60
  };
};

const sendCaptcha = async () => {
  if (!formData.value.phone) {
    alert('请输入手机号');
    return;
  }
  captchaBtn.value.disabled = true;
  try {
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
    alert(error.message || '发送验证码失败');
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

const LImgStyle = () => ({
  width: width.value < 1150 ? '40%' : '50%'
})

const ImgStyle = () => ({
  maskImage: width.value < 1150
    ? 'linear-gradient(to right, black 0%, transparent 100%)'
    : 'none',
  WebkitMaskImage: width.value < 1150
    ? 'linear-gradient(to right, black 0%, transparent 80%)'
    : 'none',
})

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

onMounted(() => {
  redirectIfLoggedIn();
});
</script>

<!-- html -->
<template>
  <IconSprite />

  <PCHeader :userId="null" />
  <div class="login-container">
    <div class="content">
      <div class="login-image" :style="LImgStyle()">
        <img src="/src/images/login_signup.png" :style="ImgStyle()">
      </div>
      <div class="login-form">
        <h1>登录以继续您的学习之旅</h1>
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

          <button type="submit" class="login-button" :disabled="loginStatus.loading">
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
            <button type="button" class="wx-login-btn" @click="handleWechatLogin">
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
  width: 80%;
  max-width: 1200px;
  min-width: 800px;
}

.login-container .login-image {
  z-index: 100;
  flex: 1;
  place-items: center;
}

.login-container .login-image img {
  width: 100%;
  height: fit-content;
}

.login-container .login-form {
  z-index: 200;
  width: 460px;
  height: 468px;
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
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.password-wrapper .phone:focus,
.password-wrapper .password:focus {
  border-color: var(--primary-color-hex);
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
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.captcha-wrapper .phone:focus {
  border-color: var(--primary-color-hex);
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
  border: 1px solid var(--border-secondary);
  height: 50px;
  outline: none;
  margin: 0;
}

.captcha-input-group .send-msg {
  width: 130px;
  margin: 0;
  border-radius: 0px 10px 10px 0px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  height: 50px;
  cursor: pointer;
}

.login-method-switch {
  display: flex;
  margin-top: 20px;
  text-align: center;
}

.switch-btn {
  width: 40%;
  background: none;
  border: none;
  color: var(--primary-color-hex);
  font-size: 14px;
  margin-inline: 8%;
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.3s ease;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
}

.switch-btn:hover {
  color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--primary-color-light);
}

/* 微信登录按钮样式 */
.wx-login-btn {
  width: 40%;
  height: 50px;
  background-color: white;
  color: var(--wechat-color);
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
  background: var(--bg-overlay);
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
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light);
}

.wx-login-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-light);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.wx-login-body {
  padding: 24px;
}

.qr-code-container {
  text-align: center;
}

.qr-code {
  width: 200px;
  height: 200px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  margin-bottom: 16px;
}

.qr-tip {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
}

.status-message {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #07C160;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.success-icon {
  width: 40px;
  height: 40px;
  background: #07C160;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin: 0 auto 16px;
}

.error-icon {
  width: 40px;
  height: 40px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin: 0 auto 16px;
}

.retry-btn {
  background: #07C160;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #06AD56;
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
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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