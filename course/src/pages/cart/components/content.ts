import { ref, computed, onMounted } from 'vue';
import type { CartItem, Cart } from '@/api/cart';
import { cartApi } from '@/api/cart';
import { getCurrentUserId, getValidToken } from '@/utils/request';

export const userId = ref<string | null>(null)

// 获取当前URL的查询参数
onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search)
  const urlUserId = searchParams.get('userId')
  if (urlUserId) {
    userId.value = decodeURIComponent(urlUserId)
  } else {
    // 如果没有URL参数，尝试从token获取userId
    const token = getValidToken();
    if (token) {
      userId.value = getCurrentUserId();
    }
  }
})

// 导出共享逻辑
export function useCartLogic() {
  const cart = ref<Cart | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 获取购物车数据
  const fetchCart = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await cartApi.getMyCart();
      cart.value = response.data;
      console.log(cart.value);
    } catch (err) {
      error.value = '获取购物车数据失败';
      console.error('获取购物车失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 添加课程到购物车
  const addCourseToCart = async (courseId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await cartApi.addCourseToCart(courseId);
      cart.value = response.data;
    } catch (err) {
      error.value = '添加课程到购物车失败';
      console.error('添加课程失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 从购物车移除课程
  const removeCourseFromCart = async (courseId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await cartApi.removeCourseFromCart(courseId);
      cart.value = response.data;
    } catch (err) {
      error.value = '从购物车移除课程失败';
      console.error('移除课程失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 清空购物车
  const clearCart = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await cartApi.clearCart();
      cart.value = response.data;
    } catch (err) {
      error.value = '清空购物车失败';
      console.error('清空购物车失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 计算总价
  const totalPrice = computed(() => {
    if (!cart.value?.cartItemList) return 0;
    const sum = cart.value.cartItemList.reduce((sum, course) => sum + course.currentPrice, 0);
    return Number(sum.toFixed(2));
  });

  // 计算原价总和
  const totalOriginalPrice = computed(() => {
    if (!cart.value?.cartItemList) return 0;
    const sum = cart.value.cartItemList.reduce((sum, course) => sum + course.courseOriginalPrice, 0);
    return Number(sum.toFixed(2));
  });

  // 计算节省金额
  const savedAmount = computed(() => {
    const saved = totalOriginalPrice.value - totalPrice.value;
    return Number(saved.toFixed(2));
  });

  // 跳转到结账页面
  const goToCheckout = () => {
    if (!cart.value?.cartItemList) return;

    const cartData = {
      courses: cart.value.cartItemList.map(course => ({
        image: course.courseImage,
        title: course.courseName,
        price: course.currentPrice,
        originalPrice: course.courseOriginalPrice,
        courseId: course.courseId
      })),
      total: totalPrice.value,
      originalTotal: totalOriginalPrice.value,
      saved: savedAmount.value,
      userId: cart.value.userId
    };

    localStorage.setItem('tempCartData', JSON.stringify(cartData));
    window.location.href = '/checkout.html';
  };

  // 组件挂载时获取购物车数据
  onMounted(() => {
    fetchCart();
  });

  return {
    cart,
    userId,
    loading,
    error,
    totalPrice,
    totalOriginalPrice,
    savedAmount,
    fetchCart,
    addCourseToCart,
    removeCourseFromCart,
    clearCart,
    goToCheckout
  };
}

// 共享的工具函数
export const useCartUtils = () => {
  // 格式化价格
  const formatPrice = (price: number) => {
    return `US$${price.toFixed(2)}`;
  };

  // 格式化折扣百分比
  const formatDiscount = (originalPrice: number, currentPrice: number) => {
    if (originalPrice <= currentPrice) return '';
    const discount = ((originalPrice - currentPrice) / originalPrice * 100).toFixed(0);
    return `${discount}% OFF`;
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 检查购物车是否为空
  const isCartEmpty = (cart: Cart | null) => {
    return !cart || !cart.cartItemList || cart.cartItemList.length === 0;
  };

  // 获取购物车商品数量
  const getCartItemCount = (cart: Cart | null) => {
    return cart?.cartItemList?.length || 0;
  };

  // 检查用户是否已登录
  const isUserLoggedIn = () => {
    const token = getValidToken();
    return !!token;
  };

  // 跳转到登录页面
  const goToLogin = () => {
    window.location.href = '/login.html';
  };

  return {
    formatPrice,
    formatDiscount,
    formatTime,
    isCartEmpty,
    getCartItemCount,
    isUserLoggedIn,
    goToLogin
  };
};