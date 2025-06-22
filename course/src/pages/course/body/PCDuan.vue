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
import {
  courseTitles, NavigationButton,
  courseQuickViews, communityVoices,
} from '../components/content.ts';

const { width, height } = useWindowSize()
const { CourseDescriptionFlag, CourseDescription } = useCourseDescription();
const { showCart, cartTitle, addToCart, goToCheckout } = useCart();

courseTitles.value[0].activeFlag = true

// 获取userId
const userId = ref<string | null>(null);

onMounted(() => {
  // 从URL参数获取userId
  const searchParams = new URLSearchParams(window.location.search);
  const urlUserId = searchParams.get('userId');
  if (urlUserId) {
    userId.value = decodeURIComponent(urlUserId);
  }
});

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
  <PCHeader :userId="userId" />
  <FloatingBox />
  <div id="top-container">
    <div class="content">
      <div class="course-theme">
        <h6> 开发 数据科学 R（编程语言）</h6>
      </div>

      <div class="divider"></div>

      <div class="course-title">
        <h3> R Programming A-Z™: R For Data Science With Real Exercises!
        </h3>

      </div>

      <div class="course-introduction">
        <h5>Learn Programming In R And R Studio. Data Analytics, Data Science, Statistical Analysis, Packages,
          Functions,
          GGPlot2</h5>

      </div>

      <div class="divider"></div>

      <div class="update-time">
        <h6>上次更新时间：2025年1月</h6>
      </div>

      <div class="language">
        <h6> 中文 , 英语</h6>
      </div>

    </div>

  </div>

  <div id="course-detail">
    <div class="what-you-will-learn">
      <h1>您将会学到</h1>
      <ul>
        <li>從完全不會寫程式，做出10款應用程式</li>
        <li>學習如何撰寫 Swift 程式碼</li>
        <li>
          學習紮實的程式觀念，從變數觀念教到類別、物件、協定與 MVC 程式設計
        </li>
      </ul>
    </div>

    <div class="other-theme">
      <h1>浏览相关主题</h1>
      <button v-for="otherTheme in otherThemes">
        {{ otherTheme.title }}
      </button>

    </div>

    <div class="course-content">
      <h1>课程内容</h1>
      <h3>10个章节·100个讲座·总时长10小时10分钟</h3>
      <ul>
        <li v-for="courseCurriculum in courseCurriculums">
          <span class="curriculum-title">{{ courseCurriculum.title }}</span>
          <span class="lectrue-duration">{{ courseCurriculum.lectures }}个讲座·{{ courseCurriculum.duration }}个小时</span>
        </li>
      </ul>
    </div>

    <div class="course-descrpition" :style="CourseDescriptionStyle">
      <h1>描述</h1>
      <h4>您想找一份寫程式的工作嗎？
        您想要開發自己的 iPhone App 嗎？
        歡迎來到「深入淺出 iPhone 開發」課程。

        我是魏巍。Udemy 大中華地區 iPhone 開發課程合作講師。
        目前我已經上架了40 款 iPhone Apps。
        包括曾登上台灣區冠軍的「黃色小鴨爆炸了」，
        以及台灣區第二名的「指認嫌疑犯」。

        我撰寫書籍，也在資策會、Alpha Camp、赫綵電腦與各大專院校教授程式課程。
        完全沒有程式基礎也沒有關係，我會從最基礎的概念開始教，
        我真的都會解釋地超清楚。
        同時也會給同學很多練習機會。
        不僅教您概念，
        還真的帶您實際製作出10 款應用程式。
        會教地圖、多媒體，以及連結網路 API。
        我去年的 Swift3 課程在 Udemy 已經有超過 1300 多位同學報名，
        除了線上學習，內容很豐富，同學留言問我問題，我也會回答。
        超多人都留下了好評。

        今年我準備更豐富、更超值的中文教學，
        能夠省去您看英文書的時間。
        不管您是想要找工作、想要接案，
        或是自己想要做自己的 App，
        都能以最簡單最快速的方式達到目的。
        歡迎來學習全世界最爆炸成長的語言，
        一起來做自己的 iPhone 應用程式吧！


        製作 10 款 Apps

        Hello Swift
        解鎖大師
        小小算命師
        質數判斷
        Color Finder
        快樂鋼琴
        待辦事項
        電子書
        使用者產生器
        RSS閱讀器

        課程內容包括:

        安裝 Xcode
        超詳細的 Swift 語言介紹
        超實用的 UIKit 元件知識
        完整的 AutoLayout 技巧
        多場景應用程式製作(TabBar, Navigation)
        表格視圖應用程式的開發
        地圖
        多媒體
        連結網路與解析下載資料

        課程要求

        無須程式背景，一般人就可以學習
        無需成為付費的 Apple 開發者，一般人就可以學習
        需要蘋果電腦(iMac、MacBook Air、MacBook、MacBook Pro，Mac Mini 任一可)


        可以學到什麼？

        從完全不會寫程式，做出10款應用程式。
        學習如何撰寫 Swift 程式碼。
        學習紮實的程式觀念，從變數觀念教到類別、物件、協定與 MVC 程式設計。
        培養程式的能力，找到更好、更多金的工作。

        誰可以學？

        只要有興趣，每個人都可以學。
        想要學習寫程式的您。沒有寫程式的經驗也沒有關係。
        想要找一份寫程式的工作，轉換工作跑道的追夢者。
        此课程面向哪些人：
        只要有興趣，每個人都可以學
        想要學習寫程式的您。沒有寫程式的經驗也沒有關係
        想要找一份寫程式的工作，轉換工作跑道的追夢者

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