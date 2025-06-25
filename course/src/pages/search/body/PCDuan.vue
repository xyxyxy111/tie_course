<script lang="ts" setup>
import { toRef, ref, onMounted, watch, defineComponent, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import Filter from '../components/Filter.vue';
import { useFilterStore } from '../../../stores/filter'
import PCHeader from '@/components/common/PCHeader.vue'
import { useWindowSize } from '@/useWindowSize';
import { useSearchLogic } from '../components/content';
import '../search.css'
import {
  courseTitles, NavigationButton,
  courseQuickViews, communityVoices,
  recommendedProducts, relatedTopics
} from '../components/content.ts';

const searchQuery = ref('');
const filterStore = useFilterStore()
const showFilter = ref(true)
const { width, height } = useWindowSize()

courseTitles.value[0].activeFlag = true

// 获取userId
const userId = ref<string | null>(null);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  searchQuery.value = urlParams.get('q') || '';
  // 从URL参数获取userId
  const urlUserId = urlParams.get('userId');
  if (urlUserId) {
    userId.value = decodeURIComponent(urlUserId);
  }
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
  }
])

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
        <div v-for="course in courses" :key="course.id" class="course-item">
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
</style>
