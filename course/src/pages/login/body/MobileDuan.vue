<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import MoblieHeader from '@/components/common/MoblieHeader.vue'
import MoblieBottom from '@/components/common/MobileBottom.vue';
import '../login.css'
const email = ref('')

const login = () => {
  console.log('Login with:', email.value)
}


const sendMsgBtnText = ref('发送验证码')


</script>

<!-- html -->
<template>
  <IconSprite />
  <MoblieHeader />
  <div class="login-container">
    <div class="content">
      <div class="login-form">
        <h1>Log in to continue your learning journey</h1>
        <form @submit.prevent="login">
          <div class="input-group">
            <input placeholder="电话号码" class="phone-number">
            <input type="text" placeholder="验证码" class="captcha">
            <button class="send-msg">
              {{ sendMsgBtnText }}
            </button>
          </div>
          <button type="submit">
            <div class="icon">
              <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
                <use href="#ic--outline-email" />
              </svg>登录
            </div>
          </button>
        </form>
        <div class="signup-link">没有账号? <a href="/signup.html">注册</a></div>
      </div>
    </div>
  </div>
  <MoblieBottom />



</template>


<style scoped>
.login-container .content {
  width: 70%;
}

.login-container .login-form {
  width: 50%;
  max-width: 600px;
}
</style>