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

export const goToIndex = () => {
  window.location.href = "/index.html";
};

export const goToSignup = () => {
  window.location.href = "/signup.html";
};

export const goToLogin = () => {
  window.location.href = "/login.html";
};