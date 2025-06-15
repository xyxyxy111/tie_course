<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import MoblieHeader from '@/components/common/MoblieHeader.vue'
import MoblieBottom from '@/components/common/MobileBottom.vue';

import { authApi, userApi } from '@/api/user';
import '../login.css'

const email = ref('')
const formData = ref({
  phone: '',
  captcha: ''
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

// 发送验证码
const sendCaptcha = async () => {
  if (!formData.value.phone) {
    alert('请输入手机号');
    return;
  }

  try {
    captchaBtn.value.disabled = true;
    await authApi.sendCaptcha(formData.value.phone);

    // 倒计时逻辑
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
    alert('验证码发送失败，请重试');
  }
};

// 登录提交
const handleLogin = async () => {
  if (!formData.value.phone || !formData.value.captcha) {
    alert('请填写完整信息');
    return;
  }

  loginStatus.value = {
    loading: true,
    error: null,
    success: false
  };

  try {
    const res = await authApi.loginByCaptcha({
      phone: formData.value.phone,
      captcha: formData.value.captcha
    });

    localStorage.setItem('token', res.data.token);
    loginStatus.value = {
      loading: false,
      error: null,
      success: true
    };

    // 替代路由跳转的方案
    window.location.href = '/dashboard.html'; // 或使用其他页面控制逻辑
  } catch (error) {
    loginStatus.value = {
      loading: false,
      error: '登录失败，请检查验证码',
      success: false
    };
  }
};

</script>

<!-- html -->
<template>
  <IconSprite />
  <MoblieHeader />
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
            <div class="captcha-wrapper">
              <input v-model="formData.captcha" type="text" placeholder="验证码" class="captcha">
              <button type="button" class="send-msg" :disabled="captchaBtn.disabled" @click="sendCaptcha">
                {{ captchaBtn.text }}
              </button>
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
        </form></div>
    </div>
  </div>
  <MoblieBottom />



</template>


<style scoped>
.login-container .content {
  width: 70%;
  max-width: 600px;
}

.login-container .login-form {
  width: 100%;
 
}
</style>