<script lang="ts" setup>
import { RouterView, RouterLink} from 'vue-router';
import { toRef,ref,onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import PCBottom from '@/components/common/PCBottom.vue';
import { useWindowSize } from '@/useWindowSize'
import '../login.css'
const { width, height } = useWindowSize()

const email = ref('')

const login = () => {
  console.log('Login with:', email.value)
}

const LImgStyle = () => ({
  width:width.value < 1150?'40%':'50%'
})

const ImgStyle = () => ({
  maskImage: width.value < 1150
    ? 'linear-gradient(to right, black 0%, transparent 100%)'
    : 'none',
  WebkitMaskImage: width.value < 1150
    ? 'linear-gradient(to right, black 0%, transparent 80%)'
    : 'none',
})

</script>

<!-- html -->
<template>
  <IconSprite />

  <PCHeader />
  <div class="content">

    <!-- 左侧图片 -->
    <div class="login-image" :style="LImgStyle()">
      <img src="/src/images/login_signup.png" :style="ImgStyle()">
    </div>

    <!-- 右侧表单 -->
    <div class="login-form">
      <h1>Log in to continue your learning journey</h1>

      <form @submit.prevent="login">
        <div class="input-group">
          <input placeholder="Email">
        </div>
        <button type="submit">
          <div class="icon">
            <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
              <use href="#ic--outline-email" />
            </svg> Continue with email
          </div>
        </button>
      </form>

      <p class="signup-link">Don't have an account? <a href="/signup.html">Sign up</a></p>
    </div>


  </div>
  <PCBottom />



</template>


<style scoped>
.content {
  width: 80%;
  max-width: 1200px;
  min-width: 800px;
}

.login-image {
  z-index:100;
  flex: 1;
  place-items: center;
}

.login-form {
  z-index: 200;
  min-width: 600px;
}

h1 {
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 500;
}

</style>