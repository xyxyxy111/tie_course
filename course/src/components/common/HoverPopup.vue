<template>
  <div class="hover-popup-container" ref="containerRef">
    <!-- 触发区域 - 单独插槽 -->
    <div class="trigger-area" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <slot name="trigger"></slot>
    </div>

    <!-- 悬浮内容 - 动态内容 -->
    <transition :name="transitionName">
      <div v-if="shouldShow" class="popup-content" :class="[positionClass, contentClass]" :style="contentStyle"
        @mouseenter="handlePopupEnter" @mouseleave="handlePopupLeave">

        <!-- 课程标题 -->
        <div class="course-title">{{ courseInfo?.title || courseName }}</div>

        <!-- 课程信息 -->
        <div>
          <span class="course-update">更新日期 {{ courseInfo?.updateDate || '2025年3月' }}</span>|
          <span class="course-duration">
            总共{{ courseInfo?.duration || '0' }}小时
          </span>
        </div>

        <!-- 课程描述 -->
        <div class="course-description">
          {{ courseInfo?.description || '课程描述加载中...' }}
        </div>

        <!-- 学习要点 -->
        <div class="course-learning-points">
          <h4>你将学到：</h4>
          <p>{{ courseInfo?.whatYouWillLearn || '学习要点加载中...' }}</p>
        </div>

        <!-- 操作按钮 -->
        <div class="popupBtn">
          <button class="addToCartBtn" @click="addToCart" :disabled="loading">
            {{ loading ? '添加中...' : '添加到购物车' }}
          </button>
          <button class="addToWishlistBtn" @click="addToWishlist">
            <div class="icon">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="#35495e">
                <use href="#line-md--heart-filled" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import { cartApi } from '@/api/cart';

type Position = 'right' | 'left' | 'top' | 'bottom';
type TransitionType = 'fade' | 'slide' | 'scale';

// 定义课程信息接口
interface CourseInfo {
  title: string;
  description: string;
  whatYouWillLearn: string;
  updateDate: string;
  duration: string;
  courseId: number;
  price: number;
  coverImgUrl: string;
}

export default defineComponent({
  name: 'HoverPopup',
  props: {
    position: {
      type: String as PropType<Position>,
      default: 'right',
      validator: (value: string) => ['right', 'left', 'top', 'bottom'].includes(value)
    },
    width: {
      type: [String, Number],
      default: '300px'
    },
    height: {
      type: [String, Number],
      default: '300px'
    },
    gap: {
      type: [String, Number],
      default: '10px'
    },
    transition: {
      type: String as PropType<TransitionType>,
      default: 'fade',
      validator: (value: string) => ['fade', 'slide', 'scale'].includes(value)
    },
    showDelay: {
      type: Number,
      default: 100
    },
    hideDelay: {
      type: Number,
      default: 300
    },
    contentClass: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Boolean,
      default: undefined
    },
    // 新增属性
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
  emits: ['update:modelValue', 'course-added', 'course-wishlisted'],
  setup(props, { emit }) {
    const isVisible = ref(false);
    const loading = ref(false);
    const courseInfo = ref<CourseInfo | null>(null);
    let showTimer: number | null = null;
    let hideTimer: number | null = null;

    const positionClass = computed(() => `position-${props.position}`);
    const transitionName = computed(() => `popup-${props.transition}`);

    const contentStyle = computed(() => ({
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      height: typeof props.height === 'number' ? `${props.height}px` : props.height,
      margin: typeof props.gap === 'number' ? `${props.gap}px` : props.gap
    }));

    const shouldShow = computed(() => {
      return props.modelValue !== undefined ? props.modelValue : isVisible.value;
    });

    // 根据courseName获取课程信息
    const fetchCourseInfo = async () => {
      if (!props.courseName) return;

      try {
        // 这里可以根据courseName调用API获取课程详细信息
        // 暂时使用模拟数据
        courseInfo.value = {
          title: props.courseName,
          description: '这是一个精彩的课程，包含丰富的学习内容和实践项目。通过本课程，您将掌握相关技能并能够应用到实际工作中。',
          whatYouWillLearn: '掌握核心概念和技能\n学习最佳实践方法\n完成实际项目练习\n获得行业认证',
          updateDate: '2025年3月',
          duration: '45.5',
          courseId: props.courseId || 101,
          price: 99.99,
          coverImgUrl: '/src/images/image2.png'
        };
      } catch (err) {
        console.error('获取课程信息失败:', err);
      }
    };

    // 临时解决方案：使用本地存储作为备用
    const addToCartLocal = (courseInfo: CourseInfo) => {
      try {
        const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        const existingItem = localCart.find((item: any) => item.courseId === courseInfo.courseId);

        if (existingItem) {
          alert('ℹ️ 该课程已在购物车中');
          return;
        }

        const cartItem = {
          courseId: courseInfo.courseId,
          courseName: courseInfo.title,
          courseImage: courseInfo.coverImgUrl,
          price: courseInfo.price,
          addedAt: new Date().toISOString(),
          userId: props.userId
        };

        localCart.push(cartItem);
        localStorage.setItem('localCart', JSON.stringify(localCart));

        alert(`✅ 课程 "${courseInfo.title}" 已添加到本地购物车\n\n注意：由于系统维护，数据暂时存储在本地。`);

        // 触发事件通知父组件
        emit('course-added', {
          courseId: courseInfo.courseId,
          courseName: courseInfo.title,
          userId: props.userId,
          success: true,
          isLocalStorage: true
        });

      } catch (err) {
        console.error('本地存储失败:', err);
        alert('❌ 本地存储失败，请稍后重试');
      }
    };

    // 添加课程到购物车
    const addToCart = async () => {
      if (!props.userId || !courseInfo.value?.courseId) {
        console.warn('缺少用户ID或课程ID');
        alert('系统错误：缺少必要参数');
        return;
      }

      loading.value = true;
      try {
        const response = await cartApi.addCourseToCart(courseInfo.value.courseId);
        console.log('添加课程到购物车成功:', response);

        // 触发事件通知父组件
        emit('course-added', {
          courseId: courseInfo.value.courseId,
          courseName: courseInfo.value.title,
          userId: props.userId,
          success: true
        });

        // 显示成功提示
        alert(`✅ 课程 "${courseInfo.value.title}" 已成功添加到购物车！`);

      } catch (err: any) {
        console.error('添加课程到购物车失败:', err);

        // 详细的错误检测和处理
        let errorMessage = '添加课程到购物车失败';
        let errorType = 'unknown';

        if (err && typeof err === 'string') {
          if (err.includes('Data truncation') || err.includes('Truncated incorrect DOUBLE value')) {
            errorMessage = '⚠️ 系统数据库配置错误\n\n检测到数据库结构问题，是否使用本地存储作为临时解决方案？';
            errorType = 'database_error';
          } else if (err.includes('已在购物车中') || err.includes('already in cart')) {
            errorMessage = 'ℹ️ 该课程已在购物车中';
            errorType = 'already_in_cart';
          } else if (err.includes('未授权') || err.includes('unauthorized') || err.includes('401')) {
            errorMessage = '🔒 请先登录后再添加课程';
            errorType = 'unauthorized';
          } else if (err.includes('课程不存在') || err.includes('course not found')) {
            errorMessage = '❌ 课程不存在或已被删除';
            errorType = 'course_not_found';
          } else if (err.includes('网络') || err.includes('network') || err.includes('timeout')) {
            errorMessage = '🌐 网络连接失败，请检查网络后重试';
            errorType = 'network_error';
          }
        } else if (err && err.message) {
          if (err.message.includes('Data truncation')) {
            errorMessage = '⚠️ 系统数据库配置错误\n\n检测到数据库结构问题，是否使用本地存储作为临时解决方案？';
            errorType = 'database_error';
          } else if (err.message.includes('Network Error')) {
            errorMessage = '🌐 网络连接失败，请检查网络后重试';
            errorType = 'network_error';
          }
        }

        // 触发事件通知父组件
        emit('course-added', {
          courseId: courseInfo.value.courseId,
          courseName: courseInfo.value.title,
          userId: props.userId,
          success: false,
          error: err,
          errorMessage: errorMessage,
          errorType: errorType
        });

        // 显示错误提示
        if (errorType === 'database_error') {
          // 数据库错误提供本地存储选项
          const useLocalStorage = confirm(`${errorMessage}\n\n点击"确定"使用本地存储作为临时解决方案\n点击"取消"取消操作`);
          if (useLocalStorage && courseInfo.value) {
            addToCartLocal(courseInfo.value);
          }
        } else if (errorType === 'network_error') {
          // 网络错误提供重试选项
          const retry = confirm(`${errorMessage}\n\n是否重试？`);
          if (retry) {
            loading.value = false;
            setTimeout(() => addToCart(), 1000); // 1秒后重试
            return;
          }
        } else {
          // 其他错误显示简单提示
          alert(errorMessage);
        }
      } finally {
        loading.value = false;
      }
    };

    // 添加到愿望单
    const addToWishlist = () => {
      if (!props.userId || !courseInfo.value?.courseId) {
        console.warn('缺少用户ID或课程ID');
        return;
      }

      // 这里可以调用愿望单API
      console.log('添加到愿望单:', {
        userId: props.userId,
        courseId: courseInfo.value.courseId,
        courseName: courseInfo.value.title
      });

      // 触发事件通知父组件
      emit('course-wishlisted', {
        courseId: courseInfo.value.courseId,
        courseName: courseInfo.value.title,
        userId: props.userId
      });
    };

    watch(() => props.modelValue, (newVal) => {
      if (newVal !== undefined) {
        isVisible.value = newVal;
        if (newVal && props.courseName) {
          fetchCourseInfo();
        }
      }
    });

    watch(() => props.courseName, (newVal) => {
      if (newVal && shouldShow.value) {
        fetchCourseInfo();
      }
    });

    watch(isVisible, (newVal) => {
      if (props.modelValue !== undefined) {
        emit('update:modelValue', newVal);
      }
    });

    const clearTimers = () => {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const handleMouseEnter = () => {
      clearTimers();
      if (props.modelValue === undefined) {
        showTimer = window.setTimeout(() => {
          isVisible.value = true;
          if (props.courseName) {
            fetchCourseInfo();
          }
        }, props.showDelay);
      }
    };

    const handleMouseLeave = () => {
      clearTimers();
      if (props.modelValue === undefined) {
        hideTimer = window.setTimeout(() => {
          isVisible.value = false;
        }, props.hideDelay);
      }
    };

    const handlePopupEnter = () => {
      clearTimers();
    };

    const handlePopupLeave = () => {
      handleMouseLeave();
    };

    // 组件挂载时获取课程信息
    onMounted(() => {
      if (props.courseName && shouldShow.value) {
        fetchCourseInfo();
      }
    });

    return {
      isVisible,
      shouldShow,
      positionClass,
      transitionName,
      contentStyle,
      courseInfo,
      loading,
      addToCart,
      addToWishlist,
      handleMouseEnter,
      handleMouseLeave,
      handlePopupEnter,
      handlePopupLeave
    };
  }
});
</script>

<style scoped>
.hover-popup-container {
  display: inline-block;
  z-index: 200;
}

.trigger-area {
  display: inline-block;
  cursor: pointer;
}

.popup-content {
  position: relative;
  display: inline-block;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  left: 20px;
  z-index: 1000;
}

/* 位置类 */

.position-right {
  left: 102%;
  top: -285px;
}

.position-right::before {
  content: '';
  position: absolute;
  left: -12px;
  z-index: 100;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 13px solid #fff;
  filter: drop-shadow(-2px 0 1px rgba(0, 0, 0, 0.1));
}

.position-left {
  right: 102%;
  top: -100%;
}

.position-left::before {
  content: '';
  position: absolute;
  right: -12px;
  z-index: 100;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 13px solid #fff;
  filter: drop-shadow(-2px 0 1px rgba(0, 0, 0, 0.1));
}

.position-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.position-bottom {
  left: -20%;
  transform: translateY(5px);
}

/* 动画效果 */
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.3s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.popup-slide-enter-active,
.popup-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.popup-slide-enter-from,
.popup-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.position-left .popup-slide-enter-from,
.position-left .popup-slide-leave-to {
  transform: translateX(-10px);
}

.popup-scale-enter-active,
.popup-scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.popup-scale-enter-from,
.popup-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 课程内容样式 */
.course-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
}

.course-update {
  font-size: 12px;
  font-weight: 500;
  color: rgb(22, 92, 145);
  margin-right: 5px;
}

.course-duration {
  font-size: 13px;
  color: #6a6f73;
}

.course-description {
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  margin: 10px 0;
  height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-learning-points h4 {
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
  font-weight: 600;
}

.course-learning-points p {
  font-size: 12px;
  line-height: 1.4;
  color: #333;
  height: 100px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}

.popupBtn {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.addToCartBtn {
  flex: 1;
  height: 30px;
  padding: 4px 12px;
  background-color: rgb(22, 92, 145);
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.addToCartBtn:hover:not(:disabled) {
  background-color: white;
}

.addToCartBtn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.addToWishlistBtn {
  height: 30px;
  padding: 8px;
  background-color: white;
  color: rgb(22, 92, 145);
  border-radius: 40px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.addToWishlistBtn:hover {
  color: red;
}

.addToWishlistBtn .icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>