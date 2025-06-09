<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import '../index.css'
import { toRef, ref, onMounted, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import PCBottom from '@/components/common/PCBottom.vue';
import { NavigationButton } from '../components/widget/NavigateButton';
import { useWindowSize } from '@/useWindowSize';
import HoverPopup from '@/components/common/HoverPopup.vue';
import CartPopup from '@/components/common/CartPopup.vue';

const { width, height } = useWindowSize()
import {
  courseTitles,
  courseQuickViews, communityVoices,
  recommendedProducts, relatedTopics
} from '../components/content.ts';

courseTitles.value[0].activeFlag = true


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




function tocourse() {

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
    <PCHeader />

    <div>

      <div class="title">Software Engineering courses</div>
      <div class="navigate">
        <button v-for="(title, index) in courseTitles" :key="index" @click="changecourseTheme(title)"
          @mouseenter="title.mouseEnter()" @mouseleave="title.mouseLeave()"
          :style="navigaterBtnStyle(title.activeFlag, title.hoverFlag)">
          {{ title.text }}</button>
      </div>

      <div class="content">
        <div v-for="(courseQuickView, index) in courseQuickViews" @click="tocourse()" class="course"
          @mouseenter="courseQuickView.mouseEnter()" @mouseleave="courseQuickView.mouseLeave()">
          <img :src="courseQuickView.coverImgUrl" alt="">
          <div class="course-title">
            {{ courseQuickView.title }}
          </div>
          <div class="course-rating">
            {{ courseQuickView.score }} ★★★★ (2,187)
          </div>
          <div class="course-price">
            US${{ courseQuickView.originalPrice.toFixed(2) }}
          </div>

          <!-- HoverPopup 组件 -->
          <HoverPopup v-model="courseQuickView.hoverFlag" width="270px" height="340px" transition="slide"
            :show-delay="200" :hide-delay="300" class="custom-popup-right">
            <template #trigger>
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
      <div class="container">
        <button class="exploreBtn">Explore More</button>
      </div>

      <div class="title">Voices across Commnities</div>
      <div class="voice-container container-scroll-x ">
        <div class="inContainer">

          <div v-for="(communityVoice, index) in communityVoices" @click="toComment()" class="comment"
            :style="voiceStyle(index)">
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
    <PCBottom />
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
  grid-template-columns: repeat(4, minmax(24%,280px));
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
  margin: 0px  35% 100px;
  width:30%;
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
