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

</script>

<!-- html -->
<template>
  <IconSprite />

  <MoblieHeader />
  <div class="content">

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
  <MoblieBottom />



</template>


<style scoped>
.content {
  width: 70%;
}

.login-form {
  width: 50%;
  max-width: 600px;
}

h1 {
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

</style>