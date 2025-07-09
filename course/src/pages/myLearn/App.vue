<script lang="ts" setup name="App">
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import PCHeader from '@/components/common/PCHeader.vue'
import MobileHeader from '@/components/common/MoblieHeader.vue'
import { useWindowSize } from '@/useWindowSize'
import IconSprite from '@/components/Icon/IconSprite.vue';
import { goToIndex } from '@/components/common/header';
import './myLearn.css';
import { getCurrentUserId, getValidToken } from '@/utils/request';

const { width, height } = useWindowSize()
const route = useRoute();

// 获取userId - 从token中获取而不是URL
const userId = ref<string | null>(null);

onMounted(() => {
  // 从token获取userId
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  }
  // 暂时不重定向，让页面先能正常加载
});
</script>

<!-- html -->
<template>
  <IconSprite />
  <main>
    <div></div>
    <PCHeader :userId="userId" />
    <div class="container">

      <div class="my-learning-container">
        <!-- 导航栏 -->
        <h1>我的学习</h1>
        <nav class="learning-nav">
          <router-link to="/learning/all-courses" class="nav-link"
            :class="{ active: route.path.includes('all-courses') }">
            所有课程
          </router-link>
          <router-link to="/learning/my-list" class="nav-link" :class="{ active: route.path.includes('my-list') }">
            我的订单
          </router-link>
          <router-link to="/learning/wishlist" class="nav-link" :class="{ active: route.path.includes('wishlist') }">
            心愿单
          </router-link>
          <router-link to="/learning/log" class="nav-link" :class="{ active: route.path.includes('log') }">
            个人日志
          </router-link>
        </nav>
      </div>
    </div>


    <!-- 内容区域 -->
    <div class="learning-content">
      <router-view />
    </div>
  </main>
</template>

<!-- css -->
<style scoped>
.container {
  width: 100%;
  padding-top: 20px;
  background-color: rgb(4, 35, 58);
  min-width: 1000px;

}

.my-learning-container {
  max-width: 1200px;
  min-width: 1000px;
  position: relative;
  margin: 0 auto;
  font-family: '宋体';
}

.my-learning-container h1 {
  color: white;
  padding: 30px 40px;
  font-weight: bolder;
  font-size: 40px;
}

.learning-nav {
  position: relative;
  bottom: 15px;
}

.nav-link {
  padding: 20px 20px 13px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  margin-inline: 5px;
  transition: all 0.3s;
}

.nav-link.active {
  color: white;
  padding: 20px 43px 13px;
  margin-inline: 15px;
  font-weight: bold;
  border-bottom: 8px solid white;
}

.nav-link:hover {
  color: #ccc;
}

.learning-content {
  max-width: 1200px;
  min-width: 1000px;
  margin: 0 auto;
}
</style>
