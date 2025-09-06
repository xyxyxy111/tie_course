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
import { goToVideo } from '@/components/common/header';
import { convertMinutesToHours, formatDateToYearMonth } from '@/utils/common';

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
  if (!event || event.success !== true) {
    return;
  }
  selectedCourse.value = {
    title: event.courseName,
    courseId: event.courseId
  };
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

//控制hover
const hovered = ref(false);  // 控制hover状态
const goToVideoPage = (courseId: number) => {
  console.log("go to video")
  if (courseId) {
    goToVideo(courseId);
  }
};

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
              <svg width="24" height="24" viewBox="0 0 24 24">
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
                      <div class="course-price-container">
                        <span class="current-price">¥{{ course.currentPrice }}</span>
                        <span class="original-price">¥{{ course.originalPrice }}</span>
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
          <div v-if="!mylist?.length">
            <p>您还没有任何课程，去探索课程开始学习吧！</p>
          </div>
          <div v-for="course in mylist" :key="course.courseId" class="mylearn-course-item">
            <div class="mylearn-course-cover">
              <span class="video-pictrue" @mouseover="hovered = true" @mouseleave="hovered = false"
                :class="{ hovered: hovered }" @click="goToVideoPage(course.courseId)" title="点击播放">
                <img :src="course.coverImgUrl" alt="">
                <div class="overlay">
                  <svg width="50" height="50" viewBox="0 0 16 16" fill="#eee">
                    <use href="#solar--play-broken" />
                  </svg>
                </div>
              </span>
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


      <!-- <div v-if="userId" class="next-section">
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
        <div class="recommend-card" @click="goToCourse(hottestCourseList[0].courseId)">
          <div class="recommend-card-cover">
            <img :src="hottestCourseList[0]?.coverImgUrl" alt="课程封面" />
          </div>
          <div class="recommend-card-content">
            <div class="recommend-card-title">{{ hottestCourseList[0]?.title }}</div>
            <div class="recommend-card-desc">
              {{ hottestCourseList[0]?.description }}
            </div>

            <div class="recommend-card-meta-label">讲师：iClass</div>
            <div class="recommend-card-meta">
              <span class="recommend-card-meta-link">上次更新日期：{{ formatDateToYearMonth(hottestCourseList[0]?.updateTime!)
                }}</span>
              <span class="recommend-card-meta-label">总时长：</span>{{
                convertMinutesToHours(hottestCourseList[0]?.totalMinutes)
              }}个小时
              <span class="recommend-card-meta-label">{{ hottestCourseList[0]?.chapterNum }}个章节</span>
              <span class="recommend-card-meta-label">{{ hottestCourseList[0]?.lessonNum }}个讲解</span>
            </div>
            <div class="recommend-card-rating">
              <span class="recommend-card-score">4.9</span>
              <span class="recommend-card-stars">
                <span v-for="i in 5" :key="i" class="star filled">★</span>
              </span>
              <span class="recommend-card-count">(1,025)</span>
              <span class="recommend-card-tag">热门课程</span>
            </div>
            <div class="recommend-card-price">
              <div class="course-price-container">
                <span class="current-price">¥{{ hottestCourseList[0]?.currentPrice }}</span>
                <span class="original-price">¥{{ hottestCourseList[0]?.originalPrice }}</span>
              </div>
            </div>
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
                    <div class="course-price-container">
                      <span class="current-price">¥{{ course.currentPrice }}</span>
                      <span class="original-price">¥{{ course.originalPrice }}</span>
                    </div>
                    <div class="cart-tag">热门课程</div>
                  </div>
                </div>
              </template>
            </HoverPopup>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </main>
</template>
<style scoped>
@import "@/assets/rem.css";

.header {
  min-width: 1400px;
}

.header input {
  min-width: 800px;
}

#main-content {
  margin: 0 auto;
  padding-bottom: 100px;
  width: 1920px;
  overflow: hidden;
}

#main-content .user {
  margin: 10px auto;
  display: flex;
  width: 1320px;
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
  font-size: 2.2rem;
  letter-spacing: auto;
  line-height: 34px;
  word-spacing: 5px;
  text-align: left;
  vertical-align: middle;
}

.navigator {
  margin: 30px auto 0px;
  max-width: 1320px;
}

.navigator h1 {
  font-family: 'PingFangSC-bold', 'PingFang SC', Arial, sans-serif;
  font-style: normal;
  height: 40px;
  color: #101010;
  font-size: 2.8rem;
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
  font-size: 1.4rem;
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
  font-size: 2rem;
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
  max-width: 1320px;
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
  width: 166px;
  height: 70px;
  padding: 12px 32px;
  border-radius: 40px;
  background: #ededed;
  color: #222;
  font-weight: 500;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
  user-select: none;
}

.category-tab:hover {
  background-color: #bbb;
}

.category-tab.active {
  background: #454545;
  color: #fff;
}

.category-tab-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 2px;
}

.category-tab-desc {
  font-size: 1.2rem;
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
  width: 1320px;
  overflow: hidden;
}

.course-slider,
.watching-cards-row {
  margin-inline-start: 20px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding-inline: 15px;
  width: fit-content;
  max-width: 100%;
  transition: all 0.3s;
}

.course-slider {
  max-width: none;
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
.recommend-card-title,
.watching-card .watching-card-title {
  font-size: 2.3rem;
  font-weight: bold;
  margin: 6px 20px;
}

.course-author,
.watching-card-author {
  font-size: 1.2rem;
  color: #6a6f73;
  margin: 0px 20px;
}

.course-card .course-rating,
.watching-card .watching-card-rating {
  font-size: 1.4rem;
  color: #F36224;
  font-weight: bold;
  margin: 5px 20px;
}

/* Price styling for all price displays */
.course-price-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 20px;
}

.current-price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #101010;
}

.original-price {
  font-size: 1.4rem;
  color: #999;
  text-decoration: line-through;
}

/* For watching card prices */
.watching-card .course-price-container {
  margin: 0 20px;
}

/* For recommend card price */
.recommend-card-price .course-price-container {
  margin: 0;
}

.recommend-card-price .current-price {
  font-size: 2rem;
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
  font-size: 3rem;
  transition: all 0.2s;
  z-index: 300;
  padding-bottom: 7px;
}

.button-prev {
  top: 200px;
  left: 5px;
  padding-top: 12px;
  padding-right: 12px;
}

.button-next {
  top: -198px;
  padding-top: 6px;
  padding-left: 10px;
  left: 1265px;
}

.button-next:hover,
.button-prev:hover {
  background: rgb(242, 242, 242);
}

.button-next:after,
.button-prev:after {
  font-size: 2.2rem;
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
  font-size: 1.4rem;
  width: 200px;
  height: 40px;
  font-size: 1.5rem;
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
  margin: 24px auto;
  max-width: 1320px;
  padding: 12px 10px;
}

.start-section .start-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.start-section .start-header h1 {
  font-size: 2.8rem;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.start-section .start-header h3 {
  font-size: 1.6rem;
  font-weight: 700;
  color: rgb(22, 92, 125);
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: underline;
}

.start-section .mylearn-course-item-container {
  display: flex;
}

.start-section .mylearn-course-item-container p {
  font-size: 1.6rem;
  color: #666;
  margin: 20px 0;
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
  font-size: 1.8rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.start-section .mylearn-course-author {
  font-size: 1.4rem;
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
  font-size: 2.2rem;
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
  font-size: 1.6rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.next-card-author {
  font-size: 1.3rem;
  color: #888;
  margin-bottom: 8px;
}

.next-card-rating {
  display: flex;
  align-items: center;
  font-size: 1.4rem;
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
  font-size: 1.5rem;
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
  font-size: 1.3rem;
}

.recommend-title,
.watching-title {
  font-size: 2.8rem;
  font-weight: bolder;
  color: #000;
  margin-bottom: 24px;
  margin-left: 0px;
}

.recommend-card {
  display: flex;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #f3f4f6;
  padding: 32px 36px 32px 36px;
  height: 350px;
  max-width: 1260px;
  margin-bottom: 24px;
  cursor: pointer;
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
  font-size: 2.8rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 16px;
}

.recommend-card-desc {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  height: auto;
  min-height: 95px;
  font-size: 1.5rem;
  color: #444;
  margin-bottom: 10px;
  line-height: 1.7;
  overflow: hidden;
}

.recommend-card-meta-label,
.recommend-card-meta {
  height: 24px;
  color: #888;
  font-weight: 600;
  margin-bottom: 5px;
}

.recommend-card-meta-link {
  height: 24px;
  color: #215496;
  font-weight: 600;
  margin-right: 10px;
}

.recommend-card-rating {
  height: 24px;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
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
  font-size: 1.6rem;
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
  font-size: 1.3rem;
  margin-right: 12px;
}

.recommend-card-tag {
  display: inline-block;
  background: #e5e7eb;
  color: #215496;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 10px;
  margin-left: 8px;
}

.cart-tag {
  display: inline-block;
  background-color: rgba(33, 84, 150, 0.13);
  color: rgb(22, 92, 125);
  font-size: 1.3rem;
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
  font-size: 2.2rem;
  color: #215496;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.18s;
}

.watching-arrow-btn:hover {
  background: #215496;
  color: #fff;
}


/* 播放器样式 */
.video-pictrue {
  display: block;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-pictrue:hover img {
  transform: scale(1.03);
  transition: transform 0.2s ease-in-out;
}

.video-pictrue {
  position: relative;
}

.video-pictrue .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  opacity: 0;
  z-index: 9999;
  transition: opacity 0.2s;
}

.video-pictrue.hovered .overlay {
  opacity: 1;
  pointer-events: auto;
}
</style>