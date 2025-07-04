<script lang="ts" setup>
import '../course.css'
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, computed } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import CartPopup from '@/components/common/CartPopup.vue';
import FloatingBox from '../components/FloatingBox.vue';
import { goToCart } from '@/components/common/header';
import { recommendedProducts, relatedTopics } from '../components/content';
import { useCourseDescription, useCart, Comments } from '../components/content';

import { getCurrentUserId, getValidToken } from '@/utils/request';

import { categoryApi, courseApi, courseSuccessCodes, categorySuccessCodes } from '@/api/course';
import type { CourseVO, Chapter, Lesson } from '@/api/course';
import { convertMinutesToHoursAndMinutes } from '@/utils/common';

const courseVo = ref<CourseVO | null>(null);
const chapters = ref<Chapter[]>([]);

const { width, height } = useWindowSize()
const { CourseDescriptionFlag, CourseDescription } = useCourseDescription();
const { showCart, cartTitle, addToCart, goToCheckout } = useCart();

const userId = ref<string | null>(null);

// 展开章节的id集合
const expandedChapters = ref<number[]>([]);

onMounted(async () => {
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  } else {
    // 如果没有token，重定向到登录页面
    window.location.href = '/login.html';
  }
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = parseInt(searchParams.get('courseId')!);

  //if(!searchParams.get('courseId')){return;}&&error

  const courseVoResponse = await courseApi.getSingleCourseDetail(courseId);
  courseVo.value = courseVoResponse.data;
  console.log(courseVo.value);

  const chaptersResponse = await courseApi.getChapterListById(courseId);
  chapters.value = chaptersResponse.data;
  chapters.value.forEach(chapter => { // 注意：这里是 users.value
    let result = convertMinutesToHoursAndMinutes(chapter.lessonTotalMinute);
    chapter.hours = result.hours;
    chapter.minutes = result.minutes;
  });
  console.log(chapters.value);

  //session to make great
  const lessonsResponse = await courseApi.getLessonsByCourseIdAndSortOrder(courseId, 1);
  const firstChapter = chapters.value.find(chapter => chapter.chapterSortOrder === 1);
  if (firstChapter) {
    firstChapter.lessons! = lessonsResponse.data;
    firstChapter.hasLoadedLessons = true;
  } else {
    console.warn("No chapters found");
  }
  getLessonListBySortOrder
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

const toggleChapter = async (courseId: number, sortOrder: number) => {
  const idx = expandedChapters.value.indexOf(sortOrder);
  if (idx > -1) {
    // 已展开则收起
    expandedChapters.value.splice(idx, 1);
  } else {
    // 展开并加载lesson
    await getLessonListBySortOrder(courseId, sortOrder);
    expandedChapters.value.push(sortOrder);
  }
};

const CourseDescriptionStyle = computed(() => ({
  height: CourseDescriptionFlag.value ? 'fit-content' : '400px'
}));

const handleAddToCart = async () => {
  try {
    // 从URL获取courseId
    const searchParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(searchParams.get('courseId') || '0');

    if (!courseId) {
      alert('课程ID无效');
      return;
    }

    // 调用购物车API
    const { cartApi } = await import('@/api/cart');
    const response = await cartApi.addCourseToCart(courseId);

    if (response.status === 1302) {
      alert('添加至购物车成功！');
      showCart.value = true;
    } else if (response.status === 2301) {
      alert('该课程已在购物车中');
    } else {
      alert('添加至购物车失败，请重试');
    }
  } catch (error) {
    console.error('添加至购物车失败:', error);
    alert('添加至购物车失败，请重试');
  }
};

</script>

<template>
  <IconSprite />
  <CartPopup v-model="showCart" :style="`width:${width};height:${height}`" />
  <PCHeader :userId="userId" />
  <FloatingBox @addToCart="handleAddToCart" />
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
        <span>上次更新时间：{{ courseVo?.updateTime }}</span>
      </div>

    </div>

  </div>

  <div id="course-detail">
    <div class="what-you-will-learn">
      <h1>您将会学到</h1>
      <p>{{ courseVo?.whatYouWillLearn }}</p>
    </div>

    <div class="other-theme">
      <h1>浏览相关主题</h1>
      <!-- <button v-for="otherTheme in otherThemes">
        {{ otherTheme.title }}
      </button> -->

    </div>

    <div class="course-content">
      <h1>课程内容</h1>
      <h3>{{ courseVo?.chapterNum }}个章节·{{ courseVo?.lessonNum }}个讲座·总时长{{ courseVo?.totalMinutes }}分钟</h3>
      <ul>
        <template v-for="courseCurriculum in chapters" :key="courseCurriculum.chapterSortOrder">
          <li @click="toggleChapter(courseCurriculum.courseId, courseCurriculum.chapterSortOrder)">
            <span>第{{ courseCurriculum.chapterSortOrder }}章 </span>
            <span class="curriculum-title">{{ courseCurriculum.title }}</span>
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
              <li v-for="lesson in courseCurriculum.lessons" :key="lesson.lessonId"
                style="padding-left:32px;list-style:circle;cursor:default;">
                {{ lesson.title }}
              </li>
            </ul>
          </transition>
        </template>
      </ul>
    </div>
    <div class="course-descrpition" :style="CourseDescriptionStyle">
      <h1>描述</h1>

      <h4>
        {{ courseVo?.description }}
      </h4>
    </div>
    <button @click="CourseDescriptionFlag = !CourseDescriptionFlag" class="course-descrpitionbtn">显示更多</button>

  </div>
</template>

<style scoped>
#top-container {
  display: flex;
  background-color: #101010;
  color: #fff;
  width: 100%;
  padding: 20px 0px 20px 10px;
  font-size: 20px;
  height: 400px;
}

.content {
  margin: 0 auto;
  width: calc(30% + 660px);
  min-width: 650px;
  max-width: 1320px;
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
  font-size: 32px;
}

.content .course-introduction {
  color: #fff;
  font-size: 18px;
  height: 90px;
  overflow: hidden;
}


.course-meta-row {
  margin: 15px 0px 0px;
  height: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  color: #fff;
  margin-bottom: 8px;
}

.hot-tag {
  background: #eaf6ff;
  color: #165c91;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  padding: 2px 10px;

  margin-right: 8px;
  display: inline-block;
}

.rating-score {
  color: #FFC800;
  font-weight: bold;
  font-size: 20px;
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
  font-size: 16px;
  margin-right: 8px;
  text-decoration: underline;
  cursor: pointer;
}

.student-count {
  color: #fff;
  font-size: 16px;
  margin-left: 4px;
}

.creator-link {
  color: #7cb1ff;
  font-size: 16px;
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

.lesson-list {
  border: none;
  padding-left: 32px;
  list-style: circle;
  cursor: default;
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
</style>