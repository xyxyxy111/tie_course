import { ref, computed } from 'vue'
import { wishlistApi, type WishListVO } from '@/api/user'

export function useWishlist() {

  const wishlist = ref<WishListVO[]>([])
  // 加载状态
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 获取用户心愿单
  const fetchWishlist = async () => {
    try {
      const response = await wishlistApi.getWishlist();
      if (response && response.data && Array.isArray(response.data)) {
        wishlist.value = response.data as WishListVO[];
      } else {
        console.log('愿望单数据为空或格式不正确');
        wishlist.value = [];
      }
    } catch (error) {
      wishlist.value = [];
    }
  };

  // 添加到心愿单
  const addToWishlist = async (courseId: number) => {
    try {
      console.log('正在添加课程到心愿单，courseId:', courseId);
      const response = await wishlistApi.addToWishlist(courseId);
      console.log('添加心愿单成功:', response);
      alert('课程已添加到心愿单');
    } catch (error: any) {
      console.error('添加心愿单失败:', error);
      let errorMessage = '添加失败，请重试';
      // if (error.response) {
      //   const { status, data } = error.response;
      //   if (status === 401) {
      //     errorMessage = '请先登录';
      //   } else if (status === 409) {
      //     errorMessage = '';
      //   } else if (data && data.message) {
      //     errorMessage = data.message;
      //   }
      // }
      alert('添加心愿单失败,课程已在心愿单中');
    }
  };

  // 从心愿单移除
  const removeFromWishlist = async (courseId: number) => {
    // 检查courseId是否有效
    if (!courseId || courseId === undefined || courseId === null || courseId <= 0) {
      console.error('无效的courseId:', courseId);
      console.error('courseId类型:', typeof courseId);
      alert('课程ID无效，无法移除');
      return;
    }
    try {
      const response = await wishlistApi.removeFromWishlist(courseId);
      console.log('移除课程成功:', response);
      alert('课程已从愿望单移除');
      await fetchWishlist();
    } catch (error: any) {
      console.error('移除课程失败:', error);

      // 提供更详细的错误信息
      let errorMessage = '移除失败，请重试';
      if (error.response) {
        // 服务器返回了错误响应
        const { status, data } = error.response;
        console.error('服务器错误状态:', status);
        console.error('服务器错误数据:', data);
      } else if (error.request) {
        errorMessage = '网络连接失败，请检查网络';
      } else {
        errorMessage = error.message || '未知错误';
      }
      alert(errorMessage);
    }
  };

  return {
    isLoading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  }
}

// 类型导出
export type UseWishlistReturn = ReturnType<typeof useWishlist>