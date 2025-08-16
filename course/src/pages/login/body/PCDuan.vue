<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, computed } from 'vue';
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
  loginMethod,
  registerMethod, registerForm,
  captchaBtn, registerCaptchaBtn,
  loginStatus, registerStatus,
  switchLoginMethod, switchRegisterMethod,
  qrCodeUrl, state,
  useFormValidation, useLoginData,
  sendCaptcha, sendRegisterCaptcha,
  handleRegister, registerByPhone, registerByEmail
} from '../content';

const {
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
} = useLoginData();

const { width, height } = useWindowSize()
// 微信登录相关状态
const wxLoginVisible = ref(false);
const wxQrCode = ref<string>('');
const wxLoginStatus = ref<'waiting' | 'scanning' | 'success' | 'error'>('waiting');
const wxState = ref<string>('');

// 错误状态
const phoneError = ref("");
const captchaError = ref("");
const emailError = ref("");
const passwordError = ref("");

let iconWidth = ref(26 + (width.value - 1920) / 100)
iconWidth.value = (iconWidth.value > 26) ? iconWidth.value : 26;
const signFlag = ref(false);

function validatePhone() {
  if (!loginForm.phone) {
    phoneError.value = "请输入手机号";
  } else if (!/^1[3-9]\d{9}$/.test(loginForm.phone)) {
    phoneError.value = "请输入正确的手机号！";
  } else {
    phoneError.value = "";
  }
}
function validateCaptcha() {
  if (!loginForm.captcha) {
    captchaError.value = "请输入验证码";
  } else if (!/^\d{6}$/.test(loginForm.captcha)) {
    captchaError.value = "请输入正确的验证码！";
  } else {
    captchaError.value = "";
  }
}
function validateEmail() {
  if (!loginForm.phone) {
    emailError.value = "请输入电子邮箱";
  } else if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(loginForm.phone)) {
    emailError.value = "请输入正确的电子邮箱！";
  } else {
    emailError.value = "";
  }
}
function validatePassword() {
  if (!loginForm.password) {
    passwordError.value = "请输入用户密码";
  } else if (loginForm.password.length < 6) {
    passwordError.value = "请输入正确的密码！";
  } else {
    passwordError.value = "";
  }
}


const openWxLogin = async () => {
  wxLoginVisible.value = true;
  wxLoginStatus.value = 'waiting';
  try {
    const response = await authApi.getWxLoginQrcode();
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
        <h1 v-if="loginMethod !== 'wechat' &&
          !signFlag">登录以继续您的学习之旅</h1>
        <h1 v-if="signFlag">注册以开启您的学习之旅</h1>
        <h1 v-if="loginMethod === 'wechat' && !signFlag">请打开微信扫描以下二维码</h1>
        <form @submit.prevent="handleLogin()" v-if="!signFlag">
          <div class="input-group">

            <!-- 验证码登录方式 -->
            <div v-if="loginMethod === 'captcha'" class="captcha-wrapper">
              <div :class="['form-item', { 'has-error': loginStatus.error && loginStatus.error.includes('手机号') }]">
                <input v-model="loginForm.phone" placeholder="手机号" class="phone" />
                <div v-if="loginStatus.error && loginStatus.error.includes('手机号')" class="error-message">{{
                  loginStatus.error }}</div>
              </div>
              <div :class="['form-item', { 'has-error': loginStatus.error && loginStatus.error.includes('验证码') }]">

                <div class="captcha-input-group">
                  <input v-model="loginForm.captcha" type="text" placeholder="验证码" class="captcha" />
                  <button type="button" class="send-msg" :disabled="captchaBtn.disabled" @click="sendCaptcha">
                    {{ captchaBtn.text }}
                  </button>
                </div>
                <div v-if="loginStatus.error && loginStatus.error.includes('验证码')" class="error-message">{{
                  loginStatus.error }}</div>
              </div>
            </div>

            <!-- 密码登录方式 -->
            <div v-if="loginMethod === 'password'" class="password-wrapper">
              <div :class="['form-item', { 'has-error': loginStatus.error && loginStatus.error.includes('手机号') }]">

                <input v-model="loginForm.phone" placeholder="手机号" class="phone" />
                <div v-if="loginStatus.error && loginStatus.error.includes('手机号')" class="error-message">{{
                  loginStatus.error }}</div>
              </div>
              <div :class="['form-item', { 'has-error': loginStatus.error && loginStatus.error.includes('密码') }]">

                <input v-model="loginForm.password" type="password" placeholder="密码" class="password" />
                <div v-if="loginStatus.error && loginStatus.error.includes('密码')" class="error-message">{{
                  loginStatus.error }}</div>
              </div>
            </div>

            <!-- 邮箱登录方式 -->
            <div v-if="loginMethod === 'email'" class="email-wrapper">
              <div :class="['form-item', { 'has-error': loginStatus.error && loginStatus.error.includes('邮箱') }]">

                <input v-model="loginForm.phone" placeholder="邮箱" class="email" />
                <div v-if="loginStatus.error && loginStatus.error.includes('邮箱')" class="error-message">{{
                  loginStatus.error }}</div>
              </div>
              <div :class="['form-item', { 'has-error': loginStatus.error && loginStatus.error.includes('密码') }]">

                <input v-model="loginForm.email" type="email" placeholder="密码" class="password" />
                <div v-if="loginStatus.error && loginStatus.error.includes('密码')" class="error-message">{{
                  loginStatus.error }}</div>
              </div>
            </div>
          </div>

          <!-- 微信登录方式 -->
          <div v-if="loginMethod === 'wechat'" class="wechat-wrapper">
            <div v-if="qrCodeUrl">
              <img :src="qrCodeUrl" alt="微信登录二维码" />

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

          <div v-if="loginStatus.success" class="success-message">
            登录成功，正在跳转...
          </div>
        </form>
        <form @submit.prevent="handleRegister()" v-else>
          <div class="input-group">

            <div v-if="registerMethod === 'phone'" class="captcha-wrapper">
              <div
                :class="['form-item', { 'has-error': registerStatus.error && registerStatus.error.includes('手机号') }]">
                <input v-model="registerForm.phone" placeholder="手机号" class="phone" />
                <div v-if="registerStatus.error && registerStatus.error.includes('手机号')" class="error-message">
                  {{ registerStatus.error }}
                </div>
              </div>

              <div
                :class="['form-item', { 'has-error': registerStatus.error && registerStatus.error.includes('验证码') }]">
                <div class="captcha-input-group">
                  <input v-model="registerForm.captcha" type="text" placeholder="验证码" class="captcha" />
                  <button type="button" class="send-msg" :disabled="registerCaptchaBtn.disabled"
                    @click="sendRegisterCaptcha">
                    {{ registerCaptchaBtn.text }}
                  </button>
                </div>
                <div v-if="registerStatus.error && registerStatus.error.includes('验证码')" class="error-message">
                  {{ registerStatus.error }}
                </div>
              </div>
            </div>

            <div v-if="registerMethod === 'email'" class="email-wrapper">
              <div :class="['form-item', { 'has-error': registerStatus.error && registerStatus.error.includes('邮箱') }]">
                <input v-model="registerForm.email" placeholder="邮箱" class="email" />
                <div v-if="registerStatus.error && registerStatus.error.includes('邮箱')" class="error-message">
                  {{ registerStatus.error }}
                </div>
              </div>

              <div
                :class="['form-item', { 'has-error': registerStatus.error && registerStatus.error.includes('验证码') }]">
                <div class="captcha-input-group">
                  <input v-model="registerForm.captcha" type="text" placeholder="验证码" class="captcha" />
                  <button type="button" class="send-msg" :disabled="registerCaptchaBtn.disabled"
                    @click="sendRegisterCaptcha">
                    {{ registerCaptchaBtn.text }}
                  </button>
                </div>
                <div v-if="registerStatus.error && registerStatus.error.includes('验证码')" class="error-message">
                  {{ registerStatus.error }}
                </div>
              </div>


            </div>
          </div>

          <button type="submit" class="login-button" :disabled="registerStatus.loading">
            {{ registerStatus.loading ? '注册中...' : '注册' }}
          </button>

          <div v-if="registerStatus.success" class="success-message">
            注册成功，正在跳转...
          </div>
        </form>
        <div class="login-divider">
          <span class="divider-line"></span>
          <span v-if="signFlag" class="divider-text">其它登录选项</span>
          <span v-else class="divider-text">其它注册选项</span>

          <span class="divider-line"></span>
        </div>

        <div class="login-icons">
          <button v-if="(loginMethod !== 'captcha' && !signFlag) || (registerMethod == 'email' && signFlag)"
            class="login-icon-btn" @click="signFlag ? switchRegisterMethod('phone') : switchLoginMethod(0)">
            <svg :width="iconWidth" :height="iconWidth" viewBox="0 0 24 24" fill="none">
              <use href="#gridicons--phone" />
            </svg>
          </button>
          <button v-if="loginMethod !== 'password' && !signFlag" class=" login-icon-btn" @click="switchLoginMethod(1)">
            <svg :width="iconWidth" :height="iconWidth" viewBox="0 0 24 24" fill="none">
              <use href="#solar--key-bold" />
            </svg>
          </button>
          <button v-if="(loginMethod !== 'email' && !signFlag) || (registerMethod == 'phone' && signFlag)"
            class="login-icon-btn" @click="signFlag ? switchRegisterMethod('email') : switchLoginMethod(2)">
            <svg :width="iconWidth" :height="iconWidth" viewBox="0 0 24 24" fill="none">
              <use href="#ic--outline-email" />
            </svg>
          </button>
          <button v-if="loginMethod !== 'wechat' && !signFlag" class="login-icon-btn wx-icon-btn"
            @click="switchLoginMethod(3); handleWechatLogin()">
            <svg :width="iconWidth" :height="iconWidth" viewBox="0 0 24 24" fill="#27b148">
              <use href="#ic--baseline-wechat" />
            </svg>
          </button>
        </div>
        <button @click="signFlag = !signFlag" class="sign-button">
          <div v-if="!signFlag">尚无账户?<p>注册</p>
          </div>
          <div v-else> 登录到其它账户</div>

        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import "@/assets/rem.css";

.wechat-wrapper {
  margin: 0 auto;
  width: 420px;
  height: fit-content;
}

.wechat-wrapper img {
  margin: 0 auto;
  width: 90%;
  height: fit-content;
}
</style>