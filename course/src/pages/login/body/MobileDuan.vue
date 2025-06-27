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
  if (!loginForm.email) {
    alert('请输入邮箱');
    return;
  }

  try {
    captchaBtn.value.disabled = true;
    // TODO: 实现发送验证码逻辑
    alert('验证码发送功能待实现');
    captchaBtn.value.disabled = false;
  } catch (error) {
    captchaBtn.value.disabled = false;
    alert('验证码发送失败，请重试');
  }
};

// 登录提交
const handleLogin = async () => {
  if (loginMethod.value === 'password') {
    await handlePasswordLogin();
  } else {
    // TODO: 实现验证码登录逻辑
    alert('验证码登录功能待实现');
  }
};

onMounted(() => {
  redirectIfLoggedIn();
});
</script>

<!-- html -->
<template>
  <IconSprite />
  <MobileHeader :userId="userId" />
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
            <input v-model="formData.phone" placeholder="电话号码" class="phone-number">

            <!-- 验证码登录方式 -->
            <div v-if="loginMethod === 'captcha'" class="captcha-wrapper">
              <input v-model="formData.captcha" type="text" placeholder="验证码" class="captcha">
              <button type="button" class="send-msg" :disabled="captchaBtn.disabled" @click="sendCaptcha">
                {{ captchaBtn.text }}
              </button>
            </div>

            <!-- 密码登录方式 -->
            <div v-else class="password-wrapper">
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
  align-items: center;
  margin-top: 15px;
}

.password {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.password:focus {
  border-color: #165c91;
}

/* 登录方式切换按钮样式 */
.login-method-switch {
  margin-top: 20px;
  text-align: center;
}

.switch-btn {
  background: none;
  border: none;
  color: #165c91;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
  padding: 8px 16px;
  border-radius: 4px;
}

.switch-btn:hover {
  color: #134a7a;
  background-color: rgba(22, 92, 145, 0.1);
}
</style>