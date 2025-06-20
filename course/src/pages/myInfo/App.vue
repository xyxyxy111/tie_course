<script lang="ts" setup name="App">
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue';
import PCHeader from '@/components/common/PCHeader.vue'
import MobileHeader from '@/components/common/MoblieHeader.vue'
import { useWindowSize } from '@/useWindowSize'
import IconSprite from '@/components/Icon/IconSprite.vue';
import { goToIndex } from '@/components/common/header';
const { width, height } = useWindowSize()

</script>
<template>
  <IconSprite />
  <div class="my-info-container">
    <!-- 侧边栏直接写在父组件中 -->
    <div class="my-info-sidebar">
      <!-- Logo - 跳转到首页 -->
      <div class="sidebar-icon" active-class="active" exact @click="goToIndex()">
        T
      </div>

      <!-- User - 跳转到个人信息 -->
      <router-link to="/my-info/profile" class="sidebar-icon" active-class="active">
        <i class="icon-user">
          <svg width="30" height="30" viewBox="0 0 16 16" fill="#35495e">
            <use href="#mdi--user" />
          </svg>
        </i>
      </router-link>

      <!-- Courses - 跳转到课程页面 -->
      <router-link to="/my-info/courses" class="sidebar-icon" active-class="active">
        <i class="icon-courses">
          <svg width="30" height="30" viewBox="0 0 16 16" fill="#35495e">
    <use href="#ph--video-fill" /> 
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
    </div>

    <!-- 主要内容区 -->
    <div class="my-info-content">

      <router-view />
    </div>
  </div>
</template>

<!-- css -->
<style scoped>
.my-info-container {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏样式 */
.my-info-sidebar {
  width: 80px;
  background:rgb(4, 35, 58);
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
  background: rgb(22,92,145);
}

.sidebar-icon img {
  width: 40px;
  height: 40px;
}

.sidebar-icon i {
  font-size: 24px;
}

/* 内容区样式 */
.my-info-content {
  flex: 1;
  margin-left: 80px;
  /* 与侧边栏宽度一致 */
  padding: 20px;
}

</style>
