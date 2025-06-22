import { ref } from 'vue';
import { useRouter } from 'vue-router';
export let searchQuery = ref('');
const router = useRouter();

export function Search() {
  if (searchQuery.value.trim()) {
    console.log("搜索词:", searchQuery.value);
    // 获取当前userId
    const currentUserId = getCurrentUserId();
    const url = new URL('/search.html', window.location.origin);
    url.searchParams.set('q', encodeURIComponent(searchQuery.value));
    if (currentUserId) {
      url.searchParams.set('userId', encodeURIComponent(currentUserId));
    }
    window.location.href = url.toString();
  }
}

// 获取当前用户ID的辅助函数
function getCurrentUserId(): string | null {
  // 从localStorage获取token，然后解析用户ID
  const token = localStorage.getItem('token');
  if (token) {
    // 这里可以根据实际需求解析token获取用户ID
    // 暂时返回一个默认值或从其他地方获取
    return '11'; // 示例用户ID
  }
  return null;
}

export const goToCart = (userId?: string | null) => {
  const url = new URL('/cart.html', window.location.origin);
  const currentUserId = userId || getCurrentUserId();
  if (currentUserId) {
    url.searchParams.set('userId', encodeURIComponent(currentUserId));
  }
  window.location.href = url.toString();
};

export const goToIndex = (userId?: string | null) => {
  const url = new URL('/index.html', window.location.origin);
  const currentUserId = userId || getCurrentUserId();
  if (currentUserId) {
    url.searchParams.set('userId', encodeURIComponent(currentUserId));
  }
  window.location.href = url.toString();
};

export const goToLogin = () => {
  window.location.href = "/login.html";
};

export const goToCourse = (userId?: string | null) => {
  const url = new URL('/course.html', window.location.origin);
  const currentUserId = userId || getCurrentUserId();
  if (currentUserId) {
    url.searchParams.set('userId', encodeURIComponent(currentUserId));
  }
  window.location.href = url.toString();
};

export const goToLearning = () => {
  const currentUserId = getCurrentUserId();
  const url = new URL('/learning.html', window.location.origin);
  if (currentUserId) {
    url.searchParams.set('userId', encodeURIComponent(currentUserId));
  }
  url.hash = '#/learning/all-courses';
  window.location.href = url.toString();
};

export const goToMyInfo = (userId?: string | null) => {
  const url = new URL('/my-info.html', window.location.origin);
  const currentUserId = userId || getCurrentUserId();
  if (currentUserId) {
    url.searchParams.set('userId', encodeURIComponent(currentUserId));
  }
  // 添加hash路由支持，重定向到profile页面
  url.hash = '#/my-info/profile';
  window.location.href = url.toString();
};