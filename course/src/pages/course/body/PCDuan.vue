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
import { goToCart, goToLogin } from '@/components/common/header';
import { recommendedProducts, relatedTopics } from '../components/content';
import { useCourseDescription } from '../components/content';
import { useWishlist } from '@/composables/useWishlist';

const { fetchWishlist, addToWishlist } = useWishlist();

import { getCurrentUserId, getValidToken } from '@/utils/request';
import { categoryApi, courseApi, courseSuccessCodes, categorySuccessCodes } from '@/api/course';
import type { CourseVO, Chapter, Lesson } from '@/api/course';
import { convertMinutesToHoursAndMinutes } from '@/utils/common';
import { addToCart, goToCheckout, showCart } from '../components/content'
import { convertMinutesToHours,formatDateToYearMonth } from '@/utils/common';


const courseVo = ref<CourseVO | null>(null);
const chapters = ref<Chapter[]>([]);

const { width, height } = useWindowSize()
const { CourseDescription } = useCourseDescription();
// 获取userId
const userId = ref<string | null>(null);
const isExpanded = ref(false);
// 展开章节的id集合
const expandedChapters = ref<number[]>([]);
const lastUpdateTime = ref('年月日')
// 调用头部组件的引用
const headerRef = ref<InstanceType<typeof PCHeader> | null>(null);


onMounted(async () => {
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  }
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = parseInt(searchParams.get('courseId')!);

  const courseVoResponse = await courseApi.getSingleCourseDetail(courseId);
  courseVo.value = courseVoResponse.data;
  const chaptersResponse = await courseApi.getChapterListById(courseId);

  chapters.value = chaptersResponse.data;
  chapters.value.forEach(chapter => { // 注意：这里是 users.value
    let result = convertMinutesToHoursAndMinutes(chapter.lessonTotalMinute);
    chapter.hours = result.hours;
    chapter.minutes = result.minutes;
  });

  //session to make great
  const lessonsResponse = await courseApi.getLessonsByCourseIdAndSortOrder(courseId, 1);
  const firstChapter = chapters.value.find(chapter => chapter.chapterSortOrder === 1);
  if (firstChapter) {
    firstChapter.lessons! = lessonsResponse.data;
    firstChapter.hasLoadedLessons = true;
  } else {
    console.warn("No chapters found");
  }

  lastUpdateTime.value = (formatDateToYearMonth(courseVo.value?.updateTime!));
});

const getLessonListBySortOrder = async (courseId: number, sortOrder: number) => {
  const chooseChapter = chapters.value.find(chapter => chapter.chapterSortOrder === sortOrder);
  if (!chooseChapter?.hasLoadedLessons) {
    //true
    const lessonsResponse = await courseApi.getLessonsByCourseIdAndSortOrder(courseId, sortOrder);
    console.log("lessonsResponse" + lessonsResponse.data.map(lesson => lesson.title));
    if (chooseChapter) {
      chooseChapter.lessons! = lessonsResponse.data;
      chooseChapter.hasLoadedLessons = true;
    } else {
      console.warn("No chapters found");
    }
  }
}

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

const searchParams = new URLSearchParams(window.location.search);
const courseId = parseInt(searchParams.get('courseId') || '0');



const handleAddToCart = async () => {
  const response = await addToCart(courseId);
  if (response.success) { showCart.value = true; }
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
    @addToWishlist="addToWishlist" @addToCart="handleAddToCart" @buyNow="handleBuyNow" />

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
          <svg v-for="i in 4" :key="i" class="star" viewBox="0 0 20 20" width="22" height="22" fill="#FFC800">
            <polygon points="10,1 12.5,7.5 19,7.5 14,12 16,19 10,15 4,19 6,12 1,7.5 7.5,7.5" />
          </svg>
          <!-- 半星 -->
          <svg class="star" viewBox="0 0 20 20" width="22" height="22">
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
    <h1>浏览相关主题</h1>
    <div class="other-theme">

      <!-- <button v-for="otherTheme in otherThemes">
        {{ otherTheme.title }}
      </button> -->

    </div>
    <h1>课程内容</h1>
    <div class="course-content">
      <div class="course-content-header">
        <h3>{{ courseVo?.chapterNum }}个章节·{{ courseVo?.lessonNum }}个讲座·总时长{{ convertMinutesToHours(courseVo?.totalMinutes!) }}个小时</h3>
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
              {{ courseCurriculum.lessonNum }}个讲座·
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
              </li>
            </ul>

          </transition>
        </template>
      </ul>
    </div>

    <!-- 要求 -->
    <h1>要求</h1>
    <ul class="section-list">
      <li>准备好学习Python课程</li>
      <li>不用担心学不会，也不需要在任何程式语言背景或知识</li>
      <li>有一台电脑就可以轻松上手</li>
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
    <!-- 讲师 -->
    <!-- <div class="section-block teacher-block">
      <h1>讲师</h1>
      <div class="teacher-info">
        <img class="teacher-avatar" src="@/images/userPic.png" alt="讲师头像" />
        <div class="teacher-meta">
          <a class="teacher-name" href="#">iClass</a>
          <div class="teacher-stats">
            <span class="teacher-score">★ 4.8 讲师评分</span>
            <span class="teacher-student">9713 学员</span>
            <span class="teacher-course">2066 门课程</span>
            <span class="teacher-comment">5 评价</span>
          </div>
        </div>
        <div class="teacher-desc">
          我是iClass，拥有超过五年的开发教学经验，致力于数据分析和人工智能领域。主讲Python、数据分析、机器学习等课程。分阶段（2025 Python全攻略、2026 Python进阶、2027
          Python实战、2028 Python数据分析、2029 Python深度学习）带你系统掌握Python技能。
        </div>
      </div>
    </div> -->
  </div>
</template>

<!-- 
<template>
   -->

<style scoped>
@import "@/assets/rem.css";

#top-container {
  display: flex;
  background-color: #101010;
  color: #fff;
  width: 100%;
  padding: 20px 0px 20px 10px;
  font-size: 2rem;
  height: 400px;
}

.content {
  margin: 0 auto;
  width: calc(30% + 660px);
  padding: 20px;
  padding-right: 340px;
}

.content .course-theme {
  color: #A3C7FD;
  font-weight: bold;
}

.content .course-title {
  color: #fff;
  font-weight: bold;
  font-size: 3.2rem;
}

.content .course-introduction {
  color: #fff;
  font-size: 1.8rem;
  height: 90px;
  overflow: hidden;
}

.course-meta-row {
  margin: 15px 0px 0px;
  height: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 8px;
}

.hot-tag {
  background: #eaf6ff;
  color: #165c91;
  font-size: 1.6rem;
  font-weight: bold;
  border-radius: 6px;
  padding: 2px 10px;

  margin-right: 8px;
  display: inline-block;
}

.rating-score {
  color: #FFC800;
  font-weight: bold;
  font-size: 2rem;
  margin-right: 2px;
}

.stars {
  display: flex;
  align-items: center;
  margin-right: 6px;
}

.star {
  margin-right: -2px;
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
  color: #444;
  font-size: 1.6rem;
  margin-left: 4px;
  text-decoration: underline;
}

.clock-icon {
  display: flex;
  align-items: center;
  margin-right: 4px;
}

#course-detail {
  margin: 0 auto;
  height: fit-content;
  padding: 20px;
  width: calc(30% + 680px);
  padding-right: 360px;
}

.arrow {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
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

.lesson-item {
  padding-left: 32px;
  list-style: circle;
  cursor: default;
  display: flex;
  align-items: center;
}

.lesson-title {
  margin-left: 8px;
  text-align: left;
  flex-grow: 1;
  /* Ensures the title takes up the available space */
}


.course-detail-section {
  background: #fff;
  border-radius: 10px;
  padding: 32px 32px 24px 32px;
  max-width: 900px;
  margin: 0 auto;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  color: #222;
}

.section-block {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #222;
}

.section-list {
  list-style: disc inside;
  margin: 0 0 12px 0;
  padding-left: 18px;
  color: #222;
}

.section-list li {
  margin-bottom: 6px;
  font-size: 1rem;
  line-height: 1.7;
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
}

/* 
.course-description-btn {
  display: block;
  padding: 8px 16px;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.course-description-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
} */

.section-desc {
  font-size: 1rem;
  color: #444;
  line-height: 1.7;
  margin-top: 8px;
}

.teacher-block {
  border-top: 1px solid #eee;
  padding-top: 24px;
}

.teacher-info {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-top: 10px;
}

.teacher-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  background: #f5f5f5;
  border: 1px solid #eee;
}

.teacher-meta {
  flex: 1 1 0;
  min-width: 0;
}

.teacher-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #215496;
  text-decoration: none;
  margin-bottom: 6px;
  display: inline-block;
}

.teacher-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.98rem;
  color: #666;
  margin-bottom: 6px;
}

.teacher-score {
  color: #e67c17;
  font-weight: 600;
}

.teacher-desc {
  font-size: 0.98rem;
  color: #444;
  line-height: 1.7;
  margin-top: 4px;
  flex: 2 1 0;
}
</style>

<!-- 
<style scoped>
</style>
-->