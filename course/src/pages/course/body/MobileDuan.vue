<script lang="ts" setup>
import '../course.css'
import { ref, onMounted, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import MobileHeader from '@/components/common/MoblieHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import CartPopup from '@/components/common/CartPopup.vue';
import FloatingBox from '../components/FloatingBox.vue';
import { useCourseDescription, useCart } from '../components/content';

import { getCurrentUserId, getValidToken } from '@/utils/request';

import { courseApi } from '@/api/course';
import type { CourseVO, Chapter } from '@/api/course';
import { convertMinutesToHoursAndMinutes } from '@/utils/common';

const courseVo = ref<CourseVO | null>(null);
const chapters = ref<Chapter[]>([]);

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

const handleShare = () => {
  // 实现分享功能
  if (navigator.share) {
    navigator.share({
      title: courseVo.value?.title || '课程',
      text: courseVo.value?.highLights || '精彩课程',
      url: window.location.href
    });
  } else {
    // 降级处理：复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href);
    alert('链接已复制到剪贴板');
  }
};

const handleGift = () => {
  // 实现礼物功能
  alert('礼物功能开发中...');
};
</script>

<template>
  <IconSprite />
  <CartPopup v-model="showCart" :style="`width:${width};height:${height}`" />
  <MobileHeader :userId="userId" />
  <main>
    <div id="top-container">
      <div class="content">
        <div class="course-theme" v-if="width > 540">
          <h6>{{ courseVo?.categoryName }} {{ courseVo?.tagName }}</h6>
        </div>
        <div class="divider" v-if="width > 540"></div>
        <div class="course-title">
          <h3>{{ courseVo?.title }}</h3>
        </div>
        <div class="course-introduction" v-if="width > 480">
          <h5>{{ courseVo?.highLights }}</h5>
        </div>
        <div class="divider" v-if="width > 500"></div>
        <div class="update-time" v-if="width > 500">
          <h6>上次更新时间：{{ courseVo?.updateTime }}</h6>
        </div>
        <div class="language" v-if="width > 520">
          <h6>中文, 英语</h6>
        </div>
      </div>
      <div class="price-section">
        <div class="video-pictrue">
          <img :src="courseVo?.coverImgUrl || '/src/images/image1.png'" alt="">
        </div>
        <span class="current-price">{{ courseVo?.currentPrice ? '¥' + courseVo.currentPrice : '¥13.99'
          }}</span>
        <span class="original-price">{{ courseVo?.originalPrice ? '¥' + courseVo.originalPrice : '¥94.99'
          }}</span>
        <span class="discount">85% 折扣</span>
        <div class="time-left">此优惠价格仅剩1天！</div>
        <div class="action-buttons">
          <button class="add-to-cart" @click="addToCart(courseVo?.title || '课程')">添加至购物车</button>
          <button class="buy-now" @click="">立即购买</button>
        </div>

        <div class="divider"></div>
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
        <h3>{{ courseVo?.chapterNum }}个章节·{{ courseVo?.lessonNum }}个讲座·总时长{{ courseVo?.totalMinutes }}分钟
        </h3>
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
        <h4>{{ courseVo?.description }}</h4>
      </div>
      <button @click="CourseDescriptionFlag = !CourseDescriptionFlag;" class="course-descrpitionbtn">{{
        CourseDescription
        }}</button>

    </div>
  </main>
</template>

<style scoped>
@import "@/assets/rem.css";

.price-section {
  margin: 15px;
  padding: 10px;
}


.video-picture img {
  width: 100%;
  height: 200px;
}

.current-price {
  font-size: 2.2rem;
  font-weight: bold;
  color: white;
  margin-right: 10px;
}

.original-price {
  font-size: 1.6rem;
  color: #999;
  text-decoration: line-through;
  margin-right: 10px;
}

.discount {
  font-size: 1.6rem;
  color: #d83b3b;
  font-weight: bold;
}

.time-left {
  font-size: 1.4rem;
  color: #d83b3b;
  margin-top: 5px;
}

.action-buttons {
  display: flex;
  margin: 15px auto;
}

.action-buttons button {
  width: fit-content;
  padding: 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  margin: 10px 20px;
  transition: all 0.3s;
}


.add-to-cart:hover,
.buy-now:hover {
  background-color: white;
  color: #215496;
}

.add-to-cart,
.buy-now {
  background-color: #215496;
  color: white;
}

.divider {
  height: 1px;
  background-color: #e1e1e1;
  margin: 15px 0;
}

#top-container {
  display: flex;
  background-color: rgb(4, 35, 58);
  color: rgb(200, 230, 255);
  width: 100%;
  min-width: 400px;
  padding: 0px 0px 20px 10px;
  font-size: 1.6rem;
  height: 400px;
  overflow: hidden;
}

.content {
  margin: 0 auto;
  width: calc(100% - 340px);
  max-width: 1000px;
  padding: 10px;
}

.content h3 {
  color: white;
  font-weight: bold;
}


#course-detail {
  margin: 0 auto;
  height: fit-content;
  padding: 20px 10px;
  width: 90%;
  min-width: 500px;
}

h1 {
  padding-left: 20px;
  margin-block: 10px;
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