// src/composables/content.ts
import { ref, computed } from 'vue';
import { getValidToken } from '@/utils/request';


// 课程描述相关逻辑
function useCourseDescription() {
  const CourseDescriptionFlag = ref(false);
  const CourseDescription = computed(() =>
    CourseDescriptionFlag.value ? "收起" : "显示更多"
  );


  return {
    CourseDescriptionFlag,
    CourseDescription
  };
}

// 购物车相关逻辑
function useCart() {
  const showCart = ref(false);
  const cartTitle = ref('');

  const addToCart = async (course: string) => {
    try {
      // 从URL获取courseId
      const searchParams = new URLSearchParams(window.location.search);
      const courseId = parseInt(searchParams.get('courseId') || '0');

      if (!courseId) {
        alert('课程ID无效');
        return;
      }

      // 调用购物车API
      const { cartApi } = await import('@/api/cart');
      const response = await cartApi.addCourseToCart(courseId);

      if (response.status === 1302) {
        alert('添加至购物车成功！');
        showCart.value = true;
      } else {
        alert('添加至购物车失败，请重试');
      }
    } catch (error: any) {
      if (error === "商品已在购物车中") {
        alert('该课程已在购物车中');
      } else {
        console.error('添加至购物车失败:', error);
        alert('添加至购物车失败，请重试');
      }
    }
  };

  const goToCheckout = (courseVideo: string, currentPrice: number) => {
    const cartData = {
      courses: {
        image: courseVideo,
        title: "course.title",
        price: currentPrice
      },
      total: currentPrice,
      userId: getValidToken()
    };

    localStorage.setItem('tempCartData', JSON.stringify(cartData));
    window.location.href = '/checkout.html';
  };

  return {
    showCart,
    cartTitle,
    addToCart,
    goToCheckout
  };
}


// 推荐产品和相关主题
const recommendedProducts = [
  {
    id: 1,
    name: 'Python 数据分析',
    coverImgUrl: '/src/images/python-course.jpg',
    rating: 4.8,
    reviewCount: 1245,
    price: '¥89.99'
  },
  {
    id: 2,
    name: '机器学习实战',
    coverImgUrl: '/src/images/ml-course.jpg',
    rating: 4.9,
    reviewCount: 987,
    price: '¥99.99'
  },
  {
    id: 3,
    name: 'Web 开发全栈课程',
    coverImgUrl: '/src/images/web-course.jpg',
    rating: 4.7,
    reviewCount: 1567,
    price: '¥79.99'
  }
];

const relatedTopics = [
  '数据科学',
  'R语言',
  '统计分析',
  '机器学习',
  '编程基础',
  '数据可视化'
];

export {
  useCourseDescription,
  useCart,
  recommendedProducts,
  relatedTopics
};