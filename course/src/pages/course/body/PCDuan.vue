<script lang="ts" setup>
import '../course.css'
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, computed, nextTick } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import CartPopup from '@/components/common/CartPopup.vue';
import FloatingBox from '../components/FloatingBox.vue';
import { goToCart, goToLogin, goToVideo, goToVideoWithLessonId } from '@/components/common/header';
import { recommendedProducts, relatedTopics } from '../components/content';
import { useCourseDescription } from '../components/content';
import { useWishlist } from '@/composables/useWishlist';

const { fetchWishlist, addToWishlist } = useWishlist();

import { getCurrentUserId, getValidToken } from '@/utils/request';
import { categoryApi, courseApi, courseSuccessCodes, categorySuccessCodes } from '@/api/course';
import type { CourseVO, Chapter, Lesson } from '@/api/course';
import {
  addToCart, goToCheckout, showCart,
  courseVo,
  chapters,
  getCourseMessage,
  getLessonListBySortOrder, lastUpdateTime
} from '../components/content'
const { width, height } = useWindowSize()
const { CourseDescription } = useCourseDescription();
const userId = ref<string | null>(null);
const isExpanded = ref(false);
const expandedChapters = ref<number[]>([]);
const headerRef = ref<InstanceType<typeof PCHeader> | null>(null);
const otherThemes = ['Python', 'Java']
const requests = ['准备好学习Python课程', '不用担心学不会，也不需要在任何程式语言背景或知识', '有一台电脑就可以轻松上手']
onMounted(async () => {
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  }
  getCourseMessage();
});

const chaptersState = ref('展开');

const toggleChapter = async (courseId: number, sortOrder: number) => {
  const idx = expandedChapters.value.indexOf(sortOrder);
  if (idx > -1) {
    expandedChapters.value.splice(idx, 1);
  } else {
    await getLessonListBySortOrder(courseId, sortOrder);
    expandedChapters.value.push(sortOrder);
  }
};

const openAllChapter = async () => {
  chapters.value.forEach(chapter => {
    if (!expandedChapters.value.includes(chapter.chapterSortOrder)) {
      toggleChapter(chapter.chapterId, chapter.chapterSortOrder);
    }
  });
  chaptersState.value = '收起';
};
const closeAllChapter = () => {
  expandedChapters.value = [];
  chaptersState.value = '展开';
};

const CourseDescriptionStyle = computed(() => ({
  height: isExpanded.value ? 'fit-content' : '400px',
  maxHeight: 'fit-content'
}));

const handleAddToCart = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = parseInt(searchParams.get('courseId') || '1001');
  const response = await addToCart(userId.value!, courseId);
  if (response as any) { showCart.value = true; }
};

const handleBuyNow = async () => {
  try {
    const token = getValidToken();
    if (token && courseVo.value) {
      goToCheckout({
        courseId: courseVo.value.courseId,
        title: courseVo.value.title,
        coverImgUrl: courseVo.value.coverImgUrl,
        currentPrice: courseVo.value.currentPrice,
        originalPrice: courseVo.value.originalPrice
      });
    } else {
      goToLogin();
    }
  } catch (error: any) {
    console.error('购买失败:', error);
    alert('购买失败，请重试');

  }
}



</script>

<template>
  <IconSprite />
  <CartPopup :style="`width:${width};height:${height}`" v-model="showCart" :courseName="courseVo?.title || ''"
    :courseId="courseVo?.courseId" />
  <PCHeader ref="headerRef" :userId="userId" />
  <FloatingBox v-if="courseVo" :courseId="courseVo.courseId" :courseVideo="courseVo?.coverImgUrl"
    :currentPrice="courseVo?.currentPrice" :originalPrice="courseVo?.originalPrice" :discount="courseVo?.discountValue"
    @addToWishlist="addToWishlist(courseVo?.courseId)" @addToCart="handleAddToCart" @buyNow="handleBuyNow" />

  <div id="top-container">
    <div class="content">
      <div class="course-theme">
        <h6> {{ courseVo?.categoryName }} &nbsp; > &nbsp; {{ courseVo?.tagName }}</h6>
      </div>

      <div class="course-title">
        <h3> {{ courseVo?.title }}
        </h3>
      </div>

      <div class="course-introduction">
        <h5>{{ courseVo?.highLights }}</h5>

      </div>
      <div class="course-meta-row">
        <span class="hot-tag">热门课程</span>
        <span class="rating-score">4.9</span>
        <span class="stars">
          <svg v-for="i in 4" :key="i" class="star" viewBox="0 0 18 18" width="18" height="18" fill="#FFC800">
            <polygon points="10,1 12.5,7.5 19,7.5 14,12 16,19 10,15 4,19 6,12 1,7.5 7.5,7.5" />
          </svg>
          <!-- 半星 -->
          <svg class="star" viewBox="0 0 18 18" width="18" height="18">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stop-color="#FFC800" />
                <stop offset="50%" stop-color="#222" />
              </linearGradient>
            </defs>
            <polygon points="10,1 12.5,7.5 19,7.5 14,12 16,19 10,15 4,19 6,12 1,7.5 7.5,7.5" fill="url(#half)"
              stroke="#FFC800" stroke-width="1" />
          </svg>
        </span>
        <a class="review-link" href="#">(1,025个评分)</a>
        <span class="student-count">3,796 个学生</span>
      </div>
      <div class="course-meta-row">
        <span>创建者</span>
        <a class="creator-link" href="#">iClass</a>
      </div>
      <div class="course-meta-row">
        <span class="clock-icon">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#fff" stroke-width="2" />
            <path d="M10 5v5l3 3" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
        <span>上次更新时间：{{ lastUpdateTime }}</span>
      </div>

    </div>

  </div>

  <div id="course-detail">
    <div class="what-you-will-learn">
      <h2>您将会学到</h2>
      <p> <span class="checkmark">✔</span>{{ courseVo?.whatYouWillLearn }}</p>
    </div>

    <div class="other-theme">
      <h1>浏览相关主题</h1>
      <button v-for="otherTheme in otherThemes">
        {{ otherTheme }}
      </button>

    </div>

    <h1>课程内容</h1>
    <div class="course-content">
      <div class="course-content-header">
        <h3>{{ courseVo?.chapterNum }}个章节 · {{ courseVo?.lessonNum }}个讲座 · 总时长{{ courseVo?.totalMinutes }}分钟</h3>
        <span class="open-all" @click="chaptersState === '展开' ? openAllChapter() : closeAllChapter()">
          {{ chaptersState }}所有章节
        </span>
      </div>

      <ul>
        <template v-for="courseCurriculum in chapters" :key="courseCurriculum.chapterSortOrder">
          <li @click="toggleChapter(courseCurriculum.courseId, courseCurriculum.chapterSortOrder)">
            <span class="arrow" :class="{ open: expandedChapters.includes(courseCurriculum.chapterSortOrder) }"></span>
            <span class="curriculum-title">
              第{{ courseCurriculum.chapterSortOrder }}章
              &nbsp; {{ courseCurriculum.title }}</span>
            <span class="lectrue-duration">
              {{ courseCurriculum.lessonNum }}个讲座 ·
              <template v-if="courseCurriculum.hours !== 0">
                {{ courseCurriculum.hours }}小时
              </template>
              <template v-if="courseCurriculum.minutes !== 0">
                {{ courseCurriculum.minutes }}分钟
              </template>
            </span>
          </li>
          <transition name="slide-lesson">
            <ul class="lesson-list"
              v-if="expandedChapters.includes(courseCurriculum.chapterSortOrder) && courseCurriculum.lessons">
              <li v-for="lesson in courseCurriculum.lessons" :key="lesson.lessonId" class="lesson-item">
                <svg :width="28" :height="28" viewBox="0 0 24 24" fill="none">
                  <use href="#bx--file" />
                </svg>
                <span class="lesson-title"> {{ lesson.title }} </span>
                <div style="text-align: right;">
                  <a href="#" v-if="lesson.previewable"
                    @click="goToVideoWithLessonId(courseCurriculum.courseId, lesson.lessonId)">预览</a>
                </div>
              </li>
            </ul>

          </transition>
        </template>
      </ul>
    </div>

    <!-- 要求 -->
    <h1>要求</h1>
    <ul class="section-list">
      <li v-for="request in requests">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="#111">
          <circle cx="10" cy="10" r="9" stroke="#fff" stroke-width="2" />
          <use href="#icon-park-outline--dot" />
        </svg><span class="request">{{ request }}</span>

      </li>

    </ul>

    <div class="course-description-container">
      <h1>描述</h1>
      <div class="course-description">
        <h4>{{ courseVo?.description }}</h4>
      </div>
      <!-- <button @click="isExpanded = !isExpanded" class="course-description-btn">
        {{ isExpanded ? '收起' : '显示更多' }}
      </button> -->
    </div>

  </div>
</template>

<style scoped>
@import "@/assets/rem.css";

#top-container {
  display: flex;
  background-color: #101010;
  color: #fff;
  width: 100%;
  padding: 20px 0px;
  font-size: 2rem;
  height: 350px;
  min-width: 1920px;
}

.content,
#course-detail {
  margin: 0px 0px;
  width: 1494px;
  padding-right: 342px;
  padding-left: 20px;
}

#course-detail {
  width: 1920px;
  padding-right: 362px;

}


@media (min-width: 1500px) {

  .content,
  #course-detail {
    margin: 0 auto;
    width: 1494px;
    padding-right: 362px;
    padding-left: 20px;
  }

  #course-detail {
    width: 1920px;
    padding-right: 555px;
    padding-left: 233px;
  }
}



.content .course-theme {
  color: #A3C7FD;
  font-weight: bold;
  font-size: 14px;
  font-weight: bold;
  font-family: PingFangSC-bold;
}

.content .course-title {
  color: #fff;
  font-weight: bold;
  height: 68px;
  font-weight: bold;
  font-family: PingFangSC-bold;
  font-size: 3.2rem;
}

.content .course-introduction {
  color: #fff;
  font-size: 1.8rem;
  height: 85px;
  overflow: hidden;
  font-family: PingFangSC-regular;
}

.course-meta-row {
  margin: 20px 0px 0px;
  height: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 8px;
}

.hot-tag {
  background: #e2eff9;
  color: #235e8f;
  font-size: 1.6rem;
  font-weight: bold;
  border-radius: 6px;
  padding: 2px 10px;
  margin-right: 8px;
  display: inline-block;
}

.rating-score {
  color: #FcCa00;
  font-size: 1.2rem;
  margin-right: 2px;
}

.stars {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.star {
  width: 24px;
  height: 20px;
}

.review-link {
  color: #7cb1ff;
  font-size: 1.6rem;
  margin-right: 8px;
  text-decoration: underline;
  cursor: pointer;
}

.student-count {
  color: #fff;
  font-size: 1.6rem;
  margin-left: 4px;
}

.creator-link {
  color: #a3c7fd;
  font-size: 1.2rem;
  margin-left: 4px;
  text-decoration: underline;
}

.clock-icon {
  display: flex;
  align-items: center;
  margin-right: 4px;
}

#course-detail {
  padding-top: 30px;
}

.what-you-will-learn {
  border: 1px #e1e1e1 solid;
  padding: 17px 22px;
}

.what-you-will-learn h2 {
  font-size: 22px;
  color: #010101;
  font-weight: bold;
  font-family: PingFangSC-bold;
  margin-bottom: 14px;
  ;
}

.what-you-will-learn .checkmark {
  font-size: 16px;
  margin-right: 16px;
}

.what-you-will-learn ul {
  list-style: none;
}

h1 {
  margin-top: 30px;
  font-family: PingFangSC-bold;
  font-size: 22px;
  font-weight: bold;
}

.other-theme {
  margin-top: 30px;
}

.other-theme button {
  width: fit-content;
  min-width: 80px;
  height: 30px;
  font-size: 12px;
  background-color: white;
  border-radius: 4px;
  margin-top: 20px;
  margin-right: 10px;
  border: 1px #888 solid;
  transition: all 0.3s;
}

.other-theme button:hover {
  color: #010101;
  background-color: #f2f2f2;
}

.course-content-header {
  font-size: 12px;
  margin-top: 25px;
  display: flex;
  position: relative;
  margin-bottom: 16px;
}

.course-content-header .open-all {
  position: absolute;
  font-weight: bolder;
  color: rgb(35, 94, 143);
  right: 20px;
  margin-left: auto;
  text-align: right;
  display: inline-block;
  cursor: pointer;
}

.course-content-header .open-all:hover {
  background-color: #235e8f0a;
}

.course-content ul {
  width: 100%;
  padding-left: 0px;
  border: 1px #e1e1e1 solid;
  list-style: none
}

.course-content ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 50px;
  padding: 10px 20px;
  background-color: #f2f2f2;
  border-bottom: 0.5px #e1e1e1 solid;
  transition: all 0.3s;

}

.lesson-list {
  border: none;
  list-style: circle;
  cursor: default;
  background-color: #fff;
}

.course-content .lesson-list li {
  font-size: 12px;
  background-color: #fff;
  border: none;
}

.course-content .lesson-list li svg {
  padding-top: 8px;
  margin-right: 22px;
}

.arrow {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 32px;
  margin-left: 24px;
  transition: transform 0.2s;
  position: relative;
}

.arrow::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-left: 2px solid #888;
  border-bottom: 2px solid #888;
  position: absolute;
  top: 3px;
  left: 3px;
  transform: rotate(-45deg);
  transition: transform 0.2s;
}

.arrow.open::before {
  transform: rotate(135deg);
  top: 5px;
}

.course-content .curriculum-title {
  flex: 1;
  font-weight: bold;
  font-size: 1.4rem;
  margin-top: 15px;
  height: 30px;
}

.course-content .lectrue-duration {
  right: 10px;
  color: #888;
  margin-left: auto;
  text-align: right;
  display: inline-block;
  min-width: 120px;
  height: 30px;
  margin-top: 13px;
}

.course-descrpition {
  margin-top: 40px;
  padding: 20px;
  overflow: hidden;
}

.course-descrpition button {
  border: none;
  padding: 10px;
  color: #215496;
}

.course-descrpitionbtn {
  width: fit-content;
  border: none;
  background-color: white;
  color: #215496;
  font-weight: 700;
  padding: 10px 20px;
  margin: 10px 20px;
  border-radius: 8px;
}

.course-descrpitionbtn:hover {
  background-color: rgba(200, 230, 255, 0.2);
}

.slide-lesson-enter-active,
.slide-lesson-leave-active {
  transition: max-height 0.3s cubic-bezier(.55, 0, .1, 1);
  overflow: hidden;
}

.slide-lesson-enter-from,
.slide-lesson-leave-to {
  max-height: 0;
}

.slide-lesson-enter-to,
.slide-lesson-leave-from {
  max-height: 500px;
}

.course-content ul li.lesson-item {
  padding-left: 36px;
  list-style: circle;
  cursor: default;
  display: flex;
  align-items: center;
}

.lesson-title {
  margin-left: 8px;
  text-align: left;
  flex-grow: 1;
}

.section-list {
  padding-top: 14px;
  padding-left: 0px;
}


.section-list li {
  list-style: none;
  margin-bottom: 15px;
  height: 16px;
  align-items: center;
  font-size: 12px;
}

.section-list li svg {
  margin-right: 12px;
  flex-shrink: 0;
}

.section-list li .request {
  display: inline-block;
  height: 16px;
  font-size: 12px;
  margin-bottom: 2px;
}

.course-description {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  margin: 15px 0;
  line-height: 1.6em;
}

.course-description h4 {
  margin: 0;
  color: #333;
  white-space: pre-line;
  word-break: break-word;
  font-size: 12px;
}


.container-scroll-y {
  overflow-y: auto;
}

.divider {
  height: 1px;
  background-color: #e1e1e1;
}

.price {
  font-size: 3.6rem;
  font-weight: bold;
  color: var(--error-color);
  margin-bottom: 8px;
}

.discount {
  background: var(--error-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
