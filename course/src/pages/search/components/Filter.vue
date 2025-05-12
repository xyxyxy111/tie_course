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
      'sidebar-right': true
    }" :style="{ width: `${width}px` }">
      <div class="sidebar-body">
        <div class="sidebar-header">
          <h3>筛选</h3>
        </div>

        <!-- 排序方式 -->
        <ul class="sidebar-content">
          <li class="sidebar-title">排序方式</li>
          <li><button :class="{ active: sortBy === 'relevance' }" @click="sortBy = 'relevance'">相关度最高</button></li>
          <li><button :class="{ active: sortBy === 'newest' }" @click="sortBy = 'newest'">最新</button></li>
          <li><button :class="{ active: sortBy === 'highest-rated' }" @click="sortBy = 'highest-rated'">评分最高</button>
          </li>
        </ul>


        <ul class="sidebar-content">
          <li class="sidebar-title">语言</li>
          <li><button>中文</button></li>
          <li><button>English</button></li>
        </ul>
        
        <ul class="sidebar-content">
          <li class="sidebar-title">主题</li>
          <li v-for="(theme, index) in themes" :key="index">
            <label>
              <input type="checkbox" v-model="selectedThemes" :value="theme">
              {{ theme }}
            </label>
          </li>
        </ul>


        <ul class="sidebar-content">
          <li class="sidebar-title">级别</li>
          <li v-for="level in levels" :key="level.value">
            <label>
              <input type="radio" v-model="selectedLevel" :value="level.value"> {{ level.label }}
            </label>
          </li>
        </ul>

        <ul class="sidebar-content">
          <li class="sidebar-title">价格</li>
          <li v-for="price in prices" :key="price.value">
            <label>
              <input type="radio" v-model="selectedPrice" :value="price.value"> {{ price.label }}
            </label>
          </li>
        </ul>

      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// 主题数据
const themes = ["JavaScript", "React JS", "Angular", "Java", "CSS", "Android", "iOS"];
const selectedThemes = ref([]);

const levels = [
  { value: "all", label: "所有级别" },
  { value: "beginner", label: "初级" },
  { value: "intermediate", label: "中级" },
  { value: "expert", label: "专家" },
];
const selectedLevel = ref("all"); // 默认选中"所有级别"

const prices = [
  { value: "paid", label: "付费" },
  { value: "free", label: "免费" },
];
const selectedPrice = ref("free"); // 默认选中"免费"

const props = defineProps({
  isOpen: Boolean,
  width: {
    type: Number,
    default: 300
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

const emit = defineEmits(['update:isOpen', 'open', 'close', 'filter-change'])

// 筛选状态
const sortBy = ref('relevance')
const sortLanguage=ref('Chinese')
const ratingFilter = ref('4.5')
const showCertifiedOnly = ref(false)

const closeSidebar = () => {
  emit('update:isOpen', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnClickOutside) {
    closeSidebar()
  }
}

// 监听筛选条件变化
watch([sortBy, ratingFilter, showCertifiedOnly, selectedThemes], () => {
emit('filter-change', {
  sortBy: sortBy.value,
  rating: ratingFilter.value,
  certifiedOnly: showCertifiedOnly.value,
  themes: selectedThemes.value // 加入主题筛选
})
}, { deep: true })

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
  position: fixed;
  top: 0;
  height: 100vh;
  background: white;
  z-index: 1000;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-right {
  right: 0;
  transform: translateX(100%);
}

.sidebar-open.sidebar-right {
  transform: translateX(0);
}

.sidebar-body {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 15px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.sidebar-header h3 {
  margin: 0;
}

.sidebar-content {
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.sidebar-title {
  font-weight: 700;
  padding: 15px 0 5px;
  color: #35495e;
}

.sidebar-body button {
  width: 100%;
  padding: 10px 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: #35495e;
  transition: background-color 0.2s;
}

.sidebar-body button:hover {
  background-color: rgba(22, 92, 145, 0.1);
}

.sidebar-body button.active {
  color: rgb(22, 92, 145);
  font-weight: bold;
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