import { ref } from 'vue';
export let searchQuery = ref('');
export function Search() {
  if (searchQuery.value.trim()) {
    console.log("搜索词:", searchQuery.value);
    window.location.href = `/search.html?q=${encodeURIComponent(searchQuery.value)}`;
  }
}

export const goToCart = () => {
  window.location.href = "/cart.html";
};

export const goToIndex = (userId?: string | null) => {
  const url = new URL('/index.html', window.location.origin);

  if (userId !== undefined && userId !== null && userId !== '') {
    url.searchParams.set('userId', encodeURIComponent(userId.toString()));
  }

  window.location.href = url.toString();
};

export const goToLogin = () => {
  window.location.href = "/login.html";
};


export const goToCourse = () => {
  window.location.href = "/course.html";
};

export const goToLearning = () => {
  window.location.href = "/learning.html";
};


export const goToMyInfo = (userId?: string | null) => {
  const url = new URL('/my-info.html', window.location.origin);

  if (userId !== undefined && userId !== null && userId !== '') {
    url.searchParams.set('userId', encodeURIComponent(userId.toString()));
  }

  window.location.href = url.toString();
};