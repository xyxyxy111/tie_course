<script lang="ts" setup name="App">
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';
import { toRef, ref, onMounted, watch } from 'vue';
import { defineComponent } from 'vue';
import PCHeader from '@/components/common/PCHeader.vue'
import MobileHeader from '@/components/common/MoblieHeader.vue'
import { useWindowSize } from '@/useWindowSize'
import IconSprite from '@/components/Icon/IconSprite.vue';
import { goToIndex } from '@/components/common/header';
import AllCourse from './views/AllCourse.vue';
import MyList from './views/MyList.vue';
import Wishlist from './views/Wishlist.vue';
import Archived from './views/Archived.vue';
import './myLearn.css';
import { getCurrentUserId, getValidToken } from '@/utils/request';

const router = useRouter();
const route = useRoute();
const { width, height } = useWindowSize()

// 获取userId - 从token中获取而不是URL
const userId = ref<string | null>(null);

onMounted(() => {
  // 从token获取userId
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  } else {
    // 如果没有token，重定向到登录页面
    window.location.href = '/login.html';
  }

  // 检查是否需要重定向
  if (route.path === '/learning') {
    router.push('/learning/all-courses');
  }
});

// 监听路由变化
watch(() => route.path, (newPath) => {
  if (newPath === '/learning') {
    router.push('/learning/all-courses');
  }
});

</script>

<!-- html -->
<template>

  <main>
    <PCHeader :userId="userId" v-if="width > 800" />
    <MobileHeader :userId="userId" v-else />

    <div class="my-learning-container">
      <!-- 导航栏 -->
      <h1>我的学习</h1>
      <nav class="learning-nav">
        <router-link to="/learning/all-courses" class="nav-link"
          :class="{ active: $route.path.includes('all-courses') }">
          所有课程
        </router-link>
        <router-link to="/learning/my-list" class="nav-link" :class="{ active: $route.path.includes('my-list') }">
          我的列表
        </router-link>
        <router-link to="/learning/wishlist" class="nav-link" :class="{ active: $route.path.includes('wishlist') }">
          心愿单
        </router-link>
        <router-link to="/learning/archived" class="nav-link" :class="{ active: $route.path.includes('archived') }">
          已存档
        </router-link>
      </nav>


    </div>
    <!-- 内容区域 -->
    <div class="learning-content">
      <router-view />
    </div>

  </main>

</template>

<!-- css -->
<style scoped>
.my-learning-container {
  max-width: 1200px;
  position: relative;
  top: -30px;
  margin: 0 auto;
  background-color: rgb(4, 35, 58);
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
  ;
  margin-inline: 15px;
  font-weight: bold;
  border-bottom: 8px solid white;
}

.nav-link:hover {}

.learning-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
