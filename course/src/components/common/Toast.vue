<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div v-for="toast in toasts" :key="toast.id" :class="['toast', `toast--${toast.type}`]"
        @click="removeToast(toast.id)">
        <div class="toast__icon">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <div class="toast__content">
          <div class="toast__title">{{ toast.title }}</div>
          <div v-if="toast.message" class="toast__message">{{ toast.message }}</div>
        </div>
        <button v-if="toast.dismissible" class="toast__close" @click.stop="removeToast(toast.id)" aria-label="关闭通知">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
        <div v-if="toast.duration > 0" class="toast__progress" :style="{ animationDuration: `${toast.duration}ms` }">
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Toast类型定义
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration: number
  dismissible: boolean
  createdAt: Date
}

// Toast选项
export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
}

// 响应式数据
const toasts = ref<Toast[]>([])

// 生成唯一ID
const generateId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 添加Toast
const addToast = (options: ToastOptions) => {
  const toast: Toast = {
    id: generateId(),
    type: options.type || 'info',
    title: options.title,
    message: options.message,
    duration: options.duration ?? 5000,
    dismissible: options.dismissible ?? true,
    createdAt: new Date()
  }

  toasts.value.push(toast)

  // 自动移除
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration)
  }

  return toast.id
}

// 移除Toast
const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const clearAll = () => {
  toasts.value = []
}

const success = (title: string, message?: string, options?: Partial<ToastOptions>) => {
  return addToast({ type: 'success', title, message, ...options })
}

const error = (title: string, message?: string, options?: Partial<ToastOptions>) => {
  return addToast({ type: 'error', title, message, ...options })
}

const warning = (title: string, message?: string, options?: Partial<ToastOptions>) => {
  return addToast({ type: 'warning', title, message, ...options })
}

const info = (title: string, message?: string, options?: Partial<ToastOptions>) => {
  return addToast({ type: 'info', title, message, ...options })
}

const toastService = {
  add: addToast,
  remove: removeToast,
  clear: clearAll,
  success,
  error,
  warning,
  info
}

// 全局挂载
declare global {
  interface Window {
    $toast?: typeof toastService
  }
}

onMounted(() => {
  window.$toast = toastService
})

onUnmounted(() => {
  // delete window.$toast
})

// 暴露给组件使用
defineExpose({
  add: addToast,
  remove: removeToast,
  clear: clearAll,
  success,
  error,
  warning,
  info
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  border-left: 4px solid;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 300px;
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toast--success {
  border-left-color: #52c41a;
  color: #52c41a;
}

.toast--error {
  border-left-color: #ff4d4f;
  color: #ff4d4f;
}

.toast--warning {
  border-left-color: #faad14;
  color: #faad14;
}

.toast--info {
  border-left-color: #1890ff;
  color: #1890ff;
}

.toast__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-right: 12px;
  margin-top: 2px;
}

.toast__icon svg {
  width: 100%;
  height: 100%;
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 1.4;
  margin-bottom: 4px;
}

.toast__message {
  font-size: 1.3rem;
  line-height: 1.4;
  opacity: 0.8;
  word-break: break-word;
}

.toast__close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-left: 12px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast__close:hover {
  opacity: 1;
}

.toast__close svg {
  width: 16px;
  height: 16px;
}

.toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}

/* 进入动画 */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* 离开动画 */
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 移动动画 */
.toast-move {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .toast {
    min-width: auto;
  }
}
</style>