<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useWindowSize } from '@/useWindowSize';
import IconSprite from '@/components/Icon/IconSprite.vue';
import MobileHeader from '@/components/common/MoblieHeader.vue';
import { useCartLogic } from '../components/content';
import { wishlistApi } from '@/api/user';
import '../cart.css';

const { width, height } = useWindowSize();
const { cart, totalPrice, goToCheckout, loading, error, removeCourseFromCart } = useCartLogic();

// 获取userId
const userId = ref<string | null>(null);

onMounted(() => {
  // 从URL参数获取userId
  const searchParams = new URLSearchParams((window as any).location.search);
  const urlUserId = searchParams.get('userId');
  if (urlUserId) {
    userId.value = decodeURIComponent(urlUserId);
  }
});

const headerSpaceWidth = computed(() => Math.max(0, (width.value - 1200) / 2000));
const headerSpaceStyle = computed(() => ({
  padding: `calc(3vw * ${headerSpaceWidth.value})`
}));

const CourseInstructorStyle = () => ({});
const CourseTitleStyle = () => ({});
const CourseIncartStyle = () => ({});

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
  <MobileHeader :userId="userId" />
  <div class="shopping-cart-container" :style="headerSpaceStyle">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="() => (window as any).location.reload()">重试</button>
    </div>

    <!-- 空购物车状态 -->
    <div v-else-if="!cart?.cartItemList || cart.cartItemList.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>购物车为空</h2>
      <p>您还没有添加任何课程到购物车</p>
      <button class="browse-btn" @click="() => (window as any).location.href = '/course.html'">浏览课程</button>
    </div>

    <!-- 购物车内容 -->
    <div v-else class="content">
    <div class="title">Shopping Cart</div>
      <div class="course-list">
        <h1>{{ cart.cartItemList.length }} Courses in Cart</h1>
        <div class="course-items-container">
          <div v-for="course in cart.cartItemList" :key="course.id" class="course-item">
            <!-- 图片区域 -->
            <div class="course-image-section">
              <img :src="course.courseImage" alt="" class="course-image">
              </div>

            <!-- 内容区域 -->
            <div class="course-content-section">
              <h2 class="course-title">{{ course.courseName }}</h2>
              <div class="course-price">${{ course.currentPrice }}</div>
              </div>

            <!-- 按钮区域 -->
            <div class="course-actions-section">
              <button class="wishlist-btn" @click="() => addToWishlist(course.courseId)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
              <button class="remove-btn" @click="() => removeFromCart(course.courseId)">删除</button>
              </div>
              </div>
              </div>
      </div>

      <div class="checkout-section">
        <div class="checkout-summary">
          <div class="total-label">Total:</div>
          <div id="totalPrice"> ${{ totalPrice }}</div>
          <button @click="goToCheckout">Proceed to checkout →</button>
          <hr>
          <div class="promotion-label">Promotions</div>
          <div class="coupon-section">
            <input type="text" name="couponId" id="coupon">
            <button class="coupon-btn">Apply</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shopping-cart-container .content {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  border-radius: 10px;
  width: 100%;
  min-width: 400px;
  padding: 20px 0px;
  border: none;
  margin-bottom: 100px;
}

.shopping-cart-container .course-list {
  width: 100%;
}

.shopping-cart-container .checkout-section {
  margin: 0 auto;
  width: 90%;
}

.shopping-cart-container .title {
  min-width: fit-content;
  font-size: 36px;
  text-align: left;
  font-weight: 600;
  padding-top: 10px;
  padding-left: 10%;
  white-space: nowrap;
  font-family: 'Times New Roman', Times, serif
}

.shopping-cart-container .course-item img {
  width: 100%;
  max-width: 180px;
  height: 120px;
  margin-right: 20px;
}

.shopping-cart-container .course-title {
  margin-bottom: 10px;
  overflow: hidden;
}

.shopping-cart-container .checkout-summary {
  border: none;
  margin: 0 auto;
}

.shopping-cart-container .checkout-summary div {
  margin: 0 auto;
  font-weight: 700;
  font-size: 16px;
  padding-inline: 20px;
}

.shopping-cart-container .checkout-summary #totalPrice {
  font-size: 36px;
}

.shopping-cart-container .course-list h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  padding: 0 20px;
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

/* 空购物车样式 */
.empty-cart {
  text-align: center;
  padding: 80px 20px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin: 20px;
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
  box-shadow: 0 4px 15px rgba(22, 92, 145, 0.3);
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 92, 145, 0.4);
  background: linear-gradient(135deg, #134a7a 0%, #0d3a5f 100%);
}

/* 课程项目容器 */
.course-items-container {
  padding: 0 20px;
}

/* 课程项目布局 */
.course-item {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 图片区域 */
.course-image-section {
  flex: 0 0 120px;
  margin-right: 15px;
}

.course-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 内容区域 */
.course-content-section {
  flex: 1;
  min-width: 0;
  margin-right: 15px;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-price {
  font-size: 18px;
  font-weight: bold;
  color: #165c91;
}

/* 按钮区域 */
.course-actions-section {
  flex: 0 0 100px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.wishlist-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s ease;
  white-space: nowrap;
  width: 80px;
}

.wishlist-btn:hover {
  background-color: #f8f9fa;
  border-color: red;
  color: red;
}

.wishlist-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.wishlist-btn:hover svg {
  transform: scale(1.1);
}

.remove-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
  color: white !important;
  border: none !important;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
  white-space: nowrap;
  width: 80px;
}

.remove-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%) !important;
  color: white !important;
}

.remove-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .course-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 15px;
  }

  .course-image-section {
    flex: none;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .course-image {
    width: 100%;
    max-width: 200px;
    height: 120px;
  }

  .course-content-section {
    flex: none;
    margin-right: 0;
    margin-bottom: 15px;
    width: 100%;
  }

  .course-title {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .course-price {
    font-size: 20px;
  }

  .course-actions-section {
    flex: none;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }

  .wishlist-btn {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 80px;
  }

  .remove-btn {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 80px;
  }
}

@media (max-width: 360px) {
  .course-actions-section {
    flex-direction: column;
    gap: 8px;
  }

  .wishlist-btn {
    width: 100%;
    max-width: 120px;
  }

  .remove-btn {
    width: 100%;
    max-width: 120px;
  }
}
</style>