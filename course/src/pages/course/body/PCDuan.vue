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
//molidis
//before
// import FloatingBox from '../components/FloatingBox.vue';
import { goToCart } from '@/components/common/header.ts';
import { recommendedProducts, relatedTopics } from '../components/content';
import { useCourseDescription, useCart, otherThemes, courseCurriculums, Comments } from '../components/content';
import {
  courseTitles, NavigationButton,
  courseQuickViews, communityVoices,
} from '../components/content.ts';


import { categoryApi, courseApi, courseSuccessCodes, categorySuccessCodes } from '@/api/course.ts';
import type {CourseVO, Chapter, Lesson } from '@/api/course.ts';
import { convertMinutesToHoursAndMinutes } from '@/utils/common.ts';
import { getCurrentUserId, getValidToken } from '@/utils/request'; 

const courseVo = ref<CourseVO | null>(null);
const chapters = ref<Chapter[]>([]);

const { width, height } = useWindowSize()
const { CourseDescriptionFlag, CourseDescription } = useCourseDescription();
const { showCart, cartTitle, addToCart, goToCheckout } = useCart();
// 获取userId
const userId = ref<string | null>(null);


onMounted(async () => {
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
    console.log(userId);
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

});

const getLessonListBySortOrder = async (courseId: number, sortOrder: number) => {
  const chooseChapter = chapters.value.find(chapter => chapter.chapterSortOrder === sortOrder);
  if (!chooseChapter?.hasLoadedLessons) {
    //true
    const lessonsResponse = await courseApi.getLessonsByCourseIdAndSortOrder(courseId, sortOrder);
    console.log(lessonsResponse);
    if (chooseChapter) {
      chooseChapter.lessons! = lessonsResponse.data;
      chooseChapter.hasLoadedLessons = true;
    } else {
      console.warn("No chapters found");
    }
  }
}


const CourseDescriptionStyle = computed(() => ({
  height: CourseDescriptionFlag.value ? 'fit-content' : '400px'
}));
</script>

<template>
  <IconSprite />
  <CartPopup v-model="showCart" :style="`width:${width};height:${height}`">
    <template #content>
      <div class="shopping-cart-container container-scroll-y">
        <!-- 添加成功提示 -->
        <h2>已添加至购物车</h2>
        <div class="added-notification">
          <img src="/src/images/image6.png" alt="">
          <div class="product-info">
            来杯Java吧! 2025 Java 入門到精通課程
          </div>
          <button class="go-to-cart-btn" @click="goToCart()">前往购物车</button>
        </div>


        <div class="recommendations">
          <h2>常见购买搭配</h2>

          <div class="recommendation-list">
            <div v-for="product in recommendedProducts" :key="product.id" class="product-card">
              <img :src="product.coverImgUrl" alt="">
              <div class="recommendationItem-detail">
                <h3>{{ product.name }}</h3>
                <div class="rating">
                  <span class="stars">★★★★★</span>
                  <span class="rating-score">{{ product.rating }}</span>
                  <span class="review-count">({{ product.reviewCount }})</span>
                </div>
                <p class="price">{{ product.price }}</p>
              </div>
            </div>
          </div>
          <div class="total-section">
            <p class="total-price">总计： US$204.97</p>
            <button class="add-all-btn">全部添加至购物车</button>
          </div>
        </div>

        <!-- 相关主题 -->
        <div class="related-topics ">
          <h2>相关主题</h2>
          <div class="topic-tags">
            <span v-for="topic in relatedTopics" :key="topic" class="topic-tag">{{ topic }}</span>
          </div>
        </div>
      </div>
    </template>
  </CartPopup>
  <PCHeader :userId="userId" />
  <FloatingBox />
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
        <li v-for="courseCurriculum in chapters"
          @click="getLessonListBySortOrder(courseCurriculum.courseId, courseCurriculum.chapterSortOrder)">
          <span>{{ courseCurriculum.chapterSortOrder }}</span>
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
</style>