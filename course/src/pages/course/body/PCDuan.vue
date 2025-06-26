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
import { goToCart } from '@/components/common/header.ts';
import { recommendedProducts, relatedTopics } from '../components/content';
import { useCourseDescription, useCart, otherThemes, courseCurriculums, Comments } from '../components/content';


import { getCurrentUserId, getValidToken } from '@/utils/request';

import { categoryApi, courseApi, courseSuccessCodes, categorySuccessCodes } from '@/api/course.ts';
import type { CourseVO, Chapter, Lesson } from '@/api/course.ts';
import { convertMinutesToHoursAndMinutes } from '@/utils/common.ts';

const courseVo = ref<CourseVO | null>(null);
const chapters = ref<Chapter[]>([]);
const lessons = ref<Lesson[]>([]);



const { width, height } = useWindowSize()
const { CourseDescriptionFlag, CourseDescription } = useCourseDescription();
const { showCart, cartTitle, addToCart, goToCheckout } = useCart();

// 获取userId
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

</script>

<template>
  <IconSprite />
  <CartPopup v-model="showCart" :style="`width:${width};height:${height}`" />
  <PCHeader :userId="userId" />
  <FloatingBox @addToCart="showCart = true" />
  <div id="top-container">
    <div class="content">
      <div class="course-theme">
        <h6> {{ courseVo?.categoryName }} {{ courseVo?.tagName }}</h6>
      </div>

      <div class="divider"></div>

      <div class="course-title">
        <h3> {{ courseVo?.title }}
        </h3>
      </div>

      <div class="course-introduction">
        <h5>{{ courseVo?.highLights }}</h5>

      </div>

      <div class="divider"></div>

      <div class="update-time">
        <h6>上次更新时间：{{ courseVo?.updateTime }}</h6>
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
      <button v-for="otherTheme in otherThemes">
        {{ otherTheme.title }}
      </button>

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

    <h1>评论</h1>
    <div class="comment-container .container-scroll-x">

      <div class="comment">
        <div v-for="(comment, index) in Comments" class="ones-comment">
          <div class="user">
            <img :src="comment.userpicture" alt="" class="user-picture">
            <span>{{ comment.username }}</span>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
          <div class="comment-datetime">{{ comment.datetime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#top-container {
  display: flex;
  background-color: rgb(4, 35, 58);
  color: rgb(200, 230, 255);
  width: 100%;
  padding: 20px 0px 20px 10px;
  font-size: 20px;
  height: 400px;
}

.content {
  margin: 0 auto;
  width: calc(30% + 680px);
  min-width: 650px;
  max-width: 1320px;
  padding: 20px;
  padding-right: 340px;
}

.content h3 {
  color: white;
  font-weight: bold;
}

.divider {
  height: 1px;
  background-color: #e1e1e1;
  margin: 10px 20px 10px 0px;
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