import { ref } from 'vue';
import { cartApi, type Cart, type CartItem } from '@/api/cart';
import type { Ref } from 'vue';
import { orderApi } from '@/api/order';
import { checkIfCoursePurchased, getPurchasedCourseIds } from './useOrder';


export function useCart() {
  const cart: Ref<Cart | null> = ref(null);
  const loading = ref(false);
  const checking = ref(false);
  const error = ref<string | null>(null);

  // 获取购物车
  const fetchCart = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await cartApi.getMyCart();
      if ([1300, 1301, 1302].includes(response.status)) {
        cart.value = response.data;
      }
      return response;
    } catch (err: any) {
      error.value = err.message || '获取购物车失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 添加课程到购物车
  const addToCart = async (courseId: number, courseName?: string) => {
    try {
      const isPurchased = await checkIfCoursePurchased(courseId);
      console.log(isPurchased)
      checking.value = true;
      if (isPurchased) {
        return {
          success: false,
          message: `加购失败：您已购买课程 "${courseName || '该课程'}"`,
          alreadyPurchased: true
        };
      }
      // 如果未购买，正常添加到购物车
      const response = await cartApi.addCourseToCart(courseId);
      console.log(response)
      if (response.status === 1302) {
        console.log('添加至购物车成功！')
        return true;
      } else {
        console.log('添加至购物车失败，请重试')
        return false;
      }

    } catch (err: any) {
      alert("添加失败," + err);
    }

  };


  // 从购物车移除课程
  const removeFromCart = async (courseId: number) => {
    try {
      loading.value = true;
      const response = await cartApi.removeCourseFromCart(courseId);
      await fetchCart(); // 刷新购物车数据
      return response;
    } catch (err) {
      error.value = '移除课程失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 清空购物车
  const clearCart = async () => {
    try {
      loading.value = true;
      const response = await cartApi.clearCart();
      cart.value = null;
      return response;
    } catch (err) {
      error.value = '清空购物车失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const goToCheckout = (course: { courseId: number; title: string; coverImgUrl: string; currentPrice: number; originalPrice: number; }) => {
    const buyNowData = {
      courses: [
        {
          image: course.coverImgUrl,
          title: course.title,
          price: course.currentPrice,
          originalPrice: course.originalPrice,
          courseId: course.courseId
        }
      ],
      total: course.currentPrice,
      originalTotal: course.originalPrice,
      saved: Number((course.originalPrice - course.currentPrice).toFixed(2)),
    };
    localStorage.setItem('buyCourseNow', JSON.stringify(buyNowData));
    window.location.href = '/checkout.html';
  };


  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    goToCheckout
  };
}