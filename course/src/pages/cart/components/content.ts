
import { ref, computed } from 'vue';

// 定义课程类型
interface Course {
  id: number;
  image: string;
  title: string;
  instructor: string;
  price: number;
}

// 导出共享逻辑
export function useCartLogic() {
  const courses = ref<Course[]>([
    {
      id: 1,
      image: '/src/images/image1.png',
      title: 'Ultimate AWS Certified Solutions Architect Associate 2025',
      instructor: 'Shizhane Muresi',
      price: 109.99
    },
    {
      id: 2,
      image: '/src/images/image2.png',
      title: 'The Complete AI Guide: Learn ChatGPT, Generative AI & More',
      instructor: 'Julian Melancon',
      price: 79.99
    }
  ]);

  const totalPrice = computed(() =>
    courses.value.reduce((sum, course) => sum + course.price, 0)
  );

  const goToCheckout = () => {
    const cartData = {
      courses: courses.value.map(course => ({
        image: course.image,
        title: course.title,
        price: course.price
      })),
      total: totalPrice.value,
      userId: 'user123'
    };

    localStorage.setItem('tempCartData', JSON.stringify(cartData));
    window.location.href = '/checkout.html';
  };

  return {
    courses,
    totalPrice,
    goToCheckout
  };
}