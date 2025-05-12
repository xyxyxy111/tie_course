<template>
  <!-- 侧边栏容器 -->
  <div class="sidebar-system">
    <!-- 半透明遮罩层 -->
    <transition name="fade">
      <div v-if="isOpen" class="sidebar-backdrop" @click.self="handleBackdropClick" />
    </transition>

    <!-- 侧边栏本体 -->
    <aside class="sidebar-panel" :class="{
      'sidebar-open': isOpen,
      'sidebar-left': position === 'left',
      'sidebar-right': position === 'right'
    }" :style="{ width: `${width}px` }">
      <div class="sidebar-body">
        <ul class="sidebar-content">
          <li><a href="/login.html" style="width: 100%;"><button>Log in</button></a></li>
          <li><a href="/signup.html" style="width: 100%;"><button>Sign up</button></a> </li>
        </ul>


        <ul class="sidebar-content">
          <li class="sidebar-title">PopularProject</li>
          <li v-for="(PopularProject, index) in PopularContent" :key="index">
            <button>{{ PopularProject }}</button>
          </li>
        </ul>

        <ul class="sidebar-content">
          <li class="sidebar-title">More</li>
          <li><button>Business</button> </li>
          <li><button>Get the app</button></li>
          <li><button>Invite friends</button></li>
          <li><button>Help and Support</button></li>
        </ul>

        <ul class="sidebar-content">

          <button style=" margin: 8px 0px; ">
            <div class="icon">
              <svg width="40" height="40" viewBox="-1.3 -1 8 8" fill="#35495e">
                <use href="#mdi--web" />
              </svg> language
            </div>

          </button>
        </ul>

      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'

const PopularContent = ref<string[]>([
  'Web Development',
  'Mobile Development',
  'Game Development',
  'Entrepreneurship',
  'Analytics & Intelligence',
  'Finance',
  'IT Certifications',
  'Personal Transformation',
  'Graphic Design & Illustration',
  'Digital Marketing',
  'All categories'
]);

const props = defineProps({
  isOpen: Boolean,
  position: {
    type: String,
    default: 'left',
    validator: (v:string) => ['left', 'right'].includes(v)
  },
  width: {
    type: Number,
    default: 260
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  disableScroll: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:isOpen', 'open', 'close'])

const closeSidebar = () => {
  emit('update:isOpen', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnClickOutside) {
    closeSidebar()
  }
}

// 控制页面滚动
watch(() => props.isOpen, (open) => {
  if (props.disableScroll) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
  open ? emit('open') : emit('close')
})
</script>

<style scoped>
/* 遮罩层样式 */
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

/* 侧边栏面板 */
.sidebar-panel {
  padding-top: 10px;
  position: fixed;
  top: 0;
  height: 100vh;
  background: white;
  z-index: 1000;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-left {
  left: 0;
  transform: translateX(-100%);
}

.sidebar-right {
  right: 0;
  transform: translateX(100%);
}

.sidebar-open.sidebar-left {
  transform: translateX(0);
}

.sidebar-open.sidebar-right {
  transform: translateX(0);
}

.sidebar-body {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
}

.sidebar-body ul {
  list-style: none;
  padding-left: 0px;
  border-bottom: 0.5px rgb(22, 92, 145) solid;
}

.sidebar-body li {
  cursor: pointer;
}

.sidebar-body .sidebar-title {
  font-weight: 700;
  padding:10px 20px;
}

.sidebar-body button {
  padding: 5px 30px;
  height: 30px;
  width: 100%;
  border: none;
  background-color: white;
  color: rgb(22, 92, 145);
  font-weight: 700;
  text-align: left;
}

.sidebar-body button:hover {
  background-color: rgba(22, 92, 145, 0.1);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<!-- 

/* 侧边栏菜单项样式 */
.sidebar-body {
  padding: 15px;
}


.help-button {
  width: 100%;
  padding: 10px;
  background-color: rgb(22, 92, 145);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
} -->