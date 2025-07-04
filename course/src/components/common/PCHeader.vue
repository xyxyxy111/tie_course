<template>
  <IconSprite />
  <div class="header">
    <div :style="headerSpaceStyle"></div>
    <div id="logo" :style="headerButtonStyle" @click="goToIndex()">
      <img src="/src/images/itie_logo.png" alt="">
    </div>
    <div :style="headerSpaceStyle"></div>
    <div class="explore">
      <button @mouseenter="handleExploreEnter" @mouseleave="handleExploreLeave" class="explore-button">探索</button>

      <div v-if="exploreHoverFlag" class="explore-popup" @mouseenter="handlePopupEnter" @mouseleave="handlePopupLeave">
        <div class="explore-popup-content">
          <div class="categories-list">
            <div v-for="category in categoryList" :key="category.categoryId" class="category-item"
              @mouseenter="handleCategoryHover(category)" @mouseleave="handleCategoryLeave">
              <div class="category-content">
                <span class="category-name">{{ category.name }}</span>
              </div>
              <div class="category-arrow">→</div>
              <div v-if="hoveredCategory?.categoryId === category.categoryId" class="tags-popup"
                @mouseenter="handleTagsHover" @mouseleave="handleTagsLeave">
                <div class="tags-list">
                  <span v-for="tag in category.tags" :key="tag.tagId" class="tag-item"
                    @click="goToCategory(category.categoryId!, tag.tagId)">
                    {{ tag.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <input v-model="searchQuery" type="text" placeholder="Find your course by skill,topic,or instructor"
      :style="headerSearchInputStyle" @keyup.enter="Search">
    <button style="margin-inline: 0;">
      <div class="icon" @click="Search">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--search" />
        </svg>
      </div>
    </button>

    <button v-if="userId" :style="headerButtonStyle" @click="goToLearning">
      我的学习
    </button>
    <button v-if="userId" @click="goToWishlist">

      <div class="icon">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#line-md--heart-filled" />
        </svg>
      </div>


    </button>
    <div :style="headerSpaceStyle2" v-if="!userId"></div>
    <button @click="goToCart()">
      <div class="icon">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#mdi--cart-outline" />
        </svg>
      </div>
    </button>


    <button v-if="!userId" :style="headerButtonStyle2" @click="goToLogin">登录</button>

    <div v-if="userId" :style="headerButtonStyle">
      <img src="/src/images/userPic.png" alt="" @click="goToMyInfo()">
    </div>

  </div>

</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import IconSprite from '../Icon/IconSprite.vue'
import './header.css'
import {
  goToLogin, goToMyInfo, goToLearning, goToWishlist,
  categoryList, expandedCategory, toggleCategory,
  goToCategory, fetchCategories, goToIndex, goToCart, Search, searchQuery
} from './header.ts';
import type { CategoryList } from '@/api/course.ts';
import { categoryApi } from '@/api/course'

const exploreHoverFlag = ref(false)
const hoveredCategory = ref<any>(null)
const tagsHoverFlag = ref(false)
let exploreHideTimer: number | null = null
let categoryHideTimer: number | null = null
let tagsHideTimer: number | null = null

onMounted(async () => {
  await fetchCategories();
});

// 清理定时器
onUnmounted(() => {
  if (exploreHideTimer) {
    clearTimeout(exploreHideTimer)
  }
  if (categoryHideTimer) {
    clearTimeout(categoryHideTimer)
  }
  if (tagsHideTimer) {
    clearTimeout(tagsHideTimer)
  }
});

// 处理分类hover
const handleCategoryHover = (category: any) => {
  if (categoryHideTimer) {
    clearTimeout(categoryHideTimer)
    categoryHideTimer = null
  }
  hoveredCategory.value = category
}

// 处理分类离开
const handleCategoryLeave = () => {
  if (!tagsHoverFlag.value) {
    categoryHideTimer = setTimeout(() => {
      hoveredCategory.value = null
    }, 200) // 200ms延迟
  }
}

// 处理tags浮窗hover
const handleTagsHover = () => {
  if (tagsHideTimer) {
    clearTimeout(tagsHideTimer)
    tagsHideTimer = null
  }
  tagsHoverFlag.value = true
}

// 处理tags浮窗离开
const handleTagsLeave = () => {
  tagsHideTimer = setTimeout(() => {
    tagsHoverFlag.value = false
    hoveredCategory.value = null
  }, 300) // 300ms延迟
}


const { width, height } = useWindowSize()
const headerSpaceWidth = computed(() => Math.max(0, (width.value - 200) / 2800));
const headerSearchInputWidth = computed(() => Math.max(0, (width.value - 1200) / 300));
const headerButtonPadding = computed(() => {
  const calculatedValue = (width.value - 800) / 1700;
  return Math.min(3, Math.max(1, calculatedValue));
});
const headerSpaceStyle = computed(() => ({
  width: `calc(3vw * ${headerSpaceWidth.value})`,
  transition: 'none'
}));

const headerSpaceStyle2 = computed(() => ({
  width: `calc(8vw *( ${headerSpaceWidth.value}))`,
  transition: 'none',
  minWidth: '40px'
}));

const headerSearchInputStyle = computed(() => ({
  width: `clamp(30vw, calc(40vw + 10vw * ${headerSearchInputWidth.value}), 50vw)`,
  transition: 'none'
}));

const headerButtonStyle = computed(() => ({
  paddingInline: `calc(2vw * ${headerButtonPadding.value})`,
  transition: 'none'
}));

const headerButtonStyle2 = computed(() => ({
  paddingInline: `calc(5vw * ${headerButtonPadding.value})`,
  transition: 'none'
}));



defineProps<{
  userId: string | null
}>()


// 处理explore按钮hover
const handleExploreEnter = () => {
  if (exploreHideTimer) {
    clearTimeout(exploreHideTimer)
    exploreHideTimer = null
  }
  exploreHoverFlag.value = true
}

const handleExploreLeave = () => {
  exploreHideTimer = setTimeout(() => {
    exploreHoverFlag.value = false
    hoveredCategory.value = null
    tagsHoverFlag.value = false
  }, 800)
}

// 处理浮窗hover
const handlePopupEnter = () => {
  if (exploreHideTimer) {
    clearTimeout(exploreHideTimer)
    exploreHideTimer = null
  }
}

const handlePopupLeave = () => {
  exploreHideTimer = setTimeout(() => {
    exploreHoverFlag.value = false
    hoveredCategory.value = null
    tagsHoverFlag.value = false
  }, 500) // 增加到500ms延迟，给用户更多时间移动到子菜单
}

</script>


<style>
.header {
  overflow: visible;
  margin-bottom: 30px;
  height: 80px;
  min-width: 1000px;
}

#logo {
  font-size: 32px;
  width: 100px;
  padding: 0 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

input {
  position: relative;
  top: -3%;
  height: 50px;
  margin-left: 1%;
}

button {
  height: 50px;
  font-size: 16px;
  width: 4%;
  font-weight: 600;
}

button .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.explore {
  position: relative;
  height: 50px;
  display: block;
  justify-items: center;
  width: 155px;
  line-height: 0px;
}

.explore-button {
  position: relative;
  top: 0%;
  display: block;
  width: 105px;
}

img {
  height: 50px;
  cursor: pointer;
}

.explore-popup {
  position: absolute;
  top: 100%;
  left: 0;
  width: 270px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  z-index: 1000;
  margin-top: 8px;
  animation: fadeIn 0.3s ease-out;
}


.explore-popup-content {
  padding: 16px 0;
  background: white;
  border-radius: 8px;
  position: relative;
  overflow: visible;
}

.explore-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding: 0 20px 16px 20px;
  border-bottom: 1px solid #eee;
}

.explore-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.category-item,
.tag-item {
  position: relative;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2px 0px;
}

.category-item:hover,
.tag-item:hover {
  background: linear-gradient(105deg, white 70%, rgba(22, 92, 145, 0.2) 100%);
  color: #495057;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-item:hover .category-name {
  color: #495057;
}

.category-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.category-icon {
  font-size: 16px;
  opacity: 0.7;
  transition: all 0.3s;
}

.category-item:hover .category-icon {
  opacity: 1;
  transform: scale(1.1);
}

.category-arrow {
  font-size: 16px;
  color: #999;
  transition: all 0.3s;
  opacity: 0.6;
}

.category-item:hover .category-arrow {
  color: #6c757d;
  opacity: 1;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: color 0.3s ease;
}

.tags-popup {
  position: absolute;
  left: 100%;
  top: 0;
  width: 280px;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-left: none;
  z-index: 1000;
  padding: 0px;
}

.tags-header {
  margin-bottom: 16px;
  padding-bottom: 8px;
}

.tags-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  text-align: center;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}


/* 响应式设计 - 修复重叠问题 */
@media (max-width: 1200px) {
  .header {
    min-width: 900px;
    padding: 0 20px;
  }

  #logo {
    width: 80px;
    font-size: 28px;
    padding: 0 8px;
  }

  .explore {
    width: 120px;
  }

  .explore-button {
    width: 90px;
    font-size: 14px;
  }
}

@media (max-width: 1000px) {
  .header {
    min-width: 800px;
    padding: 0 15px;
  }

  #logo {
    width: 70px;
    font-size: 24px;
    padding: 0 6px;
  }

  .explore {
    width: 100px;
  }

  .explore-button {
    width: 80px;
    font-size: 13px;
  }
}

@media (max-width: 900px) {
  .header {
    min-width: 700px;
    padding: 0 10px;
  }

  #logo {
    width: 60px;
    font-size: 20px;
    padding: 0 5px;
  }

  .explore {
    width: 90px;
  }

  .explore-button {
    width: 70px;
    font-size: 12px;
  }
}
</style>