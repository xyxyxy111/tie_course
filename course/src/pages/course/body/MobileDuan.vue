<script lang="ts" setup>
import '../course.css'
import { RouterView, RouterLink } from 'vue-router';
import { computed, toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import { useWindowSize } from '@/useWindowSize';
import MoblieHeader from '@/components/common/MoblieHeader.vue';
import MobileBottom from '@/components/common/MobileBottom.vue';
const { width, height } = useWindowSize()

import { otherThemes, courseCurriculums, Comments } from '../components/content.ts'
const CourseDescriptionFlag = ref(false)
const CourseDescription = computed(() => {
  return CourseDescriptionFlag.value ? "收起" : "显示更多"
})

const props = defineProps({
  courseVideo: {
    type: String,
    default: '/src/images/image1.png'
  },
  currentPrice: {
    type: String,
    default: 'US$13.99'
  },
  originalPrice: {
    type: String,
    default: 'US$94.99'
  },
  discount: {
    type: String,
    default: '85% 折扣'
  },
  timeLeft: {
    type: String,
    default: '此优惠价格仅剩1天！'
  },
  // 特性列表
  featuresTitle: {
    type: String,
    default: '本课程包括：'
  },
  features: {
    type: Array,
    default: () => [
      { text: '10.5小时长的随选视频', checked: true },
      { text: '4篇文章', checked: true },
      { text: '在移动设备和电视上观看', checked: true },
      { text: '完整的永久访问权', checked: true },
      { text: '结业证书', checked: true }
    ]
  },

  // 操作链接
  shareText: {
    type: String,
    default: '分享'
  },
  giftText: {
    type: String,
    default: '将该课程作为礼物赠送'
  }
});

const emit = defineEmits(['addToCart', 'buyNow', 'share', 'gift', 'applyCoupon', 'couponApplied']);

const CourseDescriptionStyle = () => ({
  height: (CourseDescriptionFlag.value) ? 'fit-content' : '400px'
})

</script>

<!-- html -->
<template>
  <IconSprite />
  <main>
    <MoblieHeader />
    <div id="top-container">
      <div class="content">
        <div class="course-theme" v-if="width > 540">
          <h6> 开发 数据科学 R（编程语言）</h6>
        </div>

        <div class="divider" v-if="width > 540"></div>

        <div class="course-title">
          <h3> R Programming A-Z™: R For Data Science With Real Exercises!
          </h3>

        </div>

        <div class="course-introduction" v-if="width > 480">
          <h5>Learn Programming In R And R Studio. Data Analytics, Data Science, Statistical Analysis, Packages,
            Functions,
            GGPlot2</h5>

        </div>

        <div class="divider" v-if="width > 500"></div>

        <div class="update-time" v-if="width > 500">
          <h6>上次更新时间：2025年1月</h6>
        </div>

        <div class="language" v-if="width > 520">
          <h6> 中文 , 英语</h6>
        </div>

      </div>

      <div class="price-section">
        <div class="video-pictrue">
          <img :src="courseVideo" alt="">
        </div>
        <span class="current-price">{{ currentPrice }}</span>
        <span class="original-price">{{ originalPrice }}</span>
        <span class="discount">{{ discount }}</span>
        <div class="time-left" v-if="timeLeft">{{ timeLeft }}</div>
        <div class="action-buttons">
          <button class="add-to-cart" @click="emit('addToCart')">添加至购物车</button>
          <button class="buy-now" @click="emit('buyNow')">立即购买</button>
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

      <div class="course-descrpition" :style="CourseDescriptionStyle()">
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
      <button @click="CourseDescriptionFlag = !CourseDescriptionFlag;" class="course-descrpitionbtn">{{
        CourseDescription }}</button>

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



    <MobileBottom />
  </main>

</template>

<!-- css -->
<style scoped>
.price-section {
  margin: 15px;
  padding: 10px;
}

.video-picture {
  width: 80%;
}

.current-price {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-right: 10px;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
  margin-right: 10px;
}

.discount {
  font-size: 16px;
  color: #d83b3b;
  font-weight: bold;
}

.time-left {
  font-size: 14px;
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
  color: rgb(22, 92, 145);
}

.add-to-cart,
.buy-now {
  background-color: rgb(22, 92, 145);
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
  font-size: 16px;
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
</style>