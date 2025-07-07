<script lang="ts" setup name="App">
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue';
import PCHeader from '@/components/common/PCHeader.vue'
import MobileHeader from '@/components/common/MoblieHeader.vue'
import { useWindowSize } from '@/useWindowSize'
import IconSprite from '@/components/Icon/IconSprite.vue';
import { goToIndex } from '@/components/common/header';
import BasicInformation from './views/BasicInformation.vue';
import Communication from './views/Communication.vue';
import Courses from './views/Keys.vue';
import Photo from './views/Photo.vue';
import Privacy from './views/Privacy.vue';
import Profile from './views/Profile.vue';
import './myInfo.css';
import { authApi } from '@/api/user';
import { getCurrentUserId, getValidToken } from '@/utils/request';
const { width, height } = useWindowSize()

const userId = ref<string | null>(null);

onMounted(() => {
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  } else {
    window.location.href = '/login.html';
  }
});

const handleLogout = async () => {
  try {
    await authApi.logout();
    console.log('登出成功');
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  } catch (error) {
    alert('登出失败，请重试');
  }
};
</script>
<template>
  <IconSprite />
  <div class="my-info-container">
    <div class="my-info-sidebar">
      <div class="sidebar-icon" active-class="active" exact @click="goToIndex()">
        T
      </div>

      <router-link to="/my-info/profile" class="sidebar-icon" active-class="active">
        <i class="icon-user">
          <svg width="30" height="30" viewBox="0 0 16 16" fill="#35495e">
            <use href="#mdi--user" />
          </svg>
        </i>
      </router-link>

      <router-link to="/my-info/keys" class="sidebar-icon" active-class="active">
        <i class="icon-courses">
          <svg width="30" height="30" viewBox="0 0 16 16" fill="#35495e">
            <use href="#solar--key-bold" />
          </svg>
        </i>
      </router-link>

      <!-- Communication - 跳转到交流页面 -->
      <router-link to="/my-info/communication" class="sidebar-icon" active-class="active">
        <i class="icon-communication">
          <svg width="30" height="30" viewBox="0 0 16 16" fill="#35495e">
            <use href="#material-symbols--chat-rounded" />
          </svg>
        </i>
      </router-link>

      <button @click="handleLogout"
        style="display: flex; align-items: center; gap: 8px; color: white; background: none; border: none; cursor: pointer; font-size: 16px;">
        <svg width="80" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--logout" />
        </svg>
      </button>
    </div>

    <div class="my-info-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.my-info-container {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏样式 */
.my-info-sidebar {
  width: 80px;
  background: rgb(4, 35, 58);
  position: fixed;
  height: 100vh;
}

.sidebar-icon {
  padding: 25px 5px 12px;
  color: white;
  text-align: center;
  display: block;
  transition: all 0.3s;
}

.sidebar-icon:hover {
  background: rgba(22, 92, 145, 0.6);
}

.sidebar-icon.active {
  background: rgb(22, 92, 145);
}

.sidebar-icon img {
  width: 40px;
  height: 40px;
}

.sidebar-icon i {
  font-size: 24px;
}

.my-info-sidebar button {
  margin: 0 auto;
  width: 80px;
  height: 76px;
}


/* 内容区样式 */
.my-info-content {
  flex: 1;
  margin-left: 80px;
  /* 与侧边栏宽度一致 */
  padding: 20px;
}
</style>
