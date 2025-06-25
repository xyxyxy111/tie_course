<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, watch, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import Filter from '../components/Filter.vue';
import { useFilterStore } from '../../../stores/filter'
import MoblieHeader from '@/components/common/MoblieHeader.vue';
import '../search.css'
import { useWindowSize } from '@/useWindowSize';
import MobileHeader from '@/components/common/MoblieHeader.vue';
import { getCurrentUserId, getValidToken } from '@/utils/request';
const filterStore = useFilterStore()
const showFilter = ref(true)
const searchQuery = ref('')
const { width, height } = useWindowSize()

// 获取userId - 从token中获取而不是URL
const userId = ref<string | null>(null);

const courses = ref([
  {
    id: 1,
    image: '/src/images/image1.png',
    title: 'Ultimate AWS Certified Solutions Architect Associate 2025',
    instructor: 'Shizhane Muresi',
    price: 109.99
  },
  {
    id: 2,
    image: '/src/images/image2.png',
    title: 'The Complete AI Guide: Learn ChatGPT, Generative AI & More',
    instructor: 'Julian Melancon',
    price: 79.99
  }
])
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  searchQuery.value = urlParams.get('q') || '';
  // 从token获取userId
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  }
  // 如果没有token，userId保持为null，用户仍然可以搜索课程
});// 监听筛选条件变化
watch(
  () => [
    filterStore.sortBy,
    filterStore.selectedThemes,
    filterStore.selectedLanguage,
    filterStore.selectedLevel,
    filterStore.selectedPrice
  ],
  () => {
    console.log('筛选条件变化:', {
      sortBy: filterStore.sortBy,
      themes: filterStore.selectedThemes,
      languages: filterStore.selectedLanguage,
      level: filterStore.selectedLevel,
      price: filterStore.selectedPrice
    })
  },
  { deep: true }
)

// 侧边栏控制逻辑
const emit = defineEmits(['update:isOpen', 'open', 'close', 'filter-change'])
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

const closeSidebar = () => {
  showFilter.value = false
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnClickOutside) {
    closeSidebar()
  }
}
</script>

<!-- html -->
<template>
  <IconSprite />
  <main>
    <MobileHeader :userId="userId" />
    <div class="search-result-container">
      <div class="title">“{{ searchQuery }}”的1000个结果
        <button @click="showFilter = true">Filter</button>
      </div>

      <div class="content">

        <div class="search-result">
          <div v-for="course in courses" :key="course.id" class="course-item">
            <div class="image-container">
              <img :src="course.image" alt="">

            </div>
            <div class="course-details">
              <div class="course-title">{{ course.title }}</div>
              <div class="course-instruction">By {{ course.instructor }}</div>
              <p class="price">${{ course.price }}</p>
              <button class="arrToCartBtn">Add to Cart</button>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="sidebar-system">
      <transition name="fade">
        <div v-if="showFilter" class="sidebar-backdrop" @click.self="handleBackdropClick" />
      </transition>

      <transition name="slide-right">
        <aside v-if="showFilter" class="sidebar-panel" :style="{ width: '180px' }">
          <Filter @close="showFilter = false" />
        </aside>
      </transition>
    </div>
  </main>

</template>
<style scoped>
.search-result-container {
  margin: 0 auto;
}

.search-result-container .title {
  min-width: fit-content;
  white-space: nowrap;
}


.search-result-container .content {
  width: 100%;
  max-width: 1000px;
}

.search-result-container .image-container {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.search-result-container .image-container img {
  width: 240px;
  height: 140px;
}

.search-result-container .course-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.search-result-container button {
  width: fit-content;
  margin-top: 10px;
  padding: 10px;
  border: none;
  height: 42px;
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
  color: rgb(22, 92, 145);
  background-color: white;
  border-radius: 8px;
  align-self: flex-start;
  transition: all 0.2s;
}

.search-result-container button:hover {
  background-color: rgba(22, 92, 145, 0.1);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.sidebar-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  overflow-y: auto;
  z-index: 1001;
}

.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  /* 在侧边栏下方 */
  pointer-events: auto;
}
</style>
