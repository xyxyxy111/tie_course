<script lang="ts" setup>
import { toRef, ref, onMounted, watch, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import Filter from '../components/Filter.vue';
import { useFilterStore } from '../components/filterStore'
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import '../search.css'
import { getCurrentUserId, getValidToken } from '@/utils/request';

const searchQuery = ref('');
const filterStore = useFilterStore()
const showFilter = ref(true)
const { width, height } = useWindowSize()

// 获取userId - 从token中获取而不是URL
const userId = ref<string | null>(null);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  searchQuery.value = urlParams.get('q') || '';
  // 从token获取userId
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  }
  // 如果没有token，userId保持为null，用户仍然可以搜索课程
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
  },
  {
    id: 3,
    image: '/src/images/image3.png',
    title: 'Python全栈开发实战2025',
    instructor: '王小明',
    price: 89.99
  },
  {
    id: 4,
    image: '/src/images/image4.png',
    title: 'Java零基础到精通',
    instructor: '李雷',
    price: 99.99
  },
  {
    id: 5,
    image: '/src/images/image5.png',
    title: 'Vue3+TS企业级项目实战',
    instructor: '张三',
    price: 69.99
  },
  {
    id: 6,
    image: '/src/images/image6.png',
    title: 'React Native移动开发',
    instructor: '李四',
    price: 59.99
  },
  {
    id: 7,
    image: '/src/images/image7.png',
    title: '数据结构与算法精讲',
    instructor: '王五',
    price: 79.99
  },
  {
    id: 8,
    image: '/src/images/image8.png',
    title: '机器学习与深度学习入门',
    instructor: '赵六',
    price: 109.99
  },
  {
    id: 9,
    image: '/src/images/image9.png',
    title: 'Web前端高薪就业班',
    instructor: '钱七',
    price: 119.99
  },
  {
    id: 10,
    image: '/src/images/image1.png',
    title: 'C++高性能编程',
    instructor: '孙八',
    price: 89.99
  },
  {
    id: 11,
    image: '/src/images/image2.png',
    title: 'Go语言微服务实战',
    instructor: '周九',
    price: 99.99
  },
  {
    id: 12,
    image: '/src/images/image3.png',
    title: 'Kubernetes云原生入门',
    instructor: '吴十',
    price: 109.99
  }
])

// 分页相关
const pageSize = 6;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(courses.value.length / pageSize));
const pagedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return courses.value.slice(start, start + pageSize);
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

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

</script>

<template>
  <IconSprite />

  <PCHeader :userId="userId" />
  <div class="search-result-container">
    <div class="content">
      <Filter @close="showFilter = true" />

      <div class="search-result" :style="SearchResultStyle">
        <div class="title">“{{ searchQuery }}”的1000个结果</div>
        <div v-for="course in pagedCourses" :key="course.id" class="course-item">
          <img :src="course.image" alt="" class="course-img">
          <div>
            <div class="course-title" :style="SearchResultCourseTitleStyle">{{ course.title }}</div>
            <div class="course-instruction">By {{ course.instructor }}</div>
          </div>
          <div class="course-price">
            <div class="price"> ${{ course.price }}</div>
            <button class="arrToCartBtn">Add to Cart</button>
          </div>
        </div>
        <div class="pagination">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
          <span>第{{ currentPage }}页 / 共{{ totalPages }}页</span>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
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
