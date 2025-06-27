<template>
  <IconSprite />
  <div class="header">
    <div :style="headerSpaceStyle"></div>
    <div id="logo" :style="headerButtonStyle" @click="goToIndex()">Course</div>
    <div :style="headerSpaceStyle"></div>
    <div class="explore">
      <button @mouseenter="handleExploreEnter" @mouseleave="handleExploreLeave" class="explore-button">Explore</button>

      <!-- 直接使用div实现浮窗，不使用HoverPopup组件 -->
      <div v-if="exploreHoverFlag" class="explore-popup" @mouseenter="handlePopupEnter" @mouseleave="handlePopupLeave">
        <div class="explore-popup-content">
          <div class="categories-list">
            <div v-for="category in categoryList" :key="category.categoryId" class="category-item"
              @mouseenter="handleCategoryHover(category)" @mouseleave="handleCategoryLeave">
              <div class="category-content">
                <span class="category-name">{{ category.name }}</span>
              </div>
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
    <div :style="headerSpaceStyle" v-if="!userId"></div>
    <button @click="goToCart()">
      <div class="icon">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#mdi--cart-outline" />
        </svg>
      </div>
    </button>


    <button v-if="!userId" :style="headerButtonStyle2" @click="goToLogin">Login</button>

    <div v-if="userId" :style="headerButtonStyle">
      <img src="/src/images/userPic.png" alt="" @click="goToMyInfo()">
    </div>

  </div>

</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'
import { ref, computed, onMounted } from 'vue'
import IconSprite from '../Icon/IconSprite.vue';
import './header.css'
import { searchQuery, Search, goToCart, goToIndex, goToMyInfo, goToLogin, goToLearning, goToCourse } from './header.ts';
import type { CategoryList } from '@/api/course.ts';
import { categoryApi } from '@/api/course.ts';

const exploreHoverFlag = ref(false)
const hoveredCategory = ref<any>(null)
const tagsHoverFlag = ref(false)
let exploreHideTimer: number | null = null


const categoryList = ref<CategoryList[]>([]);
onMounted(async () => {
  const categoriesResponse = await categoryApi.getAllCategories();
  categoryList.value = categoriesResponse.data;
  console.log(categoryList);
  categoryList.value.map(async category => {
    const TagResponse = await categoryApi.getTagListByCategoryId(category.categoryId!);
    category.tags = TagResponse.data;
  });

});


// 处理分类hover
const handleCategoryHover = (category: any) => {
  hoveredCategory.value = category
}

// 处理分类离开
const handleCategoryLeave = () => {
  if (!tagsHoverFlag.value) {
    hoveredCategory.value = null
  }
}

// 处理tags浮窗hover
const handleTagsHover = () => {
  tagsHoverFlag.value = true
}

// 处理tags浮窗离开
const handleTagsLeave = () => {
  tagsHoverFlag.value = false
  hoveredCategory.value = null
}

// 跳转到分类页面
const goToCategory = (categoryId: number, tagId?: number) => {
  const params = tagId ? `?category=${categoryId}&tag=${tagId}` : `?category=${categoryId}`
  window.location.href = `/course.html${params}`
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


const goToWishlist = () => {
  window.location.href = "/learning.html#/learning/wishlist";
};

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
  }, 150) // 150ms延迟
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
  }, 150) // 150ms延迟
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
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #eee;
  z-index: 1000;
  margin-top: 8px;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
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
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.category-item {
  position: relative;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-inline: 0;
}

.category-item:hover {
  background-color: #f8f9fa;
}

.category-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* Tags浮窗样式 */
.tags-popup {
  position: absolute;
  left: 100%;
  top: 0;
  width: 270px;
  background: white;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #eee;
  border-left: none;
  z-index: 1000;
  padding: 16px;
  animation: fadeIn 0.2s ease-in-out;
}

.tags-header {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.tags-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tag-item {
  position: relative;
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  user-select: none;
}

.tag-item:hover {
  background-color: #f8f9fa;
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