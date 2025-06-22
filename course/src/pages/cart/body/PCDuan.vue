<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useWindowSize } from '@/useWindowSize';
import IconSprite from '@/components/Icon/IconSprite.vue';
import PCHeader from '@/components/common/PCHeader.vue';
import { useCartLogic } from '../components/content';
import '../cart.css';

const { width, height } = useWindowSize();
const { cart, totalPrice, goToCheckout } = useCartLogic();

const headerSpaceWidth = computed(() => Math.max(0, (width.value - 1200) / 2000));
const headerSpaceStyle = computed(() => ({
  padding: `calc(3vw * ${headerSpaceWidth.value})`
}));

const CourseInstructorStyle = () => ({});
const CourseTitleStyle = () => ({});
const CourseIncartStyle = () => ({});

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
</script>

<template>
  <IconSprite />
  <PCHeader :userId="userId" />
  <div class="cart-container">
    <div class="content" :style="headerSpaceStyle">
      <div class="cart-title">
        <h1>购物车</h1>
      </div>

      <div class="cart-items">
        <div v-for="item in cart?.cartItemList" :key="item.id" class="cart-item">
          <img :src="item.courseImage" :alt="item.courseName" class="course-image">
          <div class="course-info">
            <h3 class="course-title" :style="CourseTitleStyle()">{{ item.courseName }}</h3>
            <p class="course-instructor" :style="CourseInstructorStyle()">讲师信息</p>
            <div class="course-price">US${{ item.currentPrice.toFixed(2) }}</div>
          </div>
          <button class="remove-btn" @click="() => console.log('删除课程:', item.id)">删除</button>
        </div>
      </div>

      <div class="cart-summary">
        <div class="total">
          <span>总计:</span>
          <span class="total-price">US${{ totalPrice.toFixed(2) }}</span>
        </div>
        <button class="checkout-btn" @click="goToCheckout">去结算</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cart-title h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
}

.cart-items {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.course-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 20px;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 5px;
}

.course-instructor {
  color: #666;
  margin-bottom: 5px;
}

.course-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #165c91;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background: #c82333;
}

.cart-summary {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-size: 1.2rem;
  color: #333;
}

.total-price {
  font-weight: bold;
  color: #165c91;
  margin-left: 10px;
}

.checkout-btn {
  background: #165c91;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background: #134a7a;
}
</style>
