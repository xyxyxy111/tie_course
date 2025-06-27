<script lang="ts" setup>
import { toRef, ref, onMounted, watch, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import Filter from '../components/Filter.vue';
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import '../search.css'

// 导入共享的数据和逻辑
import { useSearchData } from '../components/content';

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
  console.log('onMounted后searchResults:', searchResults.value);
});

const SearchResultWidth = computed(() => {
  const calculatedValue = (width.value - 900);
  return Math.min(600, Math.max(0, calculatedValue));
});

const SearchResultStyle = computed(() => ({
  width: `calc( 640px + 1px * ${SearchResultWidth.value})`
}));

const SearchResultCourseTitleStyle = computed(() => ({
  width: `calc( 200px + 1px * ${SearchResultWidth.value})`
}));

</script>

<template>
  <IconSprite />

  <PCHeader :userId="userId" />
  <div class="search-result-container">
    <div class="content">
      <Filter />

      <div class="search-result" :style="SearchResultStyle">
        <div class="title">"{{ searchKeyword }}"的1000个结果</div>
        <div v-for="course in searchResults" :key="course.courseId" class="course-item">
          <img :src="course.coverImgUrl" alt="" class="course-img">
          <div>
            <div class="course-title" :style="SearchResultCourseTitleStyle">{{ course.title }}</div>
            <div class="course-instruction">By {{ course.categoryName }}</div>
          </div>
          <div class="course-price">
            <div class="price"> {{ formatPrice(course.originalPrice) }}</div>
            <button class="arrToCartBtn">Add to Cart</button>
          </div>
        </div>
        <div class="pagination">
          <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
          <span>第{{ currentPage }}页 / 共{{ totalPages }}页</span>
          <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
    </div>

  </div>

  <div style="color:red;">DEBUG: {{ searchResults }}</div>

</template>

<style scoped>
.search-result-container {
  margin: 0 auto;
}

.title {
  min-width: fit-content;
  white-space: nowrap;
}

.content {
  width: 90%;
  max-width: 1400px;
  min-width: 800px;
}

.search-result {
  width: 70%;
  min-width: 620px;
}

.search-result .course-item img {
  width: 240px;
  height: 140px;
  margin-right: 20px;
}

.search-result .course-item button {
  margin-top: 80px;
  width: fit-content;
  height: 42px;
  padding: 10px;
  border: none;
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
  color: rgb(22, 92, 145);
  background-color: white;
  border-radius: 8px;

}

.search-result .course-item button:hover {
  background-color: rgba(22, 92, 145, 0.1);
}

.search-result .course-item .course-price {
  width: 80px;
  padding: 0px 5px;
  font-size: 20px;
  font-weight: 600;
}

.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination button {
  background: #165c91;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  width: fit-content;
  transition: background 0.2s;
}

.pagination button:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}
</style>
