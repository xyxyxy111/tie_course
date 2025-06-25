<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import '../index.css'
import { toRef, ref, onMounted, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import HoverPopup from '@/components/common/HoverPopup.vue';
import CartPopup from '@/components/common/CartPopup.vue';
import { goToCart, goToCourse } from '@/components/common/header.ts';

// 导入CourseQuickView类型
import { CourseQuickView } from '../components/content.ts';

import { categoryApi, courseApi, courseSuccessCodes, categorySuccessCodes } from '@/api/course.ts';
import type { Category, Tag, CourseListVO } from '@/api/course.ts';

const categories = ref<Category[]>([]);
const singleCategory = ref<Category | null>(null);
const tags = ref<Tag[]>([]);
const courseListVos = ref<CourseListVO[]>([]);
const navigationButtons = ref<NavigationButton[]>([]);

const { width, height } = useWindowSize()
import {
  courseTitles, NavigationButton,
  courseQuickViews, communityVoices,
  recommendedProducts, relatedTopics
} from '../components/content.ts';

courseTitles.value[0].activeFlag = true

// 获取userId
const userId = ref<string | null>(null);

onMounted(async () => {
  // 从URL参数获取userId
  const searchParams = new URLSearchParams(window.location.search);
  let categoryId;
  //session?
  if (!searchParams.get('categoryId')) {
    categoryId = 1;
    // flag; tag is default
  }else{
    categoryId = parseInt(searchParams.get('categoryId')!);
  }

  const categoriesResponse = await categoryApi.getAllCategories();
  categories.value = categoriesResponse.data;
  console.log(categories.value);

  const singleCategoryResponse = await categoryApi.getCategoryDetail(1);
  singleCategory.value = singleCategoryResponse.data;
  console.log(singleCategory.value);

  const tagsResponse = await categoryApi.getTagListByCategoryId(1);
  tags.value = tagsResponse.data;
  console.log(tags.value);
  courseTitles.value = tags.value.map(tag => new NavigationButton(tag.name));

  let tagId;
  //session?
  if (!searchParams.get('tagId')) {
    let firstTag = tags.value[0];
    tagId = firstTag.tagId;
  }else{
    tagId = parseInt(searchParams.get('tagId')!);
  }

  const courseListVosResponse = await courseApi.getCourseListByTagId(tagId);
  courseListVos.value = courseListVosResponse.data;
  console.log(courseListVos.value);
      courseQuickViews.value = courseListVos.value.map(course => {
        return new CourseQuickView(
          course.courseId,
          course.coverImgUrl,
          course.title,
          course.score,
          course.originalPrice,
          new Date(course.updateTime || new Date()),
          course.totalMinutes,
          course.description,
          course.whatYouWillLearn
        );
      })
      console.log(courseQuickViews);
});



const navigaterBtnStyle = (activeFlag: boolean, hoverFlag: boolean) => ({
  backgroundColor: (activeFlag && hoverFlag) ? 'rgba(22,92,145,0.7)' :
    (hoverFlag ? 'rgba(22,92,145,0.3)' : (activeFlag ? 'rgb(22,92,145)' : 'gainsboro')),
  color: activeFlag ? 'gainsboro' : 'rgb(22,92,145)'
});

function changecourseTheme(i: NavigationButton) {
  courseTitles.value.forEach(element => {
    element.activeFlag = false;
  });
  i.activeFlag = true;
}
const voiceStyle = (index: number) => ({
  height: '3' + (index % 4 == 0 ? '6' : (index % 4 == 1 ? '9' : (index % 4 == 2 ? '3' : '0'))) + '0px'
})

const voiceCommentStyle = (index: number) => ({
  height: '1' + (index % 4 == 0 ? '6' : (index % 4 == 1 ? '9' : (index % 4 == 2 ? '3' : '0'))) + '0px'
})

const showCart = ref(false);
const selectedCourse = ref<{ title: string; courseId: number } | null>(null);

function addToCart(course: CourseQuickView) {
  selectedCourse.value = {
    title: course.title,
    courseId: course.courseId
  };
  showCart.value = true;
}

function handleCourseAdded(event: any) {
  console.log('课程已添加到购物车:', event);

  if (event.success) {
    // 成功处理
    if (event.isLocalStorage) {
      console.log(`✅ 课程 "${event.courseName}" 已添加到本地购物车（临时解决方案）`);
      // 可以在这里更新UI显示本地购物车状态
    } else {
      console.log(`✅ 课程 "${event.courseName}" 已成功添加到购物车`);
      // 这里可以添加更友好的成功提示，比如使用 toast 组件
      // 或者更新购物车图标上的数量显示
    }

  } else {
    // 错误处理
    console.error('❌ 添加课程到购物车失败:', event.error);

    if (event.errorType) {
      console.error('错误类型:', event.errorType);
    }

    if (event.errorMessage) {
      console.error('错误信息:', event.errorMessage);
    }

    // 根据错误类型进行不同的处理
    switch (event.errorType) {
      case 'database_error':
        console.error('🚨 数据库配置错误，需要后端修复');
        // 可以在这里添加错误上报逻辑
        break;
      case 'network_error':
        console.error('🌐 网络连接错误');
        // 可以在这里添加网络状态检测
        break;
      case 'unauthorized':
        console.error('🔒 用户未授权，需要重新登录');
        // 可以在这里添加重定向到登录页面的逻辑
        break;
      case 'already_in_cart':
        console.warn('ℹ️ 课程已在购物车中');
        // 可以在这里添加跳转到购物车页面的逻辑
        break;
      default:
        console.error('❓ 未知错误类型');
    }
  }
}

function handleCourseWishlisted(event: any) {
  console.log('课程已添加到愿望单:', event);
  // 可以显示成功提示
  console.log(`课程 "${event.courseName}" 已添加到愿望单`);
}
</script>

<template>
  <IconSprite />
  <main>
    <CartPopup v-model="showCart" :userId="userId || undefined" :courseName="selectedCourse?.title || ''"
      :courseId="selectedCourse?.courseId || undefined" :style="`width:${width};height:${height}`" />
    <PCHeader :userId="userId" />

    <div>

      <div class="title">{{singleCategory?.name}}</div>
      <div class="navigate">
        <button v-for="(title, index) in courseTitles" :key="index" @click="changecourseTheme(title)"
          @mouseenter="title.mouseEnter()" @mouseleave="title.mouseLeave()"
          :style="navigaterBtnStyle(title.activeFlag, title.hoverFlag)">
          {{ title.text }}</button>
      </div>

      <div class="content">
        <div v-for="(courseQuickView, index) in courseQuickViews" class="course"
          @mouseenter="courseQuickView.mouseEnter()" @mouseleave="courseQuickView.mouseLeave()">
          <div @click="goToCourse(courseQuickView.courseId)">
            <img :src="courseQuickView.coverImgUrl" alt="">
            <div class="course-title">
              {{ courseQuickView.title }}
            </div>
            <div class="course-rating">
              {{ courseQuickView.score }} ★★★★★ (2,187)
            </div>
            <div class="course-price">
              US${{ courseQuickView.originalPrice.toFixed(2) }}
            </div>
          </div>
          <!-- HoverPopup 组件 -->
          <HoverPopup v-model="courseQuickView.hoverFlag" width="270px" height="340px" transition="slide"
            :show-delay="150" :hide-delay="150" class="custom-popup-right" :userId="userId || undefined"
            :courseName="courseQuickView.title" :courseId="courseQuickView.courseId" @course-added="handleCourseAdded"
            @course-wishlisted="handleCourseWishlisted">
            <template #trigger>
              <div class="popup-trigger-area"></div>
            </template>
          </HoverPopup>
        </div>

      </div>
      <div class="container">
        <button class="exploreBtn">Explore More</button>
      </div>

      <div class="title">Voices across Commnities</div>
      <div class="voice-container container-scroll-x ">
        <div class="inContainer">

          <div v-for="(communityVoice, index) in communityVoices" class="comment" :style="voiceStyle(index)">
            <div>
              <svg width="80" height="40" viewBox="0 -10 48 48" fill="#35495e">
                <use href="#raphael--quote" />
              </svg>
            </div>
            <div class="voice-comment" :style="voiceCommentStyle(index)">{{ communityVoice.comment }}</div>
            <img class="voice-img" :src="communityVoice.userPictrue" alt="">
            <div class="voice-link">View {{ communityVoice.course }} ></div>
          </div>
        </div>
      </div>

    </div>
  </main>

</template>

<!-- css -->
<style scoped>
.title {
  font-size: 40px;
  min-width: 1000px;
  padding-top: 20px;
}

.navigate {
  max-width: 1400px;
  min-width: 1000px;
  margin: 0 auto;
}

.navigate button {
  margin: 0px 18px;
  height: 30px;
}


.content {
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(24%, 280px));
  gap: 1%;
  width: 80%;
  max-width: fit-content;
  min-width: 1000px;
  padding: 20px 0px;
}


.container,
.voice-container {
  margin: 0 auto;
  max-width: 1400px;
  height: 500px;
  overflow-x: scroll;
}

.inContainer {
  height: 450px;
}

.exploreBtn {
  height: 36px;
  margin: 0px 35% 0px;
  width: 30%;
  font-size: 20px;
  background-color: rgb(22, 92, 145);
  color: white;
  border-radius: 30px;
  padding: 5px;
  border: none;
  font-weight: 400;
  transition: all 0.3s ease;
}

.exploreBtn:hover {
  background-color: gainsboro;
  color: rgb(22, 92, 145);
  box-shadow: 0 4px 4px rgb(22, 92, 145, 0.3);
}

.course,
.comment {
  margin: 10px 1%;
  width: 100%;
}


.course {
  height: 300px;
  padding: 0px;
  overflow: visible;
}

.comment {
  width: 300px;
  height: 360px;
  margin: 20px 10px;
}



/* Course Text Content */
.course-title {
  padding: 10px 0px 0px 15px;
  font-weight: 700;
  font-size: 18px;
  color: #333;
  line-height: 1.3;
  height: 40px;
  overflow: hidden;
}

.course-rating {
  padding: 8px 0px 0px 15px;
  height: 20px;
  font-size: 14px;
  color: #b4690e;
  display: flex;
  align-items: center;
}

.course-price {
  padding: 8px 15px;
  height: 30px;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.course-update {
  font-size: 12px;
  font-weight: 500;
  color: rgb(22, 92, 145);
  margin: 5px 10px;
}

.course-duration {
  font-size: 13px;
  color: #6a6f73;
  margin: 5px 10px;
}

.course-description {
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  margin: 10px 5px;
  height: 72px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-learning-points h4 {
  font-size: 15px;
  margin-bottom: 8px;
  color: #333;
}

.course-learning-points p {
  height: 85px;
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popupBtn {
  display: flex;
}

.addToCartBtn {
  margin-inline: 6%;
  width: 160px;
  padding: 6px;
  height: 32px;
  font-size: 16px;
}

.addToWishlistBtn {
  height: 32px;
}

.addToWishlistBtn:hover {
  color: #ff2861;
  background-color: white;
}

.inContainer {
  display: inline-flex;
}
</style>
