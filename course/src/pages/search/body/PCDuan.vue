<script lang="ts" setup>
import { toRef, ref, onMounted, watch, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import Filter from '../components/Filter.vue';
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import { ElPagination } from 'element-plus'
import '../search.css'
import { cartApi } from '@/api/cart';

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

// 计算总条目数
const total = computed(() => totalPages.value * pageSize.value);

// 处理分页变化
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
        <div class="title">"{{ searchKeyword }}"的1000个结果</div>
        <div v-for="course in searchResults" :key="course.courseId" class="course-item">
          <img :src="course.coverImgUrl" alt="" class="course-img">
          <div>
            <div class="course-title" :style="SearchResultCourseTitleStyle">{{ course.title }}</div>
            <div class="course-instruction">By {{ course.categoryName }}</div>
          </div>
          <div class="course-price">
            <div class="price"> {{ formatPrice(course.originalPrice) }}</div>
            <button class="arrToCartBtn" @click="addToCart(course.courseId)">添加至购物车</button>
          </div>
        </div>

        <!-- Element Plus 分页组件 -->
        <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total"
            :page-sizes="[12, 24, 36, 48]" layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange" @size-change="(size) => { pageSize = size; handlePageChange(1); }"
            background hide-on-single-page />
        </div>
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
  width: fit-content;
  height: 40px;
  border: none;
  font-size: 16px;
  font-weight: 400;
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

.pagination-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding: 20px 0;
}
</style>
