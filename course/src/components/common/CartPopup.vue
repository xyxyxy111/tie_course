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
            <img :src="courseInfo?.courseImage" alt="">
            <div class="product-info">
              {{ courseInfo?.courseName || courseName }}
            </div>
            <button class="go-to-cart-btn" @click="goToCart()">前往购物车</button>
          </div>

          <div class="recommendations">
            <h2>常见购买搭配</h2>

            <div class="recommendation-list">
              <div v-for="product in recommendedProducts" :key="product.courseId" class="product-card">
                <img :src="product.coverImgUrl" alt="">
                <div class="recommendationItem-detail">
                  <h3>{{ product.title }}</h3>
                  <div class="rating">
                    <span class="stars">★★★★</span>
                  </div>
                  <p class="price">¥{{ Number(product.currentPrice).toFixed(2) }}</p>
                </div>
              </div>
            </div>
            <div class="total-section" v-if="recommendedProducts.length > 0">
              <p class="total-price">总计： ¥{{ totalPrice }}</p>
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
import { courseApi } from '@/api/course';
// 定义课程信息接口
interface CourseInfo {
  courseName: string;
  courseImage: string;
  courseId: number | undefined;
  price: number;
  originalPrice?: number;
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

    // 推荐产品数据（将由接口返回填充）
    const recommendedProducts = ref<any[]>([]);

    // 相关主题（可根据课程返回填充，先保留静态）
    const relatedTopics = ref(['JavaScript', '前端开发', 'Web开发', '编程基础']);

    // 计算总价（使用当前价）
    const totalPrice = computed(() => {
      const sum = recommendedProducts.value.reduce((sum, product) => {
        const price = Number(product.currentPrice || 0);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
      return sum.toFixed(2);
    });

    // 拉取课程信息与配套课程
    const fetchCourseAndBundles = async () => {
      if (!props.courseId && !props.courseName) return;
      loading.value = true;
      error.value = null;
      try {
        // 优先根据 courseId 获取详情
        if (props.courseId) {
          const detailResp = await courseApi.getSingleCourseDetail(props.courseId);
          const c = detailResp.data;
          courseInfo.value = {
            courseName: c.title,
            courseImage: c.coverImgUrl,
            courseId: c.courseId,
            price: c.currentPrice,
            originalPrice: c.originalPrice
          };
          // 基于 tagId 与 courseId 获取配套课程（接口返回单个或列表均做兼容）
          const togetherResp = await courseApi.getCourseTogetherBuy(String(c.tagId), String(c.courseId));
          const data: any = togetherResp.data as any;
          const list = Array.isArray(data) ? data : [data];
          recommendedProducts.value = list.map((item: any) => ({
            courseId: item.courseId,
            title: item.title,
            coverImgUrl: item.coverImgUrl,
            currentPrice: item.currentPrice,
            originalPrice: item.originalPrice
          }));
        } else {
          // 仅有名称时，先展示基本信息占位
          courseInfo.value = {
            courseName: props.courseName,
            courseImage: '/src/images/image6.png',
            courseId: props.courseId,
            price: 0
          };
          recommendedProducts.value = [];
        }
      } catch (err: any) {
        console.error('获取课程或配套课程失败:', err);
        error.value = '获取课程或配套课程失败';
        recommendedProducts.value = [];
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
        const promises = recommendedProducts.value.map(product => addCourseToCart(product.courseId));
        await Promise.all(promises);
        console.log('所有推荐课程已添加到购物车');
      } catch (err) {
        console.error('批量添加课程失败:', err);
      }
    };

    // 跳转到购物车页面
    const goToCart = () => {
      window.location.href = '/cart.html';
    };

    // 监听显示与课程变更
    watch(() => props.modelValue, async (newVal) => {
      isVisible.value = newVal;
      if (newVal) {
        await fetchCourseAndBundles();
      }
    });
    watch(() => props.courseId, async (newVal) => {
      if (isVisible.value && newVal) {
        await fetchCourseAndBundles();
      }
    });

    const close = () => {
      isVisible.value = false;
      emit('update:modelValue', false);
    };

    // 初次挂载若已显示则获取
    onMounted(async () => {
      if (props.modelValue) {
        await fetchCourseAndBundles();
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
  font-size: 2.2rem;
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
  width: 135px;
  margin-top: 3px;
  height: 90px;
}

.shopping-cart-container button,
.topic-tag {
  width: fit-content;
  background-color: #215496;
  color: white;
  border: none;
  padding: 2px 5px;
  border-radius: 4px;
  cursor: pointer;
  height: 30px;
  font-size: 1.2rem;
  transition: all 0.3s;
  white-space: nowrap;
}

.shopping-cart-container button:hover,
.topic-tag:hover {
  background-color: white;
  color: #215496;
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
  width: 55%;
}

.shopping-cart-container h2 {
  font-size: 1.6rem;
  font-weight: bold;
}


.recommendation-list {
  display: block;
  margin-bottom: 5px;
}

.product-info {
  width: 45%;
  font-size: 1.2rem;
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
  font-size: 1.6rem;
}

.rating {
  color: #6c757d;
}

.stars {
  color: #ffc107;
}

.price {
  font-weight: bold;
  font-size: 1.2rem;
  color: #dc3545;
}

.total-section {
  display: flex;
  text-align: right;
}

.total-price {
  font-weight: bold;
  font-size: 1.8rem;
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