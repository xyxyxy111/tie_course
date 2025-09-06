// src/composables/content.ts
import { ref, computed } from 'vue';
import { getValidToken } from '@/utils/request';
import { useCart } from '@/composables/useCart'
import type { CourseVO, Chapter, Lesson } from '@/api/course';
import { categoryApi, courseApi, courseSuccessCodes, categorySuccessCodes } from '@/api/course';
import { convertMinutesToHoursAndMinutes, formatDateToYearMonth } from '@/utils/common';




const searchParams = new URLSearchParams(window.location.search);
const courseId = parseInt(searchParams.get('courseId') || '1001');
export const showCart = ref(false);
export const { addToCart, goToCheckout } = useCart();
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
// function useCart() {

//   const addToCart = async (course: string) => {
//     try {
//       // 调用购物车API
//       const { cartApi } = await import('@/api/cart');
//       const response = await cartApi.addCourseToCart(courseId);

//       if (response.status === 1302) {
//         alert('添加至购物车成功！');
//         showCart.value = true;
//       } else {
//         alert('添加至购物车失败，请重试');
//       }
//     } catch (error: any) {
//       if (error === "商品已在购物车中") {
//         alert('该课程已在购物车中');
//       } else {
//         console.error('添加至购物车失败:', error);
//         alert('添加至购物车失败，请重试');
//       }
//     }
//   };

//   const goToCheckout = (course: { courseId: number; title: string; coverImgUrl: string; currentPrice: number; originalPrice: number; }) => {
//     const buyNowData = {
//       courses: [
//         {
//           image: course.coverImgUrl,
//           title: course.title,
//           price: course.currentPrice,
//           originalPrice: course.originalPrice,
//           courseId: course.courseId
//         }
//       ],
//       total: course.currentPrice,
//       originalTotal: course.originalPrice,
//       saved: Number((course.originalPrice - course.currentPrice).toFixed(2)),
//     };
//     localStorage.setItem('buyCourseNow', JSON.stringify(buyNowData));
//     window.location.href = '/checkout.html';
//   };
//   return {
//     showCart,
//     cartTitle,
//     addToCart,
//     goToCheckout
//   };
// }

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


export const chapters = ref<Chapter[]>([]);
export const courseVo = ref<CourseVO | null>(null);
export const lastUpdateTime = ref('年月日')

export const getCourseMessage = async () => {
  const courseVoResponse = await courseApi.getSingleCourseDetail(courseId);
  courseVo.value = courseVoResponse.data;
  const chaptersResponse = await courseApi.getChapterListById(courseId);
  chapters.value = chaptersResponse.data;
  chapters.value.forEach(chapter => {
    let result = convertMinutesToHoursAndMinutes(chapter.lessonTotalMinute);
    chapter.hours = result.hours;
    chapter.minutes = result.minutes;
  });
  lastUpdateTime.value = (formatDate(courseVo.value?.updateTime!));
  const lessonsResponse = await courseApi.getLessonsByCourseIdAndSortOrder(courseId, 1);
  const firstChapter = chapters.value.find(chapter => chapter.chapterSortOrder === 1);
  if (firstChapter) {
    firstChapter.lessons! = lessonsResponse.data;
    firstChapter.hasLoadedLessons = true;
  } else {
    console.warn("No chapters found");
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '无效的时间格式';
  }
}


export const getLessonListBySortOrder = async (courseId: number, sortOrder: number) => {
  const chooseChapter = chapters.value.find(chapter => chapter.chapterSortOrder === sortOrder);
  if (!chooseChapter?.hasLoadedLessons) {
    //true
    const lessonsResponse = await courseApi.getLessonsByCourseIdAndSortOrder(courseId, sortOrder);
    console.log(lessonsResponse);
    console.log("lessonsResponse" + lessonsResponse.data.map(lesson => lesson.title));
    if (chooseChapter) {
      chooseChapter.lessons! = lessonsResponse.data;
      chooseChapter.hasLoadedLessons = true;
    } else {
      console.warn("No chapters found");
    }
  }
}