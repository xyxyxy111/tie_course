<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import PCBottom from '@/components/common/PCBottom.vue';
import { useWindowSize } from '@/useWindowSize'
import '../signup.css'
const { width, height } = useWindowSize()

const email = ref('')

const sign = () => {
  console.log('sign with:', email.value)
}


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

</script>

<!-- html -->
<template>
  <IconSprite />
  <PCHeader />
  <div class="signup-container">
    <div class="content">
      <div class="sign-image" :style="LImgStyle()">
        <img src="/src/images/login_signup.png" :style="ImgStyle()">
      </div>
      <div class="signup-form">
        <h1>Sign up with email</h1>
        <form @submit.prevent="sign">
          <div class="input-group">
            <input type="text" placeholder="Full Name" name="username">
            <input type="text" placeholder="Email" name="email">
          </div>
          <button type="submit">
            <div class="icon">
              <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
                <use href="#ic--outline-email" />
              </svg> Continue with email
            </div>
          </button>
        </form>
        <p class="login-link">Don't have an account? <a href="/login.html">Login</a></p>
      </div>
    </div>
  </div>
  <PCBottom />



</template>


<style scoped>
.signup-container .content {
  width: 80%;
  max-width: 1200px;
  min-width: 800px;
}

.signup-container .sign-image {
  z-index: 100;
  flex: 1;
  place-items: center;
}

.signup-container .signup-form{
  z-index: 200;
  min-width: 450px;
}
</style>