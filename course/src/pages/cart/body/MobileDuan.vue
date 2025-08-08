<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useWindowSize } from '@/useWindowSize';
import IconSprite from '@/components/Icon/IconSprite.vue';
import MobileHeader from '@/components/common/MoblieHeader.vue';

// 导入共享的数据和逻辑
import { useCartLogic, useCartUtils } from '../components/content';
import { wishlistApi } from '@/api/user';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { cartApi } from '@/api/cart';
import '../cart.css';

const { width, height } = useWindowSize();

// 使用共享的数据和逻辑
const {
  cart,
  userId,
  loading,
  error,
  totalPrice,
  totalOriginalPrice,
  savedAmount,
  fetchCart,
  addCourseToCart,
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

onMounted(() => {
  // 从token获取userId
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  }
});

const headerSpaceWidth = computed(() => Math.max(0, (width.value - 1200) / 2000));
const headerSpaceStyle = computed(() => ({
  padding: `calc(3vw * ${headerSpaceWidth.value})`
}));

const CourseInstructorStyle = () => ({});
const CourseTitleStyle = () => ({});
const CourseIncartStyle = () => ({});

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

// 加入心愿单
const addToWishlist = async (courseId: number) => {
  try {
    console.log('正在添加课程到心愿单，courseId:', courseId);
    const response = await wishlistApi.addToWishlist(courseId);
    console.log('添加心愿单成功:', response);
    alert('课程已添加到心愿单');
  } catch (error: any) {
    console.error('添加心愿单失败:', error);
    let errorMessage = '添加失败，请重试';
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        errorMessage = '请先登录';
      } else if (status === 409) {
        errorMessage = '课程已在心愿单中';
      } else if (data && data.message) {
        errorMessage = data.message;
      }
    }
    alert(errorMessage);
  }
};

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
</script>

<template>
  <IconSprite />
  <MobileHeader />
  <div class="cart-container">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="!cart?.cartItemList || cart.cartItemList.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>购物车为空</h2>
      <p>您还没有添加任何课程到购物车</p>
    </div>
    <div v-else class="cart-layout">
      <div class="cart-title">
        <h1>购物车</h1>
      </div>
      <div class="cart-main-content">

        <div class="cart-items-section">
          <div class="cart-count">购物车中有{{ cart?.cartItemList?.length || 0 }}门课程</div>

          <div class="cart-items">
            <div v-for="item in cart.cartItemList" :key="item.id" class="cart-item">
              <div class="course-image">
                <img :src="item.courseImage" :alt="item.courseName" class="course-image">
                <div class="course-price">¥{{ item.currentPrice.toFixed(2) }}</div>
              </div>
              <div class="course-info">
                <h3 class="course-title" :style="CourseTitleStyle()">{{ item.courseName }}</h3>
                <p class="course-instructor" :style="CourseInstructorStyle()">iClass</p>

                <div class="course-rating">
                  <span class="course-score">4.9</span>
                  <span class="course-stars">
                    <span v-for="i in 5" :key="i" class="star filled">★</span>
                  </span>
                  <span class="course-count">(1,025)</span>
                </div>

                <div class="course-tag">热门课程</div>
              </div>
              <div class="course-actions">
                <button @click="addToWishlist(item.courseId)">
                  移至心愿单
                </button>
                <button @click="removeFromCart(item.courseId)">删除</button>
                <button>保存以供之后购买</button>
              </div>
            </div>
          </div>
          <button class="clear-cart-btn" @click="handleClearCart" :disabled="clearing || loading"
            v-if="cart && cart.cartItemList && cart.cartItemList.length > 0">
            {{ clearing ? '清空中...' : '清空' }}
          </button>
        </div>

        <div class="checkout-section">
          <div class="checkout-summary">
            <div>总计:</div>
            <div class="summary-item total-row">

              <div class="total-price">¥{{ totalPrice.toFixed(2) }}</div>
            </div>
            <div class="summary-item">
              <span>课程数量:</span>
              <span>{{ cart.cartItemList.length }} 门课程</span>
            </div>
            <div class="summary-item" v-if="savedAmount > 0">
              <span>原价:</span>
              <span class="original-price">¥{{ totalOriginalPrice.toFixed(2) }}</span>
            </div>
            <div class="summary-item" v-if="savedAmount > 0">
              <span>节省:</span>
              <span class="saved-amount">-¥{{ savedAmount.toFixed(2) }}</span>
            </div>


            <div class="pay-btn-group">
              <button class="pay-btn wechat" @click="">
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
              </button>
            </div>

            <!-- 
              <button class="checkout-btn" @click="goToCheckout">去结算</button> -->

          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
@import "@/assets/rem.css";

.cart-container {
  padding-inline: 0px;
}

.cart-title h1 {
  font-size: 2.2rem;
  font-weight: bold;
  color: #333;
  margin: 0px 16px 12px;
}

.cart-main-content {
  display: flex;
  flex-direction: column;
  min-width: 400px;
}

.cart-items {
  padding: 10px 0px;
}

.course-image {
  width: 150px;
  height: 125px;
}

.course-image img {
  width: 100%;
  height: 100px;
}

.course-price {
  padding-top: 0px;
  font-size: 1.2rem;
}

.course-title {
  font-size: 1.6rem;
}

.course-instructor,
.course-rating,
.course-tag {
  font-size: 1rem;
}

.course-actions button {
  font-size: 1rem;
}
</style>