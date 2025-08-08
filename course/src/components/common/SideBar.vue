<template>
  <!-- 侧边栏容器 -->
  <div class="sidebar-system">
    <!-- 半透明遮罩层 -->
    <transition name="fade">
      <div v-if="isOpen" class="sidebar-backdrop" @click.self="handleBackdropClick" />
    </transition>

    <!-- 侧边栏本体 -->
    <aside class="sidebar-panel" :class="{
      'sidebar-open': isOpen,
      'sidebar-left': position === 'left',
      'sidebar-right': position === 'right'
    }" :style="{ width: `${width}px` }">
      <div class="sidebar-body">
        <ul class="sidebar-content">
          <li v-if="!userId" class="user-section login-section" @click="goToLogin">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>登录</span>
          </li>

          <li v-else class="user-section">
            <div class="user-info">
              <div class="user-header" @click="goToMyInfo">
                <img src="/src/images/userPic.png" alt="用户头像" class="user-avatar">
                <span class="user-id">{{ userId }}</span>
              </div>
              <ul class="user-actions">
                <li @click="goToLearning" class="action-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>我的学习</span>
                </li>
                <li @click="goToWishlist" class="action-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>心愿单</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <ul class="sidebar-content">
          <li class="sidebar-title">Categories</li>
          <template v-for="category in categoryList" :key="category.categoryId">
            <li>
              <button :class="{ active: expandedCategory === category.categoryId }"
                @click="toggleCategory(category.categoryId!)" class="category-btn">
                {{ category.name }}
              </button>
            </li>
            <li v-if="expandedCategory === category.categoryId" class="tags-row">
              <div class="tag-list">
                <button v-for="tag in category.tags" :key="tag.tagId" class="tag-btn"
                  @click="goToCategory(category.categoryId!, tag.tagId)">
                  {{ tag.name }}
                </button>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { goToLogin, goToMyInfo, goToLearning, goToWishlist, categoryList, expandedCategory, toggleCategory, goToCategory, fetchCategories } from './header.ts';
import type { CategoryList } from '@/api/course.ts';
import { categoryApi } from '@/api/course.ts';

const props = defineProps({
  isOpen: Boolean,
  position: {
    type: String,
    default: 'left',
    validator: (v: string) => ['left', 'right'].includes(v)
  },
  width: {
    type: Number,
    default: 260
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  disableScroll: {
    type: Boolean,
    default: true
  },
  userId: String,
})

const emit = defineEmits(['update:isOpen', 'open', 'close'])

const closeSidebar = () => {
  emit('update:isOpen', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnClickOutside) {
    closeSidebar()
  }
}

// 控制页面滚动
watch(() => props.isOpen, (open) => {
  if (props.disableScroll) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
  open ? emit('open') : emit('close')
})

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
/* 遮罩层样式 */
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

/* 侧边栏面板 */
.sidebar-panel {
  padding-top: 10px;
  position: fixed;
  top: 0;
  height: 100vh;
  background: white;
  z-index: 1000;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;

}

.sidebar-left {
  left: 0;
  transform: translateX(-100%);
}

.sidebar-right {
  right: 0;
  transform: translateX(100%);
}

.sidebar-open.sidebar-left {
  transform: translateX(0);
}

.sidebar-open.sidebar-right {
  transform: translateX(0);
}

.sidebar-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-body ul {
  list-style: none;
  padding-left: 0px;
  border-bottom: 0.5px var(--primary-color) solid;
}

.sidebar-body li {
  cursor: pointer;
}

.sidebar-body .sidebar-title {
  font-weight: 700;
  font-size: 1.8rem;
  padding: 15px 0 0px 20px;
  color: var(--text-primary);
}

/* 用户状态区域样式 */
.user-section {
  padding: 15px 20px;
  cursor: pointer;
}

.login-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-section:hover {
  background: var(--primary-gradient-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--primary-color-medium);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-primary);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  border-color: var(--primary-color-hex);
  transform: scale(1.05);
}

.user-id {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.6rem;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  list-style: none;
}

.action-item:hover {
  background: var(--primary-color-light);
  color: var(--primary-color-hex);
  transform: translateX(5px);
}

.category-btn {
  width: 100%;
  padding: 10px 20px;
  font-weight: 400;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s linear;
}

.category-btn:hover {
  background-color: var(--primary-color-light);
}

.category-btn.active {
  font-weight: 600;
  color: var(--primary-color);
  background-color: var(--primary-color-light);
}

/* Tags列表样式 */
.tag-list {
  padding-left: 16px;
  margin-bottom: 8px;
  background: transparent;
  border-top: none;
  list-style: none;
}

.tag-item {
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: none;
}

.tag-item:last-child {
  border-bottom: none;
}

.tag-btn {
  width: 100%;
  margin: 0;
  font-size: 1.4rem;
  padding: 6px 10px;
  color: var(--text-primary);
  border: none;
  text-align: left;
  transition: all 0.2s;
  background: transparent;
  cursor: pointer;
}

.tag-btn:hover {
  background-color: var(--primary-color-light);
  color: var(--primary-color-hex);
}

.tag-btn.active {
  background: var(--primary-color);
  color: var(--text-white);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tags-row {
  background: var(--bg-secondary);
  padding: 8px 0 8px 0;
  border-left: 3px solid var(--primary-color-hex);
  border-radius: 0 6px 6px 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 24px;
}

.tag-btn {
  font-size: 1.4rem;
  padding: 4px 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tag-btn:hover {
  background: var(--primary-color-light);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.tag-btn.active {
  background: var(--primary-color);
  color: var(--text-white);
  border-color: var(--primary-color);
}
</style>
