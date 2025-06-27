<template>
  <!-- 使用 v-show 或 v-if 控制整体显示 -->
  <div v-if="isVisible">
    <!-- 遮罩层 -->
    <transition name="fade">
      <div class="cart-popup-overlay" @click.self="close"></div>
    </transition>

    <!-- 弹窗内容 -->
    <transition :name="transitionName">
      <div class="popup-content">
        <div class="shopping-cart-container container-scroll-y">
          <!-- 添加成功提示 -->
          <h2>已添加至购物车</h2>
          <div class="added-notification">
            <img :src="courseInfo?.courseImage || '/src/images/image6.png'" alt="">
            <div class="product-info">
              {{ courseInfo?.courseName || courseName }}
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
              <p class="total-price">总计： US${{ totalPrice }}</p>
              <button class="add-all-btn" @click="addAllToCart">全部添加至购物车</button>
            </div>
          </div>

          <!-- 相关主题 -->
          <div class="related-topics">
            <h2>相关主题</h2>
            <div class="topic-tags">
              <span v-for="topic in relatedTopics" :key="topic" class="topic-tag">{{ topic }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { cartApi } from '@/api/cart';
// 定义课程信息接口
interface CourseInfo {
  courseName: string;
  courseImage: string;
  courseId: number | undefined;
  price: string;
}

export default defineComponent({
  name: 'CartPopup',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: 'slide'
    },
    userId: {
      type: String,
      default: undefined
    },
    courseName: {
      type: String,
      default: ''
    },
    courseId: {
      type: Number,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isVisible = ref(props.modelValue);
    const courseInfo = ref<CourseInfo | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // 推荐产品数据（可以根据courseName动态获取）
    const recommendedProducts = ref([
      {
        id: 1,
        name: 'JavaScript 完整指南',
        coverImgUrl: '/src/images/image1.png',
        rating: 4.8,
        reviewCount: 1250,
        price: 'US$49.99',
        courseId: 101
      },
      {
        id: 2,
        name: 'React 实战开发',
        coverImgUrl: '/src/images/image2.png',
        rating: 4.7,
        reviewCount: 890,
        price: 'US$39.99',
        courseId: 102
      },
      {
        id: 3,
        name: 'Vue.js 从入门到精通',
        coverImgUrl: '/src/images/image3.png',
        rating: 4.9,
        reviewCount: 1100,
        price: 'US$44.99',
        courseId: 103
      }
    ]);

    // 相关主题（可以根据courseName动态获取）
    const relatedTopics = ref(['JavaScript', '前端开发', 'Web开发', '编程基础']);

    // 计算总价
    const totalPrice = computed(() => {
      return recommendedProducts.value.reduce((sum, product) => {
        const price = parseFloat(product.price.replace('US$', ''));
        return sum + price;
      }, 0).toFixed(2);
    });

    // 根据courseName获取课程信息
    const fetchCourseInfo = async () => {
      if (!props.courseName) return;

      loading.value = true;
      try {
        // 这里可以根据courseName调用API获取课程详细信息
        // 暂时使用模拟数据
        courseInfo.value = {
          courseName: props.courseName,
          courseImage: '/src/images/image6.png',
          courseId: props.courseId,
          price: 'US$99.99'
        };
      } catch (err) {
        error.value = '获取课程信息失败';
        console.error('获取课程信息失败:', err);
      } finally {
        loading.value = false;
      }
    };

    // 添加课程到购物车
    const addCourseToCart = async (courseId: number) => {
      if (!courseId) return;

      try {
        const response = await cartApi.addCourseToCart(courseId);
        console.log('添加课程成功:', response);
        return response;
      } catch (err) {
        console.error('添加课程失败:', err);
        throw err;
      }
    };

    // 添加所有推荐课程到购物车
    const addAllToCart = async () => {
      try {
        const promises = recommendedProducts.value.map(product =>
          addCourseToCart(product.courseId)
        );
        await Promise.all(promises);
        console.log('所有推荐课程已添加到购物车');
        // 可以显示成功提示
      } catch (err) {
        console.error('批量添加课程失败:', err);
        // 可以显示错误提示
      }
    };

    // 跳转到购物车页面
    const goToCart = () => {
      window.location.href = '/cart.html';
    };

    // 监听 prop 变化
    watch(() => props.modelValue, (newVal) => {
      isVisible.value = newVal;
      if (newVal && props.courseName) {
        fetchCourseInfo();
      }
    });

    // 监听courseName变化
    watch(() => props.courseName, (newVal) => {
      if (newVal && isVisible.value) {
        fetchCourseInfo();
      }
    });

    const close = () => {
      isVisible.value = false;
      emit('update:modelValue', false);
    };

    // 组件挂载时获取课程信息
    onMounted(() => {
      if (props.courseName && isVisible.value) {
        fetchCourseInfo();
      }
    });

    return {
      isVisible,
      close,
      courseInfo,
      loading,
      error,
      recommendedProducts,
      relatedTopics,
      totalPrice,
      addAllToCart,
      goToCart,
      transitionName: computed(() => `cart-popup-${props.transition}`)
    };
  }
});
</script>

<style scoped>
.cart-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 400vh;
  height: 100vh;
  background-color: rgba(238, 238, 238, 0.9);
  z-index: 999;
  transition: opacity 0.3s ease;
}

/* 弹窗样式 */
.popup-content {
  position: fixed;
  top: 400px;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 400px;
  height: 600px;
  border-radius: 20px;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

.shopping-cart-container {
  width: 100%;
  margin: 0 auto;
}

.added-notification {
  display: flex;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  align-items: center;
  margin-bottom: 15px;
}

.added-notification img {
  width: 30%;
  margin-top: 3px;
  height: fit-content;
}

.shopping-cart-container button,
.topic-tag {
  width: fit-content;
  background-color: rgb(22, 92, 145);
  color: white;
  border: none;
  padding: 2px 5px;
  border-radius: 4px;
  cursor: pointer;
  height: 30px;
  font-size: 12px;
  transition: all 0.3s;
}

.shopping-cart-container button:hover,
.topic-tag:hover {
  background-color: white;
  color: rgb(22, 92, 145);
}

.recommendations {
  display: inline-block;
  width: 100%;
  margin-bottom: 30px;
}

.recommendations img {
  width: 45%;
  height: 100%;
}

.recommendationItem-detail {
  margin-left: 10px;
}

.shopping-cart-container h2 {
  font-size: 16px;
  font-weight: bold;
}


.recommendation-list {
  display: block;
  margin-bottom: 5px;
}

.product-info {
  width: 45%;
  font-size: 12px;
  text-align: left;
  margin: 5px;
}

.product-card {
  width: 100%;
  height: 100px;
  display: flex;
  margin: 5px;
  padding: 5px;
  border-radius: 8px;

}

.product-card h3 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  height: 45px;
  font-size: 16px;
}

.rating {
  color: #6c757d;
}

.stars {
  color: #ffc107;
}

.price {
  font-weight: bold;
  font-size: 12px;
  color: #dc3545;
}

.total-section {
  display: flex;
  text-align: right;
}

.total-price {
  font-weight: bold;
  font-size: 18px;
}

.add-all-btn {
  position: absolute;
  right: 30px;
}

.topic-tag {
  margin: 10px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.container-scroll-y {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-color: white;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>