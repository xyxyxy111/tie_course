import { ref } from 'vue';
// import { useRouter } from 'vue-router';
import { getCurrentUserId } from '@/utils/request';

export let searchQuery = ref('');
// const router = useRouter();

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
  // 添加hash路由支持，重定向到profile页面
  url.hash = '#/my-info/profile';
  window.location.href = url.toString();
};