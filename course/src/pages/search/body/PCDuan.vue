<script lang="ts" setup>
import { toRef, ref, onMounted, watch, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import Filter from '../components/Filter.vue';
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import '../search.css'
import { cartApi } from '@/api/cart';

// 导入共享的数据和逻辑
import { useSearchData } from '../components/content';
import { useFilterStore } from '../components/filterStore';

const { width, height } = useWindowSize()

const filterStore = useFilterStore()

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

const handleCurrentChange = (page: number) => {
  handlePageChange(page);
};

// 添加至购物车
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
</script>

<template>
  <IconSprite />

  <PCHeader :userId="userId" />
  <div class="search-result-container">
    <div class="content">
      <Filter />

      <div class="search-result" :style="SearchResultStyle">
        <div class="title">"{{ searchKeyword }}"的{{ searchResults.length }}个结果</div>
        <div v-for="course in searchResults" :key="course.courseId" class="course-item">
          <img :src="course.coverImgUrl" alt="" class="course-img">
          <div>
            <div class="course-title" :style="SearchResultCourseTitleStyle">{{ course.title }}</div>
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
  height: 40px;
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
  font-size: 1.4rem;
}
</style>
