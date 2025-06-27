import { ref, computed } from 'vue';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { courseApi, categoryApi } from '@/api/course.ts';
import type { CourseListVO, Category, Tag } from '@/api/course.ts';
import { useFilterStore } from './filterStore';
import { searchCourseByMessage, searchLatestCourse } from '@/api/course';

// 共享的响应式数据
const searchResults = ref<CourseListVO[]>([]);
const categories = ref<Category[]>([]);
const tags = ref<Tag[]>([]);
const userId = ref<string | null>(null);
const loading = ref(false);
const totalPages = ref(1);
const currentPage = ref(1);
const pageSize = ref(12);

// 搜索相关状态
const searchKeyword = ref('');
const selectedCategoryId = ref<number | null>(null);
const selectedTagIds = ref<number[]>([]);
const priceRange = ref<[number, number]>([0, 1000]);
const sortBy = ref<'relevance' | 'price' | 'rating' | 'newest'>('relevance');

export const useSearchData = () => {
  const filterStore = useFilterStore();

  const initializeData = async () => {
    loading.value = true;
    try {
      const token = getValidToken();
      if (token) {
        userId.value = getCurrentUserId();
      }
      // 获取分类列表
      const categoriesResponse = await categoryApi.getAllCategories();
      categories.value = categoriesResponse.data;
      const searchParams = new URLSearchParams(window.location.search);
      const keyword = searchParams.get('keyword');
      const categoryId = searchParams.get('categoryId');
      const tagIds = searchParams.get('tagIds');
      const page = searchParams.get('page');

      if (keyword) {
        searchKeyword.value = keyword;
      }
      if (categoryId) {
        selectedCategoryId.value = parseInt(categoryId);
        const tagsResponse = await categoryApi.getTagListByCategoryId(selectedCategoryId.value);
        tags.value = tagsResponse.data;
      }
      if (tagIds) {
        selectedTagIds.value = tagIds.split(',').map(id => parseInt(id));
      }
      if (page) {
        currentPage.value = parseInt(page);
      }

      await performSearch();
    } catch (error) {
      console.error('初始化搜索数据失败:', error);
    } finally {
      loading.value = false;
    }
  };

  const performSearch = async () => {
    loading.value = true;
    try {
      const res = await searchCourseByMessage(currentPage.value, pageSize.value, searchKeyword.value);
      const data = res.data as { records: CourseListVO[]; total: number };
      console.log("data"+data);
      searchResults.value = data?.records || [];
      totalPages.value = data?.total || 0;
      updateURLParams();
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      loading.value = false;
    }
  };

  const updateURLParams = () => {
    const searchParams = new URLSearchParams();
    if (searchKeyword.value) {
      searchParams.set('keyword', searchKeyword.value);
    }
    if (selectedCategoryId.value) {
      searchParams.set('categoryId', selectedCategoryId.value.toString());
    }
    if (selectedTagIds.value.length > 0) {
      searchParams.set('tagIds', selectedTagIds.value.join(','));
    }
    if (currentPage.value > 1) {
      searchParams.set('page', currentPage.value.toString());
    }
    
    const newURL = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, '', newURL);
  };

  const handleCategoryChange = async (categoryId: number) => {
    selectedCategoryId.value = categoryId;
    selectedTagIds.value = [];
    currentPage.value = 1;

    if (categoryId) {
      // 获取该分类下的标签
      const tagsResponse = await categoryApi.getTagListByCategoryId(categoryId);
      tags.value = tagsResponse.data;
    } else {
      tags.value = [];
    }

    await performSearch();
  };

  const handleTagChange = (tagId: number) => {
    const index = selectedTagIds.value.indexOf(tagId);
    if (index > -1) {
      selectedTagIds.value.splice(index, 1);
    } else {
      selectedTagIds.value.push(tagId);
    }
    currentPage.value = 1;
    performSearch();
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    priceRange.value = range;
    currentPage.value = 1;
    performSearch();
  };

  const handleSortChange = (sort: 'relevance' | 'price' | 'rating' | 'newest') => {
    sortBy.value = sort;
    currentPage.value = 1;
    performSearch();
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
    performSearch();
  };

  const clearFilters = () => {
    searchKeyword.value = '';
    selectedCategoryId.value = null;
    selectedTagIds.value = [];
    priceRange.value = [0, 1000];
    sortBy.value = 'relevance';
    currentPage.value = 1;
    tags.value = [];
    performSearch();
  };

  const formatPrice = (price: number) => {
    return `US$${price.toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  // 搜索课程
  const fetchSearchResults = async () => {
    loading.value = true;
    try {
      const res = await searchCourseByMessage(currentPage.value, pageSize.value, searchKeyword.value);
      const data = res.data as { records: CourseListVO[]; total: number };
      searchResults.value = data?.records || [];
      totalPages.value = data?.total || 0;
    } finally {
      loading.value = false;
    }
  };

  // 获取最新课程
  const fetchLatestCourses = async () => {
    loading.value = true;
    try {
      const res = await searchLatestCourse(currentPage.value, pageSize.value);
      const data = res.data as { records: CourseListVO[]; total: number };
      searchResults.value = data?.records || [];
      totalPages.value = data?.total || 0;
    } finally {
      loading.value = false;
    }
  };

  return {
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
    formatDuration,
    fetchSearchResults,
    fetchLatestCourses
  };
};

// 导出静态数据（如果需要）
export const searchSortOptions = [
  { value: 'relevance', label: '相关度' },
  { value: 'price', label: '价格' },
  { value: 'rating', label: '评分' },
  { value: 'newest', label: '最新' }
];

export const priceRanges = [
  { label: '全部价格', value: [0, 1000] },
  { label: '免费', value: [0, 0] },
  { label: '$0 - $50', value: [0, 50] },
  { label: '$50 - $100', value: [50, 100] },
  { label: '$100 - $200', value: [100, 200] },
  { label: '$200+', value: [200, 1000] }
];
