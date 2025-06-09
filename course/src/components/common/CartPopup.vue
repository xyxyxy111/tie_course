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
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from 'vue';

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
    }
  }, emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isVisible = ref(props.modelValue);

    // 监听 prop 变化
    watch(() => props.modelValue, (newVal) => {
      isVisible.value = newVal;
    });

    const close = () => {
      isVisible.value = false;
      emit('update:modelValue', false);
    };

    return {
      isVisible,
      close,
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

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>