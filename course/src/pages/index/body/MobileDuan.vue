<script lang="ts" setup>
import '../index.css';
import { toRef, ref, onMounted, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import { NavigationButton } from '../components/widget/NavigateButton';
import { useWindowSize } from '@/useWindowSize';
import MoblieHeader from '@/components/common/MoblieHeader.vue';
import MobileBottom from '@/components/common/MobileBottom.vue';
import CartPopup from '@/components/common/CartPopup.vue';
import HoverPopup from '@/components/common/HoverPopup.vue';
import {
  courseTitles,
  courseQuickViews, communityVoices,
  recommendedProducts, relatedTopics
} from '../components/content.ts';

courseTitles.value[0].activeFlag = true
const { width, height } = useWindowSize()

const voiceStyle = (index: number) => ({
  height: '3' + (index % 4 == 0 ? '6' : (index % 4 == 1 ? '9' : (index % 4 == 2 ? '3' : '0'))) + '0px'
})

const voiceCommentStyle = (index: number) => ({
  height: '1' + (index % 4 == 0 ? '6' : (index % 4 == 1 ? '9' : (index % 4 == 2 ? '3' : '0'))) + '0px'
})

const FontSize = computed(() => {
  const calculatedValue = (width.value - 200) / 50;
  return Math.min(16, Math.max(0, calculatedValue));
});

const titleStyle = () => ({
  fontSize: `calc(12px + 2px * ${FontSize.value})`,
  transition: 'none'
})


const navigaterBtnStyle = (activeFlag: boolean, hoverFlag: boolean) => ({
  backgroundColor: (activeFlag && hoverFlag) ? 'rgba(22,92,145,0.7)' :
    (hoverFlag ? 'rgba(22,92,145,0.3)' : (activeFlag ? 'rgb(22,92,145)' : 'gainsboro')),
  color: activeFlag ? 'gainsboro' : 'rgb(22,92,145)',
  fontSize: `calc(8px + 0.8px * ${FontSize.value})`,
  height: `calc(24px + 0.8px * ${FontSize.value})`,
  paddingInline: `calc(8px + 1.2px * ${FontSize.value})`,
  transition: 'background-color 0.3s'
});

//切换主题

function changeCourseTheme(i: NavigationButton) {
  courseTitles.value.forEach(element => {
    element.activeFlag = false;
  });
  i.activeFlag = true;
}

const CourseBtnStyle = (flag: boolean) => ({
  top: (flag) ? '-65%' : '20%'
});

function toCourse() {

}


function toComment() {

}



// 
const showCart = ref(false);
const cartTitle = ref('')

function addToCart(course: string) {
  cartTitle.value = course;
  showCart.value = true;
  console.log(cartTitle.value + "" + showCart.value)
}


</script>

<!-- html -->
<template>
  <IconSprite />
  <main>
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
            <button class="go-to-cart-btn">前往购物车</button>
          </div>


          <div class="recommendations">
            <h2>常见购买搭配</h2>

            <div class="recommendation-list">
              <div v-for="product in recommendedProducts" :key="product.id" class="product-card">
                <img :src="product.coverImgUrl" alt="">
                <div class="recommendationItem-detail">
                  <h3>{{ product.name }}</h3>
                  <div class="rating">
                    <span class="stars">★★★★</span>
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
    <MoblieHeader />
    <div>

      <div class="title" :style="titleStyle()">Software Engineering Courses</div>
      <div class="navigate  container-scroll-x">
        <button v-for="(title, index) in courseTitles" :key="index" @click="changeCourseTheme(title)"
          @mouseenter="title.mouseEnter()" @mouseleave="title.mouseLeave()"
          :style="navigaterBtnStyle(title.activeFlag, title.hoverFlag)">
          {{ title.text }}</button>
      </div>
      <div class="container container-scroll-x">
        <div class="content">
          <div v-for="(courseQuickView, index) in courseQuickViews" @click="toCourse()" class="course"
            @mouseenter="courseQuickView.mouseEnter()" @mouseleave="courseQuickView.mouseLeave()">
            <img :src="courseQuickView.coverImgUrl" alt="">
            <div class="course-title">
              {{ courseQuickView.title }}
            </div>
            <!-- 评分 -->
            <div class="course-rating">
              {{ courseQuickView.score }} ★★★★ (2,187)
            </div>

            <!-- 价格 -->
            <div class="course-price">
              US${{ courseQuickView.originalPrice.toFixed(2) }}
            </div>



            <!-- HoverPopup 组件 -->
            <HoverPopup v-model="courseQuickView.hoverFlag" width="270px" height="310px" transition="slide"
              :show-delay="200" :hide-delay="300" class="custom-popup-right">
              <template #trigger>
                <!-- 空触发区域（由父元素控制） -->
                <div class="popup-trigger-area"></div>
              </template>
              <template #content>
                <!-- 弹窗内容 -->
                <div class="course-title">{{ courseQuickView.title }}</div>
                <div>
                  <span class="course-update">更新日期 2025年3月</span>|
                  <span class="course-duration">
                    总共{{ (courseQuickView.totalMinutes / 60).toFixed(1) }}小时
                  </span>
                </div>
                <div class="course-description">
                  {{ courseQuickView.description }}
                </div>
                <div class="course-learning-points">
                  <h4>你将学到：</h4>
                  <p>{{ courseQuickView.whatYouWillLearn }}</p>
                </div>
                <div class="popupBtn">
                  <button class="addToCartBtn" @click="addToCart(courseQuickView.title)">添加到购物车</button>
                  <button class="addToWishlistBtn">
                    <div class="icon">
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="#35495e">
                        <use href="#line-md--heart-filled" />
                      </svg>
                    </div>
                  </button>
                </div>
              </template>
            </HoverPopup>
          </div>

        </div>
      </div>

      <div class="title" :style="titleStyle()">Voices across Commnities</div>
      <div class="voice-container container-scroll-x">
        <div class="inContainer">

          <div v-for="(communityVoice, index) in communityVoices" @click="toComment()" class="comment"
            :style="voiceStyle(index)">
            <div>
              <svg width="70" height="35" viewBox="0 -10 48 48" fill="#35495e">
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

    <MobileBottom />
  </main>

</template>

<!-- css -->
<style scoped>
.title {
  overflow: hidden;
  min-width: 400px;
  width: 100%;
}

.navigate {
  width: 100%;
  min-width: 400px;
  height: 50px;
  margin-top: 30px;
}

.navigate button,
.Course button {
  margin: 0px 0.6rem;
  height: 32px;
}

.Course button {
  margin: 8px auto;
}


.content {
  width: 2000px;
  height: 320px;
  display: inline-flex;
  overflow-x: scroll;
  overflow-y: hidden;
  grid-gap: 0.6rem;
  padding-inline: 1%;
}


.course,
.comment {
  height: 280px;
  padding: 10px;
  width: 240px;
  margin-left: 10px;
}

.course {
  margin: 20px 0px 0px;
  padding: 0%;
  overflow: visible;
}


.course-title {
  padding: 5px 0px 0px 15px;
  font-weight: 700;
  font-size: 18px;
  color: #333;
  line-height: 1.3;
  height: 40px;
  overflow: hidden;
}

.course-rating {
  padding: 5px 0px 0px 15px;
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
  font-size: 10px;
  font-weight: 500;
  color: rgb(22, 92, 145);
  margin: 5px 10px;
}

.course-duration {
  font-size: 11px;
  color: #6a6f73;
  margin: 5px 10px;
}

.course-description {
  font-size: 11px;
  line-height: 1.4;
  color: #333;
  margin: 10px 5px;
  height: 64px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-learning-points h4 {
  font-size: 12px;
  margin-bottom: 8px;
  color: #333;
}

.course-learning-points p {
  height: 75px;
  font-size: 10px;
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
  font-size: 14px;
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
  overflow: scroll;
}

</style>


<!-- 
/* Course Card Container */


/* Slide Transition */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

-->