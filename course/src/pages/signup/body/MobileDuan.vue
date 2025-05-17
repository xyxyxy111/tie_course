<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import MobileHeader from '@/components/common/MoblieHeader.vue'
import MobileBottom from '@/components/common/MobileBottom.vue';
import '../signup.css'
const email = ref('')

const sign = () => {
  console.log('sign with:', email.value)
}

</script>

<!-- html -->
<template>
  <IconSprite />
  <MobileHeader />
  <div class="signup-container">
    <div class="content">
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
  <MobileBottom />



</template>


<style scoped>
.signup-container .content {
  width: 70%;
}
</style>