<template>
  <div class="hover-popup-container" ref="containerRef">
    <!-- 触发区域 - 单独插槽 -->
    <div class="trigger-area" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <slot name="trigger"></slot>
    </div>

    <!-- 悬浮内容 - 独立插槽 -->
    <transition :name="transitionName">
      <div v-if="shouldShow" class="popup-content" :class="[positionClass, contentClass]" :style="contentStyle"
        @mouseenter="handlePopupEnter" @mouseleave="handlePopupLeave">
        <slot name="content" ></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import type { PropType } from 'vue';

type Position = 'right' | 'left' | 'top' | 'bottom';
type TransitionType = 'fade' | 'slide' | 'scale';

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
    height:{
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
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isVisible = ref(false);
    let showTimer: number | null = null;
    let hideTimer: number | null = null;

    const positionClass = computed(() => `position-${props.position}`);
    const transitionName = computed(() => `popup-${props.transition}`);

    const contentStyle = computed(() => ({
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
height:typeof props.height==='number'?`${props.height}px`:props.height,
      margin: typeof props.gap === 'number' ? `${props.gap}px` : props.gap
    }));

    const shouldShow = computed(() => {
      return props.modelValue !== undefined ? props.modelValue : isVisible.value;
    });

    watch(() => props.modelValue, (newVal) => {
      if (newVal !== undefined) {
        isVisible.value = newVal;
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

    return {
      isVisible,
      shouldShow,
      positionClass,
      transitionName,
      contentStyle,
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
  position:relative;
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
  top: -100%;
  left: -50%;
  transform: translateY(60px);
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
</style>