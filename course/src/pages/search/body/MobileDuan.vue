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
import { cartApi } from '@/api/cart';
import { useSearchData, searchSortOptions, priceRanges } from '../components/content';

const filterStore = useFilterStore()
const showFilter = ref(false)
const { width, height } = useWindowSize()

const {
  searchResults,
  categories,
  tags,
  userId,
  loading,
  totalPages,
  currentPage,
  pageSize,
  total,
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
  () => filterStore.selectedTag,
  () => {
    performSearch();
  }
);

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

const addToCart = async (courseId: number) => {
  try {
    const response = await cartApi.addCourseToCart(courseId);
    if (response.status === 1302) {
      alert('添加至购物车成功！');
    } else if (response.status === 2301) {
      alert('该课程已在购物车中');
    } else {
      alert('添加至购物车失败，请重试');
    }
  } catch (error) {
    console.error('添加至购物车失败:', error);
    alert('添加至购物车失败，请重试');
  }
};

const handleCurrentChange = (page: number) => {
  handlePageChange(page);
};

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

<template>
  <IconSprite />
  <main>
    <MobileHeader :userId="userId" />
    <div class="search-result-container">
      <div class="title">“{{ searchKeyword }}”的{{ searchResults.length }}个结果
        <button @click="showFilter = true">筛选</button>
      </div>
      <div class="content">
        <div class="search-result">
          <div v-for="course in searchResults" :key="course.courseId" class="course-item">
            <div class="image-container">
              <img :src="course.coverImgUrl" alt="">
            </div>
            <div class="course-details">
              <div class="course-title">{{ course.title }}</div>
              <div class="course-instruction"> {{ course.categoryName }}</div>
            </div>
            <div class="course-price">
              <div class="price"> {{ formatPrice(course.originalPrice) }}</div>
              <button class="arrToCartBtn" @click="addToCart(course.courseId)">添加至购物车</button>
            </div>
          </div>
          <div v-if="total > 0" class="pagination-container">
            <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" layout="prev, pager, next"
              @current-change="handleCurrentChange" />
            <div class="page-info">共 {{ totalPages }} 页</div>
          </div>
          <div v-else-if="!loading" style="text-align:center;color:#888;">暂无课程</div>
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
  width: 100%;
}

.search-result-container .title {
  min-width: fit-content;
  white-space: nowrap;
}

.search-result-container .content {
  width: 100%;
  max-width: 1000px;
}

.search-result-container .content .search-result {
  width: 100%;
  max-width: 1000px;
}

.search-result-container .image-container {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.search-result-container .image-container img {
  width: 180px;
  height: 100px;
}

.search-result-container .course-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-price {
  position: absolute;
  top: 20px;
  right: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.search-result-container .price {
  font-size: 20px;
  font-weight: 700;
  color: #215486;
  text-align: right;
  display: block;
}

.search-result-container .arrToCartBtn {
  position: absolute;
  top: 55px;
  right: 0px;
}

.search-result-container button {
  margin-top: 10px;
  padding: 10px;
  height: 42px;
  align-self: flex-start;
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
  pointer-events: auto;
}

.pagination-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding: 20px 0;
}

.page-info {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}
</style>
