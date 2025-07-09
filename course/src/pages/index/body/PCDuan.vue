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
  mylist, hottestCourseQuickViews, hottestCourseList,
  communityVoices, changeTag,
  categoryTitles, selectedCategoryTitle,
  tagTitles, changeCategory, useIndexData
} from '../components/content.ts';
import Footer from '@/components/common/Footer.vue';
import Swiper from '../components/Swiper.vue'
const { width, height } = useWindowSize()

const {
  selectedCategoryId, selectedTagId,
  userId, userInfo,
  courseQuickViews,
  initializeData
} = useIndexData();

onMounted(async () => {
  await initializeData();
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

const currentIndex = ref(0)
const itemsPerPage = 4;
const displayCourses = computed(() => {
  return courseQuickViews.value.slice(currentIndex.value, currentIndex.value + itemsPerPage)
});
function Prev() {
  if (currentIndex.value > 0) {
    currentIndex.value -= itemsPerPage;
  }
}
function Next() {
  if (currentIndex.value < courseQuickViews.value.length - itemsPerPage) { currentIndex.value += itemsPerPage; }
}
const PrevButtonStyle = computed(() => ({
  opacity: currentIndex.value > 0 ? '1' : '0.5'
}));

const NextButtonStyle = computed(() => ({
  opacity: currentIndex.value < courseQuickViews.value.length - itemsPerPage
    ? '1' : '0.5'
}));

const courseSliderStyle = computed(() => ({
  left: `calc(${currentIndex.value} * -320px)`
}));


</script>

<template>
  <IconSprite />
  <main>
    <CartPopup v-model="showCart" :userId="userId || undefined" :courseName="selectedCourse?.title || ''"
      :courseId="selectedCourse?.courseId || undefined" :style="`width:${width};height:${height}`" />
    <PCHeader />

    <div id="main-content">
      <div v-if="userId" class="user">
        <span><img :src="userInfo.avatarUrl" alt=""></span>
        <span class="welcome">
          欢迎回来,{{ userInfo.username }}
        </span>
      </div>
      <Swiper />
      <!-- 未登录 -->
      <div v-if="!userId" class="navigator">
        <h1>将您需要的所有技能集中在一个地方</h1>
        <h2>从关注技能到挑选技术主题，itie 为您的专业发展提供支持。</h2>
        <div class="navigator-btn-group">
          <div v-for="category in categoryTitles" :key="category.id" class="navigator-btn"
            :class="{ active: category.id === selectedCategoryId }" @click="changeCategory(category); currentIndex = 0">
            {{ category.title }}
          </div>
        </div>
      </div>
      <div v-if="!userId" class="category-section">
        <div class="category-tabs">
          <div v-for="tag in tagTitles" :key="tag.id" class="category-tab" :class="{ active: tag.id === selectedTagId }"
            @click="changeTag(tag); currentIndex = 0">
            <div class="category-tab-title">{{ tag.title }}</div>
            <div class="category-tab-desc">1k 以上的学习者</div>
          </div>
        </div>
        <div class="course-slider-container">
          <button class="button-prev" :style="PrevButtonStyle" @click="Prev">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <use href="#grommet-icons--previous" />
              </svg>
            </span>
          </button>
          <div class="course-slider" :style="courseSliderStyle">
            <div v-for="(course, index) in courseQuickViews" class="course-card" @mouseenter="course.mouseEnter()"
              @mouseleave="course.mouseLeave()">
              <HoverPopup v-model="course.hoverFlag" transition="slide" width="300px" height="360px" :index="index"
                :show-delay="200" :hide-delay="200" :userId="userId || undefined" :courseName="course.title"
                :courseId="course.courseId" @course-added="handleCourseAdded">
                <template #trigger>
                  <div>
                    <div @click="goToCourse(course.courseId)">
                      <img :src="course.coverImgUrl" alt="">
                      <div class="course-title">
                        {{ course.title }}
                      </div>
                      <div class="course-author">
                        iClass
                      </div>
                      <div class="course-rating">
                        {{ course.score }} ★★★★★ (2,187)
                      </div>
                      <div class="course-price">
                        ¥{{ course.originalPrice }}
                      </div>
                      <div class="cart-tag">热门课程</div>
                    </div>
                  </div>
                </template>
              </HoverPopup>
            </div>
          </div>
          <button class="button-next" :style="NextButtonStyle" @click="Next">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <use href="#ooui--next-ltr" />
              </svg>
            </span>
          </button>
        </div>
        <button class="show-all-btn">显示所有 {{ selectedCategoryTitle }} 课程</button>



      </div>
      <!-- 已登录 -->
      <div v-if="userId" class="start-section">
        <div class="start-header">
          <h1>开始学习吧</h1>
          <h3>我的学习</h3>
        </div>
        <div class="mylearn-course-item-container">
          <div v-for="course in mylist" :key="course.courseId" class="mylearn-course-item">
            <div class="mylearn-course-cover">
              <img :src="course.coverImgUrl" />
            </div>
            <div class="mylearn-course-info">
              <div class="mylearn-course-title">
                {{ course.title }}
              </div>
              <div class="mylearn-course-author">iClass</div>
              <div class="mylearn-progress-bar">
                <div class="mylearn-progress-inner" :style="{ width: (course.watchProgress * 100) + '%' }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 
      <div v-if="userId" class="next-section">
        <h2 class="next-title">下一步要学习什么</h2>
        <div class="next-cards-row">
          <div class="next-card" v-for="(course, idx) in courseList" :key="idx">
            <div class="next-card-cover">
              <img :src="course.coverImgUrl" alt="课程封面" />
            </div>
            <div class="next-card-content">
              <div class="next-card-title">{{ course.title }}</div>
              <div class="next-card-author">iClass</div>
              <div class="next-card-rating">
                <span class="next-card-score">4.9</span>
                <span class="next-card-stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= 5 }">★</span>
                </span>
                <span class="next-card-count">(1,025)</span>
              </div>
              <div class="next-card-price">￥19.99</div>
              <div class="next-card-tag">热门课程</div>
            </div>
          </div>
        </div>
      </div> -->

      <div v-if="userId" class="recommend-section">
        <h2 class="recommend-title">为您精心挑选的课程</h2>
        <div class="recommend-card">
          <div class="recommend-card-cover">
            <img :src="hottestCourseList[0]?.coverImgUrl" alt="课程封面" />
          </div>
          <div class="recommend-card-content">
            <div class="recommend-card-title">{{ hottestCourseList[0]?.title }}</div>
            <div class="recommend-card-desc">
              超过40小时的内容，学习Python语法、程式逻辑、识别Python资料类型与使用，用正规表达式处理资料、处理文件系统、通用Python网络爬虫、链接SQL数据库、处理Excel和Csv、发送Email，一步步成为Python达人！
            </div>

            <div class="recommend-card-meta-label">讲师：iClass</div>
            <div class="recommend-card-meta">
              <span class="recommend-card-meta-link">上次更新日期：2025年6月</span>
              <span class="recommend-card-meta-label">总时长：</span>45小时28分
              <span class="recommend-card-meta-label">24个章节</span>
              <span class="recommend-card-meta-label">213个讲解</span>
            </div>
            <div class="recommend-card-rating">
              <span class="recommend-card-score">4.9</span>
              <span class="recommend-card-stars">
                <span v-for="i in 5" :key="i" class="star filled">★</span>
              </span>
              <span class="recommend-card-count">(1,025)</span>
              <span class="recommend-card-tag">热门课程</span>
            </div>
            <div class="recommend-card-price">￥19.99</div>
          </div>
        </div>
      </div>

      <div class="watching-section">
        <h2 class="watching-title">学习者正在看</h2>
        <div class="watching-cards-row">
          <div class="watching-card" v-for="(course, index) in hottestCourseQuickViews?.slice(1)" :key="index"
            @mouseenter="course.mouseEnter()" @mouseleave="course.mouseLeave()">
            <HoverPopup v-model="course.hoverFlag" transition="slide" width="300px" height="360px" :index="index"
              :show-delay="200" :hide-delay="200" :userId="userId || undefined" :courseName="course.title"
              :courseId="course.courseId" @course-added="handleCourseAdded">
              <template #trigger>
                <div>
                  <div @click="goToCourse(course.courseId)">
                    <div class="watching-card-cover">
                      <img :src="course.coverImgUrl" alt="课程封面" />
                    </div>

                    <div class="watching-card-title">{{ course.title }}</div>
                    <div class="watching-card-author">iClass</div>
                    <div class="watching-card-rating">
                      <span class="watching-card-score">4.9</span>
                      <span class="watching-card-stars">
                        <span v-for="i in 5" :key="i" class="star filled">★</span>
                      </span>
                      <span class="watching-card-count">(1,025)</span>
                    </div>
                    <div class="watching-card-price">￥19.99</div>
                    <div class="cart-tag">热门课程</div>
                  </div>
                </div>
              </template>
            </HoverPopup>
          </div>
        </div>

        <!-- 右侧箭头按钮 -->
        <button class="watching-arrow-btn right"><span>›</span></button>
      </div>

    </div>
    <Footer />
  </main>

</template>

<style scoped>
#main-content {
  margin: 0 auto;
  padding-bottom: 100px;
  max-width: 1400px;
}

#main-content .user {
  display: flex;
  padding-left: 50px;
}

#main-content .user img {
  height: 80px;
  width: 80px;
  border-radius: 40px;
  margin-right: 20px;
}

#main-content .user span {
  font-family: 'PingFangSC', sans-serif;
  font-weight: bold;
  font-style: normal;
  color: #101010;
  font-size: 24px;
  letter-spacing: auto;
  line-height: 34px;
  word-spacing: 5px;
  text-align: left;
  vertical-align: middle;
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
  padding: 32px 0 48px 0;
  margin: 0 auto;
  max-width: 1300px;
}

.category-tabs {
  display: flex;
  justify-content: left;
  gap: 24px;
  margin-left: 30px;
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
  transition: all 0.2s;
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

.course-slider-container,
.watching-section {
  margin: 0 auto;
  padding-left: 5px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.course-slider,
.watching-cards-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding-inline: 15px;
  margin: 0 auto;
  width: fit-content;
  transition: all 0.3s;
}

.course-card,
.watching-card {
  position: relative;
  width: 300px !important;
  height: 350px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  overflow: visible;
  border: 1px solid #a3c7fd52;
}


.course-card img,
.watching-card .watching-card-cover img {
  width: 100%;
  height: 175px;
  background: #f7f7f7;
  display: flex;
  z-index: inherit;
}

.course-card .course-title,
.watching-card .watching-card-title {
  font-size: 18px;
  font-weight: bold;
  margin: 6px 20px;
}

.course-author,
.watching-card-author {
  font-size: 12px;
  color: #6a6f73;
  margin: 0px 20px;
}

.course-card .course-rating,
.watching-card .watching-card-rating {
  font-size: 14px;
  color: #F36224;
  font-weight: bold;
  margin: 5px 20px;
}

.course-card .course-price,
.watching-card .watching-card-price {
  font-size: 16px;
  font-weight: bold;
  margin: 0px 20px;
  color: red;
}

.button-next,
.button-prev {
  position: relative;
  color: #222;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  border: 2px solid #e5eaf3;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  transition: all 0.2s;
  z-index: 300;
  padding-bottom: 7px;
}

.button-prev {
  top: 212px;
  left: -5px;
  padding-top: 12px;
  padding-right: 12px;
}

.button-next {
  top: -198px;
  padding-top: 6px;
  padding-left: 10px;
  left: 1245px;
}

.button-next:hover,
.button-prev:hover {
  background: rgb(242, 242, 242);
}

.button-next:after,
.button-prev:after {
  font-size: 22px;
  font-weight: bold;
}

.show-all-btn {
  background: #fff;
  color: #165c91;
  border: #165c91 1px solid;
  width: fit-content;
  border-radius: 6px;
  margin-left: 30px;
  padding: 6px 18px;
  font-size: 14px;
  width: 200px;
  height: 40px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.show-all-btn:hover {
  background: #235e8f12;
}


/* 已登录 */
.start-section,
.watching-section,
.recommend-section {
  margin: 24px 30px;
  max-width: 1300px;
  padding: 12px 30px;
}

.start-section .start-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.start-section .start-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.start-section .start-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: rgb(22, 92, 125);
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: underline;
}

.start-section .mylearn-course-item-container {
  display: flex;
}

.start-section .mylearn-course-item-container .mylearn-course-item {
  display: flex;
  gap: 0px;
  border: none;
  overflow: hidden;
  background: #fff;
  margin-bottom: 24px;
  margin-left: 24px;
  padding: 0px 0px;
  width: 340px;
  position: relative;
  transition: all 0.2s;
}

.start-section .mylearn-course-cover {
  width: 120px;
  height: 160px;
  object-fit: cover;
  background: #f5f5f5;
  border: 1px solid #eee;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.start-section .mylearn-course-cover img {
  width: 120px;
  height: 100%;
}

.start-section .mylearn-course-info {
  flex: 1;
  height: 160px;
  width: 220px;
  display: flex;
  flex-direction: column;
}

.start-section .mylearn-course-title {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.start-section .mylearn-course-author {
  font-size: 14px;
  color: #888;
  margin-bottom: 12px;
}

.start-section .mylearn-progress-bar {
  position: absolute;
  left: 122px;
  bottom: 2px;
  box-shadow: 0px 2px 2px #e5e7eb;
  width: 218px;
  height: 8px;
  background: #e5e7eb;
  overflow: hidden;
  margin-top: 8px;
  z-index: 100;
}

.start-section .mylearn-progress-inner {
  height: 100%;
  background: rgb(22, 92, 125);
  transition: width 0.3s;
}

.next-section {
  margin: 32px 0 0 32px;
}

.next-title {
  font-size: 22px;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
}

.next-cards-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  position: relative;
}

.next-card {
  width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.2s;
  position: relative;
}

.next-card:hover {
  box-shadow: 0 6px 24px rgba(33, 84, 150, 0.13);
}

.next-card-cover {
  width: 100%;
  height: 110px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
}

.next-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.next-card-content {
  padding: 14px 16px 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.next-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.next-card-author {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}

.next-card-rating {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;
}

.next-card-score {
  color: #f59e42;
  font-weight: 700;
  margin-right: 4px;
}

.next-card-stars {
  color: #f59e42;
  margin-right: 4px;
  font-size: 15px;
}

.next-card-stars .star {
  margin-right: 1px;
  color: #f59e42;
}

.next-card-stars .star.filled {
  color: #f59e42;
}

.next-card-count {
  color: #888;
  font-size: 13px;
}

.next-card-price {
  font-size: 16px;
  color: #1742a0;
  font-weight: 700;
  margin-bottom: 8px;
}

.next-card-tag {
  display: inline-block;
  background: #e5e7eb;
  color: rgb(22, 92, 125);
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 10px;
  margin-top: 2px;
}

.next-arrow-btn {
  position: absolute;
  right: -36px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 22px;
  color: rgb(22, 92, 125);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.18s;
}

.next-arrow-btn:hover {
  background: rgb(22, 92, 125);
  color: #fff;
}

.recommend-title {
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
}

.recommend-card {
  display: flex;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #f3f4f6;
  padding: 32px 36px 32px 36px;
  height: 350px;
  width: 1260px;
  margin-bottom: 24px;
}

.recommend-card-cover {
  width: 495px;
  height: 290px;
  background: #f5f5f5;
  overflow: hidden;
  margin-right: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recommend-card .recommend-card-cover img {
  width: 495px;
  height: 290px;
  object-fit: cover;
  display: block;
}

.recommend-card-content {
  flex: 1;
  height: 290px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.recommend-card-title {
  height: 32px;
  font-size: 28px;
  font-weight: 700;
  color: #222;
  margin-bottom: 16px;
}

.recommend-card-desc {
  height: 90px;
  font-size: 15px;
  color: #444;
  margin-bottom: 10px;
  line-height: 1.7;
}

.recommend-card-meta-label,
.recommend-card-meta {
  height: 24px;
  color: #888;
  font-weight: 600;
  margin-bottom: 10px;
}

.recommend-card-meta-link {
  height: 24px;
  color: #215486;
  font-weight: 600;
  margin-right: 10px;
}

.recommend-card-rating {
  height: 24px;
  display: flex;
  align-items: center;
  font-size: 15px;
  margin-bottom: 14px;
}

.recommend-card-score {
  color: #f59e42;
  font-weight: 700;
  margin-right: 4px;
}

.recommend-card-stars {
  color: #f59e42;
  margin-right: 4px;
  font-size: 16px;
}

.recommend-card-stars .star {
  margin-right: 1px;
  color: #f59e42;
}

.recommend-card-stars .star.filled {
  color: #f59e42;
}

.recommend-card-count {
  color: #888;
  font-size: 13px;
  margin-right: 12px;
}

.recommend-card-tag {
  display: inline-block;
  background: #e5e7eb;
  color: #215486;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 10px;
  margin-left: 8px;
}

.recommend-card-price {
  position: relative;
  bottom: 0px;
  font-size: 20px;
  font-weight: 700;
}

.watching-section {
  margin: 32px 0 0 32px;
}

.watching-title {
  font-size: 22px;
  font-weight: 700;
  color: #111;
  margin-bottom: 50px;
}

/* 
.watching-cards-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  position: relative;
} */

/* 
.watching-card {
  width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.2s;
  position: relative;
} */
/* 
.watching-card:hover {
  box-shadow: 0 6px 24px rgba(33,84,150, 0.13);
} */
/* 
.watching-card-cover {
  width: 100%;
  height: 110px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
}

.watching-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
} */

/* .watching-card-content {
  padding: 14px 16px 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.watching-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.watching-card-author {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
} */
/* 
.watching-card-rating {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;
}

.watching-card-score {
  color: #f59e42;
  font-weight: 700;
  margin-right: 4px;
}

.watching-card-stars {
  color: #f59e42;
  margin-right: 4px;
  font-size: 15px;
} */
/* 
.watching-card-stars .star {
  margin-right: 1px;
  color: #f59e42;
}

.watching-card-stars .star.filled {
  color: #f59e42;
} */
/* 
.watching-card-count {
  color: #888;
  font-size: 13px;
} */

/* .watching-card-price {
  font-size: 16px;
  color: #1742a0;
  font-weight: 700;
  margin-bottom: 8px;
} */

.cart-tag {
  display: inline-block;
  background-color: rgba(33, 84, 150, 0.13);
  color: rgb(22, 92, 125);
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 10px;
  margin: 6px 20px;
}

.watching-arrow-btn {
  position: absolute;
  right: -36px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 22px;
  color: #215486;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.18s;
}

.watching-arrow-btn:hover {
  background: #215486;
  color: #fff;
}
</style>
