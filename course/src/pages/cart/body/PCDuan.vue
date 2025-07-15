<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useWindowSize } from '@/useWindowSize';
import IconSprite from '@/components/Icon/IconSprite.vue';
import PCHeader from '@/components/common/PCHeader.vue';

// 导入共享的数据和逻辑
import { useCartLogic, useCartUtils } from '../components/content';
import { wishlistApi } from '@/api/user';
import '../cart.css';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { cartApi } from '@/api/cart';

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
});

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
  <PCHeader :userId="userId" />
  <div class="cart-container">
    <div class="content" :style="headerSpaceStyle">
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
          <div class="cart-items-section" style="position:relative;">
            <div class="cart-items">
              <div v-for="item in cart.cartItemList" :key="item.id" class="cart-item">
                <img :src="item.courseImage" :alt="item.courseName" class="course-image">
                <div class="course-info">
                  <h3 class="course-title" :style="CourseTitleStyle()">{{ item.courseName }}</h3>
                  <p class="course-instructor" :style="CourseInstructorStyle()">讲师信息</p>
                  <div class="course-price">¥{{ item.currentPrice.toFixed(2) }}</div>
                </div>
                <div class="course-actions">
                  <button class="wishlist-btn" @click="addToWishlist(item.courseId)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                  <button class="remove-btn" @click="removeFromCart(item.courseId)">删除</button>
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
              <div class="summary-item total-row">
                <span>总计:</span>
                <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
              </div>
              <button class="checkout-btn" @click="goToCheckout">去结算</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  min-height: 100vh;
  padding: 20px 0;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.cart-title h1 {
  font-size: 3rem;
  color: #333;
  margin: 20px;
}

.cart-items {
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.course-image {
  width: 180px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  font-weight: 600;
}

.course-instructor {
  color: #666;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.course-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #165c91;
}

.course-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  margin-left: 20px;
}

.wishlist-btn,
.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s ease;
  white-space: nowrap;
  width: 50px;
}

.wishlist-btn {
  background-color: none;
  color: #215486;
}

.shopping-cart-container .checkout-section .checkout-btn {
  margin-bottom: 10px;
  width: 120px;
  margin-left: calc(100% - 120px);
  white-space: nowrap;
  padding: 8px 0px;
  background: #215486;
}

.wishlist-btn:hover {
  color: red;
}

.wishlist-btn svg {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.wishlist-btn:hover svg {
  transform: scale(1.1);
}

.remove-btn {
  background-color: #215486;
  color: white;
  font-size: 1.2rem;
  white-space: nowrap;
}

.remove-btn:hover {
  transform: translateY(-2px);
  font-size: 1.3rem;
  background-color: white;
  color: #215486;
}

.remove-btn:active {
  transform: translateY(0);
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
  flex: 0 0 65%;
  padding-bottom: 60px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkout-section {
  flex: 0 0 30%;
  position: sticky;
  top: 20px;
  height: fit-content;
}


.checkout-btn {
  background: linear-gradient(135deg, #165c91 0%, #134a7a 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(33, 84, 150, 0.3);
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 84, 150, 0.4);
  background: linear-gradient(135deg, #134a7a 0%, #0d3a5f 100%);
}

.checkout-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(33, 84, 150, 0.3);
}

/* 加载状态样式 */
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 错误状态样式 */
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
  font-size: 48px;
  margin-bottom: 20px;
}

.empty-cart h2 {
  margin-bottom: 10px;
  color: #333;
  font-size: 24px;
}

.empty-cart p {
  margin-bottom: 30px;
  font-size: 16px;
}

.browse-btn {
  background: linear-gradient(135deg, #165c91 0%, #134a7a 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(33, 84, 150, 0.3);
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 84, 150, 0.4);
  background: linear-gradient(135deg, #134a7a 0%, #0d3a5f 100%);
}
</style>
