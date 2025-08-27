<template>
  <div class="hover-popup-container">
    <div class="trigger-area" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <slot name="trigger"></slot>
    </div>

    <transition :name="transitionName">
      <div v-if="shouldShow" class="popup-content" :class="[positionClass, contentClass]" :style="contentStyle"
        @mouseenter="handlePopupEnter" @mouseleave="handlePopupLeave">
        <slot name="content" v-if="$slots.content"></slot>
        <template v-else>
          <div class="course-info">
            <div class="course-title">{{ courseInfo?.title || courseName }}</div>
            <div>
              <span class="course-update">更新日期 {{ courseInfo?.updateDate || '2025-03' }}</span>|
              <span class="course-duration">
                总共{{ courseInfo?.duration || '0' }}小时
              </span>
            </div>
            <div class="course-description">
              {{ courseInfo?.description || '课程描述加载中...' }}
            </div>
            <div class="course-learning-points">
              <h4>你将学到：</h4>
              <p>{{ courseInfo?.whatYouWillLearn || '学习要点加载中...' }}</p>
            </div>
          </div>
          <div class="popupBtn">
            <button class="addToCartBtn" @click="addToCart" :disabled="loading">
              {{ loading ? '添加中...' : '添加至购物车' }}
            </button>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import { cartApi } from '@/api/cart';
import type { CourseVO } from '@/api/course';
import { courseApi } from '@/api/course';
import { convertMinutesToHours,formatDateToYearMonth } from '@/utils/common';
import { wishlistApi } from '@/api/user';
import { goToCart, goToLogin } from './header';

type Position = 'right' | 'left' | 'top' | 'bottom';
type TransitionType = 'fade' | 'slide' | 'scale';

interface CourseInfo {
  title: string;
  description: string;
  whatYouWillLearn: string;
  updateDate: string;
  duration: number;
  courseId: number;
  price: number;
  coverImgUrl: string;
}

export default defineComponent({
  name: 'HoverPopup',
  props: {
    index: {
      type: Number,
      default: 1
    },
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
      default: 150
    },
    hideDelay: {
      type: Number,
      default: 1500
    },
    contentClass: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Boolean,
      default: undefined
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
  emits: ['update:modelValue', 'course-added', 'course-wishlisted'],
  setup(props, { emit }) {
    const isVisible = ref(false);
    const loading = ref(false);
    const courseInfo = ref<CourseInfo | null>(null);
    const courseVo = ref<CourseVO | null>(null);
    let showTimer: number | null = null;
    let hideTimer: number | null = null;

    let positionClass = computed(() => {
      if ((props.index + 1) % 4 === 0) {
        return 'position-left';
      } else {
        return 'position-right';
      }
    });
    const transitionName = computed(() => `popup-${props.transition}`);

    const contentStyle = computed(() => ({
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      height: typeof props.height === 'number' ? `${props.height}px` : props.height,
      margin: typeof props.gap === 'number' ? `${props.gap}px` : props.gap
    }));

    const shouldShow = computed(() => {
      return props.modelValue !== undefined ? props.modelValue : isVisible.value;
    });
    const fetchCourseInfo = async () => {
      if (!props.courseName || !props.courseId) return;
      const courseVoResponse = await courseApi.getSingleCourseDetail((props.courseId!));
      try {
        courseInfo.value = {
          title: courseVoResponse.data.title,
          description: courseVoResponse.data.description,
          whatYouWillLearn: courseVoResponse.data.whatYouWillLearn,
          updateDate: formatDateToYearMonth(courseVoResponse.data.updateTime!),
          duration: convertMinutesToHours(courseVoResponse.data.totalMinutes!),
          courseId: courseVoResponse.data.courseId!,
          price: courseVoResponse.data.originalPrice,
          coverImgUrl: courseVoResponse.data.coverImgUrl
        };
      } catch (err) {
        console.error('获取课程信息失败:', err);
      }
    };


    // 添加课程到购物车
    const addToCart = async () => {
      if (!props.userId || !courseInfo.value?.courseId) {
        console.warn('缺少用户ID或课程ID');
        alert('请先登录');
        goToLogin();
        return;
      }
      loading.value = true;
      try {
        const response = await cartApi.addCourseToCart(courseInfo.value.courseId);
        emit('course-added', {
          courseId: courseInfo.value.courseId,
          courseName: courseInfo.value.title,
          userId: props.userId,
          success: true
        });
        alert(`✅ 课程 "${courseInfo.value.title}" 已成功添加到购物车！`);

      } catch (err: any) {
        if (err === "课程已在购物车中") {
          alert('该课程已在购物车中');
        } else if (err === "课程已被购买") {
          alert('课程已被购买');
        }
        // console.error('添加课程到购物车失败:', err);

        let errorMessage = '添加课程到购物车失败';
        let errorType = 'unknown';
        emit('course-added', {
          courseId: courseInfo.value.courseId,
          courseName: courseInfo.value.title,
          userId: props.userId,
          success: false,
          error: err,
          errorMessage: errorMessage,
          errorType: errorType
        });

        if (errorType === 'database_error') {
          console.log("加入购物车失败");
        } else {
          // alert(errorMessage);
        }
      } finally {
        loading.value = false;
      }
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
  width: 100%;
}

.trigger-area {
  position: relative;
  z-index: 1;
  display: inline-block;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.popup-content {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  display: inline-block;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.4);
  padding: 16px;
  width: 100%;
  height: 100%;
}

.position-right {
  left: 100%;
  top: -20px;
  z-index: 1000;
}

.position-right::before {
  content: '';
  position: absolute;
  left: -12px;
  z-index: 1000;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 13px solid #fff;
}

.position-left {
  left: -108%;
  top: -12px;
}

.position-left::before {
  content: '';
  position: absolute;
  right: -10px;
  z-index: 1000;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 13px solid #fff;
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
.course-info {
  width: 100%;
  margin: 0 auto;
  height: 290px;
  overflow: hidden;
}

.course-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
}

.course-update {
  font-size: 1.2rem;
  font-weight: 500;
  color: #215496;
  margin-right: 5px;
}

.course-duration {
  font-size: 1.3rem;
  color: #6a6f73;
}

.course-description {
  font-size: 1.3rem;
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
  font-size: 1.4rem;
  margin-bottom: 6px;
  color: #333;
  font-weight: 600;
}

.course-learning-points p {
  font-size: 1.2rem;
  line-height: 1.4;
  color: #333;
  height: 100px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}

.addToCartBtn {
  margin-top: 12px;
  height: 32px;
  width: 100%;
  background-color: #215496;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bolder;
  cursor: pointer;
  transition: background-color 0.2s;
}

.addToCartBtn:hover:not(:disabled) {
  background-color: white;
  color: #215496
}

.addToCartBtn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>