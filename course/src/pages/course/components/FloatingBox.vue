<template>
  <div class="floating-box" :style="floatingBoxStyle()">
    <div class="price-section">
      <span class="video-pictrue">
        <img :src="courseVideo" alt="">
      </span>
      <span class="current-price">{{ currentPrice }}</span>
      <span class="original-price">{{ originalPrice }}</span>
      <span class="discount">{{ discount }}</span>
      <div class="time-left" v-if="timeLeft">{{ timeLeft }}</div>
    </div>
    <div class="action-buttons">
      <button class="add-to-cart" @click="emit('addToCart')">添加至购物车</button>
      <button class="buy-now" @click="emit('buyNow')">立即购买</button>
    </div>

    <div class="divider"></div>

    <div class="features" v-if="features.length > 0">
      <h3>{{ featuresTitle }}</h3>
      <ul>
        <li v-for="(feature, index) in features" :key="index">
          <input type="checkbox" :checked="feature.checked" disabled>
          {{ feature.text }}
        </li>
      </ul>
    </div>

    <div class="action-links">
      <a href="#" @click.prevent="emit('share')">{{ shareText }}</a>
      <a href="#" @click.prevent="emit('gift')">{{ giftText }}</a>
    </div>

  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { goToCart } from '@/components/common/header';
import { useWindowSize } from '@/useWindowSize'

const { width, height } = useWindowSize()


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
    default:'/src/images/image1.png'
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
const floatingBoxStyle = () => ({
  top:(scrollY.value>120)?'10px':`${120-scrollY.value}`+"px"
})
</script>

<style scoped>
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

.floating-box img{
  width: 100%;
  height: 140px;
}

.price-section {
  margin-bottom: 15px;
}

.current-price {
  font-size: 24px;
  font-weight: bold;
  color: #333;
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
  color: rgb(22,92,145);
  border: 1px solid rgb(22,92,145);
}

.add-to-cart:hover{
  background-color: rgba(22,92,145,0.1);
}

.buy-now {
  background-color: rgb(22,92,145);
  color: white;
}
.buy-now:hover{
  background-color: rgba(22, 92, 145, 0.8);

}

.divider {
  height: 1px;
  background-color: #e1e1e1;
  margin: 10px 0;
}

.features h3 {
  font-size: 16px;
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
  color: rgb(22,92,145);
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
}
</style>