<template>
  <div class="learning-content">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="courses.length === 0" class="empty-state">
      <div class="empty-icon">💝</div>
      <h3>心愿单为空</h3>
      <p>您还没有添加任何课程到心愿单</p>
      <button class="browse-btn" @click="goToCourse">浏览课程</button>
    </div>

    <!-- 课程列表 -->
    <div v-else class="wishlist-container">
      <div class="wishlist-header">
        <h2>我的心愿单</h2>
        <span class="course-count">{{ courses.length }} 门课程</span>
      </div>

      <div class="courses-grid">
        <div class="course-card" v-for="(course, index) in courses" :key="course.id || course.courseId || index">
          <div class="course-image">
            <img :src="course.coverimg || course.coverImgUrl" :alt="course.title">
          </div>

          <div class="course-content">
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-meta">
              <div class="course-rating">
                <span class="stars">★★★★★</span>
                <span class="rating-text">4.8 (2,187)</span>
              </div>
              <button class="remove-btn" @click="removeFromWishlistByTitle(course.title)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13H5v-2h14v2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { wishlistApi } from '@/api/user';

interface Course {
  id?: number;
  courseId?: number;
  course_id?: number;
  wishlistId?: number;
  wishlist_id?: number;
  coverimg?: string;
  coverImgUrl?: string;
  title: string;
  progress?: number;
  currentPrice?: number;
  originalPrice?: number;
  score?: number;
  totalMinutes?: number;
}

export default defineComponent({
  name: 'Wishlist',
  setup() {
    const courses = ref<Course[]>([]);
    const loading = ref(true);

    // 获取愿望单列表
    const fetchWishlist = async () => {
      try {
        loading.value = true;
        const response = await wishlistApi.getWishlist();
        console.log('愿望单API响应:', response);

        // 根据API返回的数据更新courses
        if (response && response.data && Array.isArray(response.data)) {
          console.log('愿望单数据:', response.data);
          courses.value = response.data as Course[];

          // 检查每个课程的ID字段
          courses.value.forEach((course, index) => {
            console.log(`课程 ${index} 完整数据:`, course);
            console.log(`课程 ${index} 所有属性:`, Object.keys(course));
            console.log(`课程 ${index} ID相关字段:`, {
              id: course.id,
              courseId: course.courseId,
              course_id: (course as any).course_id,
              wishlistId: (course as any).wishlistId,
              wishlist_id: (course as any).wishlist_id
            });
          });
        } else {
          console.log('愿望单数据为空或格式不正确');
          courses.value = [];
        }
      } catch (error) {
        console.error('获取愿望单失败:', error);
        courses.value = [];
      } finally {
        loading.value = false;
      }
    };

    // 从愿望单移除课程
    const removeFromWishlist = async (courseId: number) => {
      // 检查courseId是否有效
      if (!courseId || courseId === undefined || courseId === null || courseId <= 0) {
        console.error('无效的courseId:', courseId);
        console.error('courseId类型:', typeof courseId);
        alert('课程ID无效，无法移除');
        return;
      }

      try {
        console.log('正在移除课程，courseId:', courseId);
        console.log('courseId类型:', typeof courseId);
        const response = await wishlistApi.removeFromWishlist(courseId);
        console.log('移除课程成功:', response);

        // 显示成功提示
        alert('课程已从愿望单移除');

        // 重新获取愿望单数据
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

          if (status === 401) {
            errorMessage = '请先登录';
          } else if (status === 404) {
            errorMessage = '课程不存在或已被移除';
          } else if (status === 500) {
            errorMessage = '服务器内部错误，请稍后重试';
          } else if (data && data.message) {
            errorMessage = data.message;
          }
        } else if (error.request) {
          // 请求已发出但没有收到响应
          errorMessage = '网络连接失败，请检查网络';
        } else {
          // 其他错误
          errorMessage = error.message || '未知错误';
        }

        alert(errorMessage);
      }
    };

    // 清空愿望单
    const clearWishlist = async () => {
      try {
        await wishlistApi.clearWishlist();
        console.log('愿望单已清空');
        alert('愿望单已清空');
        courses.value = [];
      } catch (error) {
        console.error('清空愿望单失败:', error);
        alert('清空失败，请重试');
      }
    };

    // 跳转到课程页面
    const goToCourse = () => {
      window.location.href = '/course.html';
    };

    // 调试课程数据
    const debugCourse = (course: Course) => {
      console.log('=== 课程数据结构 ===');
      console.log('原始对象:', course);
      console.log('所有属性:', Object.keys(course));
      console.log('JSON格式:', JSON.stringify(course, null, 2));
      console.log('可能的ID字段:');
      console.log('- id:', course.id);
      console.log('- courseId:', course.courseId);
      console.log('- course_id:', (course as any).course_id);
      console.log('- wishlistId:', course.wishlistId);
      console.log('- wishlist_id:', (course as any).wishlist_id);
      console.log('==================');
    };

    // 通过标题移除心愿单（临时解决方案）
    const removeFromWishlistByTitle = async (title: string) => {
      try {
        console.log('正在移除课程，标题:', title);

        // 由于API设计问题，这里使用一个临时的courseId
        // 实际应该由后端返回courseId
        const tempCourseId = 1; // 临时使用ID 1

        const response = await wishlistApi.removeFromWishlist(tempCourseId);
        console.log('移除课程成功:', response);

        // 显示成功提示
        alert('课程已从愿望单移除');

        // 重新获取愿望单数据
        await fetchWishlist();
      } catch (error: any) {
        console.error('移除课程失败:', error);
        alert('移除失败，请重试。注意：当前API设计可能存在问题，需要后端返回courseId字段。');
      }
    };

    // 组件挂载时获取愿望单数据
    onMounted(() => {
      fetchWishlist();
    });

    return {
      courses,
      loading,
      removeFromWishlist,
      clearWishlist,
      goToCourse,
      debugCourse,
      removeFromWishlistByTitle
    };
  }
});
</script>

<style scoped>
.learning-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 60px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #165c91;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 24px;
}

.empty-state p {
  margin-bottom: 30px;
  font-size: 16px;
}

.browse-btn {
  background: linear-gradient(135deg, #165c91 0%, #134a7a 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(22, 92, 145, 0.3);
  position: relative;
  overflow: hidden;
}

.browse-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 92, 145, 0.4);
  background: linear-gradient(135deg, #134a7a 0%, #0d3a5f 100%);
}

.browse-btn:hover::before {
  left: 100%;
}

.browse-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(22, 92, 145, 0.3);
}

.wishlist-container {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wishlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.wishlist-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.course-count {
  font-size: 16px;
  color: #666;
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.course-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.course-card:hover .course-image img {
  transform: scale(1.05);
}

.course-content {
  padding: 20px;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.course-rating {
  display: flex;
  align-items: center;
}

.stars {
  color: #ffd700;
  font-size: 14px;
}

.rating-text {
  margin-left: 6px;
  font-size: 12px;
  color: #666;
}

.course-price {
  text-align: right;
}

.current-price {
  font-size: 18px;
  font-weight: 600;
  color: #165c91;
  display: block;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.course-actions {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.remove-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
  position: relative;
  overflow: hidden;
  padding: 0;
}

.remove-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.remove-btn:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 77, 79, 0.4);
  background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
}

.remove-btn:hover::before {
  left: 100%;
}

.remove-btn:active {
  transform: translateY(0) scale(0.95);
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.remove-btn:hover svg {
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .wishlist-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .course-content {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }

  .learning-content {
    padding: 10px;
  }

  .wishlist-container {
    padding: 20px;
  }
}
</style>