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
const { width, height } = useWindowSize()

// 登录方式：'captcha' | 'password'
const loginMethod = ref<'captcha' | 'password'>('captcha');

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
  formData.value.captcha = '';
  formData.value.password = '';
  // 重置登录状态
  loginStatus.value = {
    loading: false,
    error: null,
    success: false
  };
  // 重置验证码按钮
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
    const res = await authApi.sendCaptcha(formData.value.phone);
    if (!successCodes.includes(res.status)) {  // 改成 status
      console.log(res.status)
      alert(res.message || '发送验证码失败');
      captchaBtn.value.disabled = false;
      return;
    }
    // 成功，开始倒计时
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
  } catch (error) {
    captchaBtn.value.disabled = false;
    alert(error || '发送验证码失败');
  }
};

// 登录提交
const handleLogin = async () => {
  if (!formData.value.phone) {
    alert('请输入手机号');
    return;
  }

  if (loginMethod.value === 'captcha' && !formData.value.captcha) {
    alert('请输入验证码');
    return;
  }

  if (loginMethod.value === 'password' && !formData.value.password) {
    alert('请输入密码');
    return;
  }

  loginStatus.value = {
    loading: true,
    error: null,
    success: false
  };

  try {
    let res;
    if (loginMethod.value === 'captcha') {
      res = await authApi.loginByCaptcha({
        phone: formData.value.phone,
        captcha: formData.value.captcha
      });
    } else {
      res = await authApi.loginByPassword({
        phone: formData.value.phone,
        password: formData.value.password
      });
    }

    console.log('登录响应:', res);
    console.log('响应状态:', res.status);
    console.log('响应数据:', res.data);

    if (!successCodes.includes(res.status)) {
      loginStatus.value = {
        loading: false,
        error: res.message || '登录失败，请检查输入信息',
        success: false
      };
      return;
    }

    // 修复：token直接是res.data，而不是res.data.token
    if (res.data && typeof res.data === 'string') {
      localStorage.setItem('token', res.data);
      console.log('Token已保存:', res.data);
    } else {
      console.error('登录响应中没有有效的token');
      loginStatus.value = {
        loading: false,
        error: '登录失败：未获取到token',
        success: false
      };
      return;
    }

    loginStatus.value = {
      loading: false,
      error: null,
      success: true
    };
    console.log('登录成功，用户手机号:', formData.value.phone);
    goToIndex(formData.value.phone);
  } catch (error: any) {
    console.error('登录错误:', error);
    loginStatus.value = {
      loading: false,
      error: error?.message || '登录失败，请检查输入信息',
      success: false
    };
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

const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await authApi.logout();
      console.log('登出成功');
    }
    localStorage.removeItem('token');
    console.log('本地token已清除');

    // 重定向到登录页面
    window.location.href = '/login.html';
  } catch (error) {
    console.error('登出失败:', error);
    // 即使API调用失败，也要清除本地token
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  }
};

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
          </div>
        </form>
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
  min-width: 450px;
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