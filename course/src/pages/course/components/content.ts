// src/composables/content.ts
import { ref, computed } from 'vue';
 

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
    } catch (error:any) {
      if(error === "商品已在购物车中") {
        alert('该课程已在购物车中');
      }else{
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
      userId: 'user123'
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

// 评论数据
const Comments = [
  {
    username: '张三',
    userpicture: '/src/images/userPic.png',
    content: '这门课程非常实用，讲解得很清晰！',
    datetime: '2023-05-15 14:30'
  },
  {
    username: '李四',
    userpicture: '/src/images/userPic.png',
    content: '实战项目部分对我帮助很大，谢谢老师！',
    datetime: '2023-05-16 09:15'
  },
  {
    username: '王五',
    userpicture: '/src/images/userPic.png',
    content: '性能优化章节的内容正是我需要的，学到了很多技巧。',
    datetime: '2023-05-17 16:45'
  },
  {
    username: '赵六',
    userpicture: '/src/images/userPic.png',
    content: '测试与调试的部分如果再详细一些就更好了。',
    datetime: '2023-05-18 11:20'
  },
  {
    username: '钱七',
    userpicture: '/src/images/userPic.png',
    content: '课程结构很合理，适合循序渐进的学习。',
    datetime: '2023-05-19 08:10'
  },
  {
    username: '孙八',
    userpicture: '/src/images/userPic.png',
    content: '部署上线的步骤讲得很清楚，一次就成功了！',
    datetime: '2023-05-20 13:50'
  },
  {
    username: '周九',
    userpicture: '/src/images/userPic.png',
    content: '安全防护的知识点很全面，受益匪浅。',
    datetime: '2023-05-21 10:05'
  },
  {
    username: '吴十',
    userpicture: '/src/images/userPic.png',
    content: '扩展学习的内容打开了我的新思路。',
    datetime: '2023-05-22 15:30'
  },
  {
    username: '郑十一',
    userpicture: '/src/images/userPic.png',
    content: '总结回顾帮我梳理了重点，非常棒！',
    datetime: '2023-05-23 12:40'
  },
  {
    username: '王十二',
    userpicture: '/src/images/userPic.png',
    content: '入门基础讲得很细致，对新手友好。',
    datetime: '2023-05-24 17:25'
  }
];

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
  Comments,
  recommendedProducts,
  relatedTopics
};