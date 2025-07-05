<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { authApi, userApi } from '@/api/user';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import '../login.css'
import { useWindowSize } from '@/useWindowSize';
import { successCodes } from '@/utils/request';
import { goToIndex } from '@/components/common/header.ts';

import {
  captchaBtn,
  loginMethod,
  sendCaptcha,
  switchLoginMethod,
  wechatPollingInterval, useFormValidation, useLoginData, loginStatus
} from '../content';

const {
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
} = useLoginData();

const { validateEmail, validatePassword, validateUsername } = useFormValidation();

const { width, height } = useWindowSize()
// 微信登录相关状态
const wxLoginVisible = ref(false);
const wxQrCode = ref<string>('');
const wxLoginStatus = ref<'waiting' | 'scanning' | 'success' | 'error'>('waiting');
const wxState = ref<string>('');


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
  } catch (error) {
    console.error('获取微信二维码失败:', error);
    wxLoginStatus.value = 'error';
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

onMounted(() => {
  redirectIfLoggedIn();
});
</script>

<template>
  <IconSprite />

  <PCHeader />

  <div class="login-container">
    <div class="content">
      <div class="login-image" :style="LImgStyle()">
        <img src="/src/images/login_signup.png" :style="ImgStyle()">
      </div>

      <div class="login-form">
        <h1 v-if="loginMethod !== 'wechat'">登录以继续您的学习之旅</h1>
        <h1 v-if="loginMethod === 'wechat'">请打开微信扫描以下二维码</h1>
        <form @submit.prevent="handleLogin()">
          <div class="input-group">

            <!-- 验证码登录方式 -->
            <div v-if="loginMethod === 'captcha'" class="captcha-wrapper">
              <input v-model="loginForm.phone" placeholder="手机号" class="phone">
              <div class="captcha-input-group">
                <input v-model="loginForm.captcha" type="text" placeholder="验证码" class="captcha">
                <button type="button" class="send-msg" :disabled="captchaBtn.disabled" @click="sendCaptcha">
                  {{ captchaBtn.text }}
                </button>
              </div>
            </div>

            <!-- 密码登录方式 -->
            <div v-if="loginMethod === 'password'" class="password-wrapper">
              <input v-model="loginForm.phone" placeholder="手机号" class="phone">
              <input v-model="loginForm.password" type="password" placeholder="密码" class="password">
            </div>

            <!-- 邮箱登录方式 -->
            <div v-if="loginMethod === 'email'" class="email-wrapper">
              <input v-model="loginForm.phone" placeholder="邮箱" class="email">
              <input v-model="loginForm.email" type="email" placeholder="密码" class="password">
            </div>
          </div>

          <!-- 微信登录方式 -->
          <div v-if="loginMethod === 'wechat'" class="wechat-wrapper">
            <div v-if="wxLoginStatus === 'waiting'" class="qr-code-container">
              <img v-if="wxQrCode" :src="wxQrCode" alt="微信登录二维码" class="qr-code">
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

          <button type="submit" class="login-button" :disabled="loginStatus.loading">
            {{ loginStatus.loading ? '登录中...' : '登录' }}
          </button>

          <div v-if="loginStatus.error" class="error-message">
            {{ loginStatus.error }}
          </div>
          <div v-if="loginStatus.success" class="success-message">
            登录成功，正在跳转...
          </div>


        </form>
        <div class="login-divider">
          <span class="divider-line"></span>
          <span class="divider-text">其它登录选项</span>
          <span class="divider-line"></span>
        </div>

        <div class="login-icons">
          <button v-if="loginMethod !== 'captcha'" class="login-icon-btn" @click="switchLoginMethod(0)">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <use href="#gridicons--phone" />
            </svg>
          </button>
          <button v-if="loginMethod !== 'password'" class=" login-icon-btn" @click="switchLoginMethod(1)">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <use href="#solar--key-bold" />
            </svg>
          </button>
          <button v-if="loginMethod !== 'email'" class="login-icon-btn" @click="switchLoginMethod(2)">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <use href="#ic--outline-email" />
            </svg>
          </button>
          <button v-if="loginMethod !== 'wechat'" class="login-icon-btn wx-icon-btn" @click="switchLoginMethod(3)">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#27b148">
              <use href="#ic--baseline-wechat" />
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped></style>