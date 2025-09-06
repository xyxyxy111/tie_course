<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useWindowSize } from '@/useWindowSize';
import IconSprite from '@/components/Icon/IconSprite.vue';
import PCHeader from '@/components/common/PCHeader.vue';
import { useWishlist } from '@/composables/useWishlist';
import { useCartLogic, useCartUtils } from '../components/content';
import { wishlistApi } from '@/api/user';
import '../cart.css';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { cartApi } from '@/api/cart';
import {
  goToIndex, goToCourse
} from '@/components/common/header.ts';

import {
  createAliPayment,
} from '@/pages/order/content';
const { width, height } = useWindowSize();


import {
  fetchHottestCourse,
  hottestCourseQuickViews
} from '@/pages/index/components/content'
const { fetchWishlist, addToWishlist } = useWishlist();

// 使用共享的数据和逻辑
const {
  cart,
  cartList,
  userId,
  loading,
  error,
  totalPrice,
  totalOriginalPrice,
  savedAmount,
  fetchCart,
  removeCourseFromCart,
  clearCart,
  goToCheckout
} = useCartLogic();

const {
  formatPrice,
  formatDiscount,
  formatTime,
  isCartEmpty,
  getCartItemCount,
  isUserLoggedIn,
  goToLogin
} = useCartUtils();

const headerSpaceWidth = computed(() => Math.max(0, (width.value - 1200) / 2000));
const headerSpaceStyle = computed(() => ({
  padding: `calc(3vw * ${headerSpaceWidth.value})`
}));

const CourseInstructorStyle = () => ({});
const CourseTitleStyle = () => ({});
const CourseIncartStyle = () => ({});

onMounted(() => {
  // 从token获取userId
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  }
  fetchHottestCourse();
});


// 从购物车删除
const removeFromCart = async (courseId: number) => {
  try {
    console.log('正在从购物车删除课程，courseId:', courseId);
    await removeCourseFromCart(courseId);
    console.log('删除购物车成功');
    alert('课程已从购物车删除');
  } catch (error: any) {
    console.error('删除购物车失败:', error);
    alert('删除失败，请重试');
  }
};

// 清空购物车
const clearing = ref(false);
const handleClearCart = async () => {
  if (clearing.value) return;
  if (isCartEmpty(cart.value)) return;
  if (!confirm('确定要清空购物车吗？')) return;
  clearing.value = true;
  try {
    await clearCart();
    alert('购物车已清空');
  } catch (error) {
    alert('清空购物车失败，请重试');
  } finally {
    clearing.value = false;
  }
};
</script>

<template>
  <IconSprite />
  <PCHeader />
  <div class="cart-container">

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    <div v-else-if="cart?.cartItemList?.length == 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>购物车为空</h2>
      <p>您还没有添加任何课程到购物车</p>
      <div @click="goToIndex()">
        <a href="#">挑选你喜欢的课程</a>
      </div>
    </div>
    <div v-else class="cart-layout">
      <div class="cart-title">
        <h1>购物车
        </h1>
      </div>
      <div class="cart-main-content">

        <div class="cart-items-section">
          <div class="cart-count">购物车中有{{ cart?.cartItemList?.length }}门课程</div>

          <div class="cart-items">
            <div v-for="item in cartList" :key="item.id" class="cart-item">
              <img :src="item.courseImage" :alt="item.courseName" class="course-image">
              <div class="course-info">
                <h3 class="course-title" :style="CourseTitleStyle()">{{ item.courseName }}</h3>
                <p class="course-instructor" :style="CourseInstructorStyle()">iClass</p>

                <div class="course-rating">
                  <div class="course-tag">热门课程</div>
                  <span class="course-score">4.9</span>
                  <span class="course-stars">
                    <span v-for="i in 5" :key="i" class="star filled">★</span>
                  </span>
                  <span class="course-count">(1,025)</span>

                </div>


              </div>
              <div class="course-actions">
                <button @click="addToWishlist(item.courseId)">
                  移至心愿单
                </button>
                <button @click="removeFromCart(item.courseId)">删除</button>
                <button>保存以供之后购买</button>
              </div>
              <div class="course-price">¥{{ item.currentPrice.toFixed(2) }}</div>

            </div>
          </div>
          <!-- <button class="clear-cart-btn" @click="handleClearCart" :disabled="clearing || loading"
            v-if="cart && cartList && cartList.length > 0">
            {{ clearing ? '清空中...' : '清空' }}
          </button> -->
        </div>

        <div class="checkout-section">
          <div class="checkout-summary">
            <div>总计:</div>
            <div class="summary-item total-row">
              <div class="total-price">¥{{ totalPrice.toFixed(2) }}</div>
            </div>
            <!-- 
            <div class="summary-item">
              <span>课程数量:</span>
              <span>{{ cartList?.length }} 门课程</span>
            </div>
            <div class="summary-item" v-if="savedAmount > 0">
              <span>原价:</span>
              <span class="original-price">¥{{ totalOriginalPrice.toFixed(2) }}</span>
            </div>
            <div class="summary-item" v-if="savedAmount > 0">
              <span>节省:</span>
              <span class="saved-amount">-¥{{ savedAmount.toFixed(2) }}</span>
            </div> -->


            <div class="pay-btn-group">
              <!-- <button class="pay-btn wechat" @click="">
                <span class="icon">
                  <svg width="29" height="28" viewBox="0 0 24 24" fill="#27b148">
                    <use href="#ic--baseline-wechat" />
                  </svg>
                </span>
                微信进行结算
                <span class="arrow">→</span>
                <span class="lightning"></span>
              </button>
              <div class="pay-divider"><span></span>或<span></span></div>
              <button class="pay-btn alipay" @click="">
                <span class="icon">
                  <svg width="26" height="28" viewBox="0 0 24 24" fill="#27b148">
                    <use href="#bi--alipay" />
                  </svg>
                </span>
                支付宝进行结算
                <span class="arrow">→</span>
                <span class="lightning"></span>
              </button> -->

              <button class="pay-btn" @click="goToCheckout">去结算</button>

            </div>


          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="watching-section">
    <h2 class="watching-title">您可能会喜欢</h2>
    <div class="watching-cards-row">
      <div class="watching-card" v-for="(course, index) in hottestCourseQuickViews" :key="index"
        @mouseenter="course.mouseEnter()" @mouseleave="course.mouseLeave()">
        <div>
          <div @click="goToCourse(course.courseId)">
            <div class="watching-card-cover">
              <img :src="course.coverImgUrl" alt="课程封面" />
            </div>

            <div class="watching-card-title">{{ course.title }}</div>
            <div class="watching-card-author">iClass</div>
            <div class="watching-card-rating">
              <span class="watching-card-score">4.9</span>
              <span class="watching-card-stars">
                <span v-for="i in 5" :key="i" class="star filled">★</span>
              </span>
              <span class="watching-card-count">(1,025)</span>
            </div>
            <div class="course-price-container">
              <span class="current-price">¥{{ course.currentPrice }}</span>
              <span class="original-price">¥{{ course.originalPrice }}</span>
            </div>
            <div class="course-tag">热门课程</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "/src/assets/rem.css";

.cart-container {
  padding: 20px 20px;
  width: 1400px;
  margin: 0 auto;
}

.cart-title h1 {
  font-size: 4.8rem;
  font-weight: bold;
  color: #333;
  margin: 18px;
}

.cart-count {
  font-size: 1.6rem;
  margin-left: 20px;
  font-weight: bold;
}

.cart-items {
  padding: 20px;
  width: 960px;
}

.cart-item {
  display: flex;
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.course-image {
  width: 200px;
  height: 117px;
  object-fit: cover;
  margin-right: 20px;
}

.course-info {
  width: 400px;
  height: 130px;
  min-width: 0;
}

.course-title {
  font-size: 1.8rem;
  color: #333;
  margin: 8px 0px;
  line-height: 1.4;
  font-weight: 1000;
}

.course-instructor {
  color: #666;
  margin: 4px 0px;
  font-size: 1.2rem;
}

.course-rating {
  font-size: 1.2rem;
  color: #F36224;
  font-weight: bold;
  margin: 4px 0px;
}

.star {
  margin-left: 2px;
}

.course-tag {
  display: inline-block;
  background-color: rgba(33, 84, 150, 0.13);
  color: rgb(22, 92, 125);
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 10px;
  margin: 2px 10px 2px 0px;
}

.course-price {
  width: 100px;
  text-align: right;
  padding-top: 2px;
  align-self: start;
  font-size: 1.8rem;
  font-weight: bold;
  color: #222;
}

.course-actions {
  height: 130px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-items: flex-start;
  align-items: flex-end;
  margin-inline: 1.6rem;
}

.course-actions button {
  font-size: 1.5rem;
  margin: 5px 0px;
  border: none;
  background-color: white;
  color: #215496;
  cursor: pointer;
  font-weight: bold;
}

.clear-cart-btn {
  position: absolute;
  right: 24px;
  bottom: 24px;
  margin: 0;
  width: fit-content;
  white-space: nowrap;
  padding: 8px 18px;
  background: #fff;
  color: #dc3545;
  border: none;
  height: 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-cart-btn:hover:not(:disabled),
.clearcart-btn:hover:not(:disabled) {
  background: #dc35467d;
  color: #fff;
}

.clear-cart-btn:disabled,
.clearcart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cart-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cart-main-content {
  display: flex;
  gap: 20px;
  min-height: 500px;
}

.cart-items-section {
  position: relative;
  flex: 0 0 65%;
  padding-bottom: 60px;
  background: white;
  border-radius: 8px;
  border: none;
}

.checkout-section {
  flex: 0 0 30%;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.checkout-summary {
  background: white;
  border-radius: 8px;
  padding: 24px;
  font-size: 16px;
}

.checkout-summary .total-price {
  margin-bottom: 30px;
  height: 30px;
  color: rgba(16, 16, 16, 1);
  font-size: 36px;
  text-align: left;
  font-family: PingFangSC-bold;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.summary-item:last-of-type {
  border-bottom: none;
}

.summary-item span {
  font-size: 1rem;
  color: #666;
}

.summary-item .subtotal {
  font-weight: 600;
  color: #333;
}

.summary-item.total-row {
  border-bottom: 2px solid #eee;
}

.summary-item.total-row span {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.course-price-container {
  margin-left: 18px;
  margin-bottom: 10px;
  height: 20px;
  line-height: 23px;
  color: rgba(16, 16, 16, 1);
  font-size: 16px;
  text-align: left;
  font-family: PingFangSC-bold;
}

.original-price {
  margin-left: 8px;
  text-decoration: line-through;
  color: #999;
}

.saved-amount {
  color: #e74c3c;
  font-weight: bold;
}

.pay-btn-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
  margin-top: 20px;
}

.pay-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #215496;
  color: #fff;
  font-size: 1.6rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  padding: 16px 0;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}

.pay-btn .icon {
  margin-right: 5px;
  width: 28px;
  height: 28px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
}

.pay-btn .arrow {
  margin-left: 10px;
  font-size: 2.2rem;
}

.pay-btn .lightning {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
}

.pay-divider {
  display: flex;
  align-items: center;
  color: #aaa;
  font-size: 1.6rem;
  margin: 8px 0;
}

.pay-divider span {
  flex: 1;
  height: 1px;
  background: #eee;
  margin: 0 8px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #165c91;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}


.error {
  text-align: center;
  padding: 40px;
  color: #dc3545;
}

.error button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.error button:hover {
  background: #c82333;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 20px;
}

.empty-icon {
  font-size: 4.8rem;
  margin-bottom: 20px;
}

.empty-cart h2 {
  margin-bottom: 10px;
  color: #333;
  font-size: 2.4rem;
}

.empty-cart p {
  margin-bottom: 30px;
  font-size: 1.6rem;
}

.watching-section {
  margin: 0 auto;
  padding-left: 5px;
  width: 1320px;
  overflow: hidden;
}

.watching-title {
  height: 40px;
  line-height: 39px;
  color: rgba(16, 16, 16, 1);
  font-size: 28px;
  text-align: left;
  font-family: PingFangSC-bold;
  margin: 24px 36px;
}

.watching-cards-row {
  margin-inline-start: 20px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding-inline: 15px;
  width: fit-content;
  max-width: 100%;
  transition: all 0.3s;
}

.watching-card {
  position: relative;
  width: 300px !important;
  height: 350px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  overflow: visible;
  border: 1px solid #a3c7fd52;
}

.watching-card .watching-card-cover img {
  width: 100%;
  height: 175px;
  background: #f7f7f7;
  display: flex;
  z-index: inherit;
}

.watching-card .watching-card-title {
  font-size: 1.6rem;
  font-weight: normal;
  margin: 8px 20px;
  font-family: PingFangSC-bold;
}

.watching-card .watching-card-author {
  font-size: 1.2rem;
  font-weight: normal;
  margin: 3px 20px 6px 20px;
}

.watching-card .watching-card-rating {
  font-size: 1.2rem;
  color: #F36224;
  font-weight: bold;
  margin: 15px 20px 10px 20px;
}

.watching-card-count {
  height: 20px;
  line-height: 17px;
  color: rgba(136, 136, 136, 1);
  font-size: 12px;
  text-align: left;
  font-family: PingFangSC-regular;
}

.watching-card .course-tag {
  margin: 5px 20px;
}
</style>
