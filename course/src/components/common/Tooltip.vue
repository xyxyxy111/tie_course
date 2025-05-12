<template>
  <div class="tooltip-wrapper" ref="wrapperRef">
    <!-- 触发元素 -->
    <div 
      @mouseenter="showTooltip" 
      @mouseleave="hideTooltip"
      class="tooltip-trigger"
    >
      <slot name="trigger"></slot>
    </div>
    
    <!-- 悬浮窗内容 -->
    <transition name="fade">
      <div 
        v-show="isVisible"
        class="tooltip-content"
        :class="`tooltip-${position}`"
      >
        <slot>{{ content }}</slot>
        <div class="tooltip-arrow" :style="arrowStyle"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

type Position = 'top' | 'bottom' | 'left' | 'right'

export default defineComponent({
  name: 'Tooltip',
  props: {
    content: String,
    position: {
      type: String as () => Position,
      default: 'top',
      validator: (val: Position) => ['top', 'bottom', 'left', 'right'].includes(val)
    },
    offset: {
      type: Number,
      default: 8
    }
  },
  setup(props) {
    const isVisible = ref(false)
    const wrapperRef = ref<HTMLElement | null>(null)

    // 箭头位置计算
    const arrowStyle = computed(() => {
      const size = 6
      return {
        width: `${size * 2}px`,
        height: `${size * 2}px`,
        [props.position]: `-${size}px`
      }
    })

    const showTooltip = () => isVisible.value = true
    const hideTooltip = () => isVisible.value = false

    return { 
      isVisible, 
      wrapperRef,
      arrowStyle,
      showTooltip, 
      hideTooltip 
    }
  }
})
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip-trigger {
  cursor: pointer;
}

.tooltip-content {
  position: absolute;
  z-index: 100;
  height: 300px;
  padding: 8px 12px;
  background: #333;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
}

/* 位置样式 */
.tooltip-top {
  bottom: calc(100% + v-bind('offset + "px"'));
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-bottom {
  top: calc(100% + v-bind('offset + "px"'));
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-left {
  top: 50%;
  right: calc(100% + v-bind('offset + "px"'));
  transform: translateY(-50%);
}

.tooltip-right {
  top: 50%;
  left: calc(100% + v-bind('offset + "px"'));
  transform: translateY(-50%);
}

/* 箭头样式 */
.tooltip-arrow {
  position: absolute;
  background: inherit;
  width: 0;
  height: 0;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>