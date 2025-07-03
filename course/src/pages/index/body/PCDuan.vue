<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import HoverPopup from '@/components/common/HoverPopup.vue';
import CartPopup from '@/components/common/CartPopup.vue';
import { goToCart, goToCourse } from '@/components/common/header.ts';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import {
  communityVoices, changeTag,
  categoryTitles,
  tagTitles, changeCategory, useIndexData
} from '../components/content.ts';
import Footer from '@/components/common/Footer.vue';
import Swiper from '../components/Swiper.vue'
const { width, height } = useWindowSize()

const {
  selectedCategoryId, selectedTagId,
  userId,
  courseQuickViews,
  initializeData
} = useIndexData();

onMounted(async () => {
  await initializeData();
  console.log("categoryTitles:" + categoryTitles.value.map(category => category.title));
});
const showCart = ref(false);
const selectedCourse = ref<{ title: string; courseId: number } | null>(null);
function addToCart(course: any) {
  selectedCourse.value = {
    title: course.title,
    courseId: course.courseId
  };
  showCart.value = true;
}

function handleCourseAdded(event: any) {
  console.log('课程已添加到购物车:', event);
  showCart.value = true;
}
</script>

<template>
  <IconSprite />
  <main>
    <CartPopup v-model="showCart" :userId="userId || undefined" :courseName="selectedCourse?.title || ''"
      :courseId="selectedCourse?.courseId || undefined" :style="`width:${width};height:${height}`" />
    <PCHeader :userId="userId" />

    <div id="main-content">
      <Swiper />
      <div class="navigator">
        <h1>将您需要的所有技能集中在一个地方</h1>
        <h2>从关注技能到挑选技术主题，itie 为您的专业发展提供支持。</h2>
        <div class="navigator-btn-group">
          <div v-for="category in categoryTitles" :key="category.id" class="navigator-btn"
            :class="{ active: category.id === selectedCategoryId }" @click="changeCategory(category)">
            {{ category.title }}
          </div>
        </div>
      </div>

      <div class="category-section">
        <div class="category-tabs">
          <div v-for="tag in tagTitles" :key="tag.id" class="category-tab" :class="{ active: tag.id === selectedTagId }"
            @click="changeTag(tag)">
            <div class="category-tab-title">{{ tag.title }}</div>
            <div class="category-tab-desc">1k 以上的学习者</div>
          </div>
        </div>

        <div class="course-slider">

          <div v-for="(courseQuickView, index) in courseQuickViews" class="course-card"
            @mouseenter="courseQuickView.mouseEnter()" @mouseleave="courseQuickView.mouseLeave()">
            <HoverPopup v-model="courseQuickView.hoverFlag" transition="slide" width="300px" height="360px"
              :show-delay="200" :hide-delay="200" class="custom-popup-right" :userId="userId || undefined"
              :courseName="courseQuickView.title" :courseId="courseQuickView.courseId"
              @course-added="handleCourseAdded">
              <template #trigger>
                <div class="popup-trigger-area">
                  <div @click="goToCourse(courseQuickView.courseId)">
                    <img :src="courseQuickView.coverImgUrl" alt="">
                    <div class="course-title">
                      {{ courseQuickView.title }}
                    </div>
                    <div class="course-author">
                      iClass
                    </div>
                    <div class="course-rating">
                      {{ courseQuickView.score }} ★★★★ (2,187)
                    </div>
                    <div class="course-price">
                      ¥{{ courseQuickView.originalPrice.toFixed(2) }}
                    </div>
                  </div>
                </div>
              </template>
            </HoverPopup>
          </div>



          <!-- 右侧箭头按钮 -->
          <button class="slider-arrow">
            <span>›</span>
          </button>
        </div>

        <button class="show-all-btn">显示所有 {{}} 课程</button>


        <div v-for="(courseQuickView, index) in courseQuickViews" class="course-card"
          @mouseenter="courseQuickView.mouseEnter()" @mouseleave="courseQuickView.mouseLeave()">
          <HoverPopup v-model="courseQuickView.hoverFlag" transition="slide" width="300px" height="360px"
            :show-delay="200" :hide-delay="200" class="custom-popup-right" :userId="userId || undefined"
            :courseName="courseQuickView.title" :courseId="courseQuickView.courseId" @course-added="handleCourseAdded">
            <template #trigger>
              <div class="popup-trigger-area">
                <div @click="goToCourse(courseQuickView.courseId)">
                  <img :src="courseQuickView.coverImgUrl" alt="">
                  <div class="course-title">
                    {{ courseQuickView.title }}
                  </div>
                  <div class="course-author">
                    iClass
                  </div>
                  <div class="course-rating">
                    {{ courseQuickView.score }} ★★★★ (2,187)
                  </div>
                  <div class="course-price">
                    ¥{{ courseQuickView.originalPrice.toFixed(2) }}
                  </div>
                </div>
              </div>
            </template>
          </HoverPopup>
        </div>

      </div>


    </div>
    <Footer />
  </main>

</template>

<style scoped>
#main-content {
  margin: 0 auto;
  max-width: 1400px;
}

.navigator {
  margin: 30px auto 0px;
  max-width: 1300px;
}

.navigator h1 {
  font-family: 'PingFangSC-bold', 'PingFang SC', Arial, sans-serif;
  font-style: normal;
  height: 40px;
  color: #101010;
  font-size: 28px;
  font-weight: bold;
  line-height: 39px;
  letter-spacing: auto;
  text-align: left;
  vertical-align: middle;
  display: flex;
  align-items: center;
  margin: 0;
}

#main-content .navigator h2 {
  font-family: 'PingFangSC-regular', 'PingFang SC', Arial, sans-serif;
  font-style: normal;
  height: 40px;
  color: #101010;
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: auto;
  text-align: left;
  vertical-align: middle;
  display: flex;
  align-items: center;
  margin: 0;
}

.navigator-btn-group {
  display: flex;
  gap: 24px;
  margin-top: 18px;
  margin-bottom: 0px;
}

.navigator-btn {
  font-size: 20px;
  font-weight: bold;
  color: #888;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0 8px 4px 8px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.navigator-btn.active,
.navigator-btn:hover {
  color: #101010;
  padding-inline: 20px;
  border-bottom: 3px solid #101010;
  background: none;
}

.category-section {
  background: #f7f7f7;
  border-radius: 0 0 12px 12px;
  padding: 32px 0 48px 0;
  margin: 0 auto;
  max-width: 1300px;
  min-width: 1100px;
}

.category-tabs {
  display: flex;
  justify-content: left;
  gap: 24px;
  margin: 0px 0 32px 30px;
}

.category-tab {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  min-width: 120px;
  padding: 12px 32px;
  border-radius: 40px;
  background: #ededed;
  color: #222;
  font-weight: 500;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  margin-bottom: 8px;
  user-select: none;
}

.category-tab.active {
  background: #222;
  color: #fff;
}

.category-tab-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 2px;
}

.category-tab-desc {
  font-size: 13px;
  color: #fff;
  opacity: 0.8;
  font-weight: normal;
}

.category-tab:not(.active) .category-tab-desc {
  color: #888;
  opacity: 1;
}

.course-slider {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0 auto 16px auto;
  max-width: 1200px;
  min-width: 900px;
}

.course-card {
  position: relative;
  /* 确保弹窗可以相对此容器定位 */
  width: 300px;
  height: 350px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  display: flex;
  flex-direction: column;
  overflow: visible;
  border: 2px solid #e0e0e0;
}

.course-card img {
  width: 100%;
  height: 175px;
  background: #f7f7f7;
  display: flex;
  z-index: inherit;
}

.course-card .course-title {
  font-size: 18px;
  font-weight: bold;
  margin: 12px 20px;
}

.course-author {
  font-size: 12px;
  color: #6a6f73;
  margin: 0px 20px;
}

.course-card .course-rating {
  font-size: 14px;
  color: #F36224;
  font-weight: bold;
  margin: 10px 20px;
}

.course-card .course-price {
  font-size: 16px;
  font-weight: bold;
  margin: 0px 20px;
}

.slider-arrow {
  position: absolute;
  right: -32px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: 2px solid #e5eaf3;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #222;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s, color 0.2s, border 0.2s;
}

.show-all-btn {
  background: #fff;
  color: #165c91;
  border: #165c91  1px solid;
  width: fit-content;
  border-radius: 6px;
  margin-left: 30px;
  padding: 6px 18px;
  font-size: 14px;
  width: 200px;
  height: 40px;
  font-size: 15px;
  cursor: pointer;
  margin-top: 6px;
  transition: all 0.2s;
}

.show-all-btn:hover {
  background: #235e8f12;
}
</style>
