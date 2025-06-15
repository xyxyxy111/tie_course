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
import { goToCart } from '@/components/common/header.ts';
import { recommendedProducts, relatedTopics } from '../components/content';
import { useCourseDescription, useCart, otherThemes, courseCurriculums, Comments } from '../components/content';

const { width, height } = useWindowSize()
const { CourseDescriptionFlag, CourseDescription, CourseDescriptionStyle } = useCourseDescription();
const { showCart, cartTitle, addToCart, goToCheckout } = useCart();

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
</script>

<template>
  <!-- 保持原有template内容完全不变 -->
  <IconSprite />
  <main>
    <!-- 原有所有HTML结构保持不变 -->
  </main>
</template>

<style scoped>
/* 保持原有所有样式不变 */
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

/* 其他所有样式保持不变 */
</style>