import { ref } from 'vue';
import type { CategoryList } from '@/api/course';
import { categoryApi } from '@/api/course';
import { getCurrentUserId } from '@/utils/request';

export const searchQuery = ref('');

export function Search() {
  if (searchQuery.value.trim()) {
    console.log("搜索词:", searchQuery.value);
    const url = new URL('/search.html', window.location.origin);
    url.searchParams.set('keyword', encodeURIComponent(searchQuery.value));
    window.location.href = url.toString();
  }
}

export const goToCart = () => {
  const url = new URL('/cart.html', window.location.origin);
  window.location.href = url.toString();
};

export const goToIndex = () => {
  const url = new URL('/index.html', window.location.origin);
  window.location.href = url.toString();
};

export const goToLogin = () => {
  window.location.href = "/login.html";
};

export const goToCourse = (courseId: number) => {
  const url = new URL('/course.html', window.location.origin);
  url.searchParams.set('courseId', courseId.toString());
  window.location.href = url.toString();
};

export const goToLearning = () => {
  const url = new URL('/learning.html', window.location.origin);
  url.hash = '#/learning/all-courses';
  window.location.href = url.toString();
};

export const goToMyInfo = () => {
  const url = new URL('/my-info.html', window.location.origin);
  url.hash = '#/my-info/profile';
  window.location.href = url.toString();
};

export const categoryList = ref<CategoryList[]>([]);
export const expandedCategory = ref<number | null>(null);
export const fetchCategories = async () => {
  try {
    const categoriesResponse = await categoryApi.getAllCategories();
    categoryList.value = categoriesResponse.data;
    for (const category of categoryList.value) {
      if (category.categoryId) {
        const tagsResponse = await categoryApi.getTagListByCategoryId(category.categoryId);
        category.tags = tagsResponse.data;
      }
    }
  } catch (error) {
    console.error('获取categories失败:', error);
  }
};

export const toggleCategory = (categoryId: number) => {
  if (expandedCategory.value === categoryId) {
    expandedCategory.value = null;
  } else {
    expandedCategory.value = categoryId;
  }
};

export const goToCategory = (categoryId: number, tagId?: number) => {
  const params = new URLSearchParams();
  if (categoryId) {
    params.set('categoryId', categoryId.toString());
  }
  if (tagId) {
    params.set('tagId', tagId.toString());
  }
  const url = `/search.html?${params.toString()}`;
  window.location.href = url;
};

export const goToWishlist = () => {
  window.location.href = "/learning.html#/learning/wishlist";
};
