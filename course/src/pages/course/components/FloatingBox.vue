<template>
  <div class="floating-box" :style="floatingBoxStyle()">
    <div class="price-section">
      <span class="video-pictrue" @mouseover="hovered = true" @mouseleave="hovered = false"
        :class="{ hovered: hovered }" @click="goToVideoPage" title="点击播放">
        <img :src="courseVideo" alt="">

        <div class="overlay">
          <svg width="50" height="50" viewBox="0 0 16 16" fill="#eee">
            <use href="#solar--play-broken" />
          </svg>
        </div>
      </span>

      <span class="current-price">¥{{ currentPrice }}</span>
      <span class="original-price">¥{{ originalPrice }}</span>
      <span class="time-left" v-if="timeLeft">{{ timeLeft }}</span>
      <span class="card-heart" @click="emit('addToWishlist')">
        <svg :width="30" :height="30" viewBox="0 0 24 24" fill="#ff5252" stroke="#fff" stroke-width="2">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </span>
    </div>
    <div class="action-buttons">
      <button class="add-to-cart" @click="emit('addToCart')">添加至购物车</button>
      <button class="buy-now" @click="emit('buyNow')">立即购买</button>
    </div>

    <div class="divider"></div>
    <!-- 
    <div class="features" v-if="features.length > 0">
      <h3>{{ featuresTitle }}</h3>
      <ul>
        <li v-for="(feature, index) in features" :key="index">
          <input type="checkbox" :checked="feature.checked" disabled>
          {{ feature.text }}
        </li>
      </ul>
    </div> -->

    <div class="action-links">
      <a href="#" @click.prevent="emit('share')">{{ shareText }}</a>
      <a href="#" @click.prevent="emit('gift')">{{ giftText }}</a>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { goToVideo } from '@/components/common/header';
import { useWindowSize } from '@/useWindowSize'

const { width, height } = useWindowSize()

// 从URL中读取 courseId 以便跳转视频页
const getCourseIdFromQuery = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = parseInt(searchParams.get('courseId') || '');
  return Number.isFinite(courseId) ? courseId : null;
};

const goToVideoPage = () => {
  const courseId = getCourseIdFromQuery();
  if (courseId) {
    goToVideo(courseId);
  }
};

const scrollY = ref(0); // 存储滚动距离

const handleScroll = () => {
  scrollY.value = window.scrollY; // 更新响应式数据
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

const props = defineProps({
  courseVideo: {
    type: String,
    default: '/src/images/image1.png'
  },
  courseId: {
    type: Number,
    default: 85
  },
  currentPrice: {
    type: Number,
    default: 13.99
  },
  originalPrice: {
    type: Number,
    default: 94.99
  },
  discount: {
    type: Number,
    default: 85
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

const emit = defineEmits(['addToCart', 'buyNow', 'addToWishlist', 'share', 'gift', 'applyCoupon', 'couponApplied']);
const floatingBoxStyle = () => ({
  // top: (scrollY.value > 120) ? '10px' : `${120 - scrollY.value}` + "px"
})

const hovered = ref(false);  // 控制hover状态
</script>

<style scoped>
@import "/src/assets/rem.css";

.floating-box {
  position: fixed;
  left: 65%;
  width: 320px;
  background-color: white;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  z-index: 100;
}

.floating-box img {
  width: 100%;
  height: 140px;
}

.video-pictrue {
  display: block;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-pictrue:hover img {
  transform: scale(1.03);
  transition: transform 0.2s ease-in-out;
}

.video-pictrue {
  position: relative;
}

.video-pictrue .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  opacity: 0;
  z-index: 9999;
  transition: opacity 0.2s;
}

.video-pictrue.hovered .overlay {
  opacity: 1;
  pointer-events: auto;
}

.price-section {
  margin-bottom: 15px;
}

.current-price {
  font-size: 2.2rem;
  font-weight: bold;
  color: #333;
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
  flex-direction: column;
  gap: 10px;
}

.action-buttons button {
  padding: 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  width: 100%;
  margin: 0 auto;
  transition: all 0.3s;
}

.add-to-cart {
  background-color: #fff;
  color: #215496;
  border: 1px solid #215496;
}

.add-to-cart:hover {
  background-color: rgba(33, 84, 150, 0.1);
}

.buy-now {
  background-color: #215496;
  color: white;
}

.buy-now:hover {
  background-color: rgba(33, 84, 150, 0.8);
}

.divider {
  height: 1px;
  background-color: #e1e1e1;
  margin: 10px 0;
}

.features h3 {
  font-size: 1.6rem;
  margin-bottom: 10px;
}

.features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.features input[type="checkbox"] {
  margin-right: 8px;
}

.action-links {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.action-links a {
  color: #215496;
  text-decoration: underline;
  font-size: 1.4rem;
  cursor: pointer;
}


.card-heart {
  position: absolute;
  top: 170px;
  right: 20px;
  width: 30px;
  z-index: 9999;
}

.card-heart:hover {
  color: #d83b3b;
}
</style>
