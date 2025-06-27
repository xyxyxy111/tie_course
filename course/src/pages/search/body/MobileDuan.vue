<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, watch, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import Filter from '../components/Filter.vue';
import { useFilterStore } from '../components/filterStore'
import MobileHeader from '@/components/common/MoblieHeader.vue';
import '../search.css'
import { useWindowSize } from '@/useWindowSize';

// 导入共享的数据和逻辑
import { useSearchData, searchSortOptions, priceRanges } from '../components/content';

const filterStore = useFilterStore()
const showFilter = ref(true)
const { width, height } = useWindowSize()

// 使用共享的数据和逻辑
const {
  searchResults,
  categories,
  tags,
  userId,
  loading,
  totalPages,
  currentPage,
  pageSize,
  searchKeyword,
  selectedCategoryId,
  selectedTagIds,
  priceRange,
  sortBy,
  initializeData,
  performSearch,
  handleCategoryChange,
  handleTagChange,
  handlePriceRangeChange,
  handleSortChange,
  handlePageChange,
  clearFilters,
  formatPrice,
  formatDuration
} = useSearchData();

onMounted(async () => {
  await initializeData();
});

watch(
  () => [
    filterStore.sortBy,
    filterStore.selectedThemes,
    filterStore.selectedLanguage,
    filterStore.selectedLevel,
    filterStore.selectedPrice
  ],
  () => {
    performSearch();
  },
  { deep: true }
)

const addToCart = (courseId: number) => {
  // TODO: 调用购物车接口
  alert('加入购物车: ' + courseId);
};

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
      <div class="title">“{{ searchKeyword }}”的{{ searchResults.length }}个结果
        <button @click="showFilter = true">Filter</button>
      </div>
      <div class="content">
        <div class="search-result">
          <div v-for="course in searchResults" :key="course.courseId" class="course-item">
            <div class="image-container">
              <img :src="course.coverImgUrl" alt="">
            </div>
            <div class="course-details">
              <div class="course-title">{{ course.title }}</div>
              <div class="course-instruction">By {{ course.categoryName }}</div>
              <p class="price">{{ formatPrice(course.originalPrice) }}</p>
              <button class="arrToCartBtn" @click="addToCart(course.courseId)">Add to Cart</button>
            </div>
          </div>
        </div>
        <div v-if="totalPages > currentPage && !loading" style="text-align:center;margin:20px 0;">
          <button @click="handlePageChange(currentPage + 1)" :disabled="loading">{{ loading ? '加载中...' : '加载更多'
          }}</button>
        </div>
        <div v-else-if="!searchResults.length && !loading" style="text-align:center;color:#888;">暂无课程</div>
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
