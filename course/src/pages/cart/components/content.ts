import { ref, computed, onMounted } from 'vue';
import type { CartItem, Cart } from '@/api/cart';
import { cartApi } from '@/api/cart';


export const userId = ref<string | null>(null)

// 获取当前URL的查询参数
onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search)
  const urlUserId = searchParams.get('userId')
  if (urlUserId) {
    userId.value = decodeURIComponent(urlUserId)
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