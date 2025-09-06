<template>
  <!-- 加载状态 -->
  <div v-if="loading" class="loading">
    <div class="loading-spinner"></div>
    <p>加载中...</p>
  </div>

  <!-- 空状态 -->
  <div v-else-if="wishlist.length === 0" class="empty-state">
    <div class="empty-icon">♡</div>
    <h3>心愿单为空</h3>
    <p>您还没有添加任何课程到心愿单</p>
    <button class="browse-btn" @click="goToIndex">浏览课程</button>
  </div>

  <!-- 课程列表 -->
  <div v-else class="wishlist-container">
    <div class="wishlist-header">
      <!-- <h2 style="display: flex; align-items: center; gap: 16px;">
          我的心愿单
          <span class="course-count">{{ wishlist.length }} 门课程</span>
        </h2> -->
      <input v-model="searchText" class="search-input" placeholder="搜索心愿单课程" style="margin-right: 16px;" />

      <button class="search-button">
        <div class="icon" @click="searchWishlist">
          <svg :width="iconWidth" :height="iconWidth" viewBox="0 0 16 16" fill="#35495e">
            <use href="#material-symbols--search" />
          </svg>
        </div>
      </button>

    </div>

    <div class="wishlist-grid">
      <div class="course-card" v-for="(course, index) in (searchResult !== null ? searchResult : wishlist)"
        :key="course.courseId || index">

        <div class="course-image">
          <img :src="course.coverImgUrl || course.coverImgUrl" :alt="course.title">
          <span class="card-heart" @click="removeFromWishlist(course.courseId)">
            <svg :width="iconWidth" :height="iconWidth" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="2">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
        </div>

        <div class="course-content">
          <h3 class="course-title">{{ course.title }}</h3>
          <div class="course-meta">iClass</div>

          <div class="course-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-text">4.8 (2,187)</span>
          </div>
          <div class="course-duration">
            总共 {{ formatTime(course.totalMinutes) }} · 44个讲座
          </div>

          <div class="current-price">￥{{ course.currentPrice.toFixed(2) }}</div>
        </div>

      </div>
    </div>

    <button class="clear-btn" @click="clearWishlist">清空心愿单</button>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { wishlistApi } from '@/api/user';
import type { WishListVO } from '@/api/user';
import '../myLearn.css'
import { useWindowSize } from '@/useWindowSize';
import { goToIndex, goToCourse } from '@/components/common/header';


export default defineComponent({
  name: 'Wishlist',
  setup() {

    const { width } = useWindowSize();

    let iconWidth = ref(24 + (width.value - 1920) / 100);
    iconWidth.value = (iconWidth.value > 24) ? iconWidth.value : 26;

    const wishlist = ref<WishListVO[]>([]);
    const loading = ref(true);
    const searchText = ref('');
    const searchResult = ref<WishListVO[] | null>(null);

    const formatTime = (totalMinutes: number) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      let result = '';
      if (hours > 0) result += `${hours}小时`;
      if (minutes > 0) result += `${minutes}分钟`;
      if (!result) result = '0分钟';
      return result;
    };

    const searchWishlist = () => {
      const keyword = searchText.value.trim().toLowerCase();
      if (!keyword) {
        searchResult.value = null; // 搜索框为空，显示全部
        return;
      }
      searchResult.value = wishlist.value.filter(course =>
        course.title && course.title.toLowerCase().includes(keyword)
      );
    };

    // 获取愿望单列表
    const fetchWishlist = async () => {
      try {
        loading.value = true;
        const response = await wishlistApi.getWishlist();
        console.log('愿望单API响应:', response);

        // 根据API返回的数据更新wishlist
        if (response && response.data && Array.isArray(response.data)) {
          console.log('愿望单数据:', response.data);
          wishlist.value = response.data as WishListVO[];

          // 检查每个课程的ID字段
          wishlist.value.forEach((course, index) => {
            console.log(`课程 ${index} 完整数据:`, course);
            console.log(`课程 ${index} 所有属性:`, Object.keys(course));
          });
        } else {
          console.log('愿望单数据为空或格式不正确');
          wishlist.value = [];
        }
      } catch (error) {
        console.error('获取愿望单失败:', error);
        wishlist.value = [];
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

    // 清空愿望单
    const clearWishlist = async () => {
      try {
        await wishlistApi.clearWishlist();
        console.log('愿望单已清空');
        alert('愿望单已清空');
        wishlist.value = [];
      } catch (error) {
        console.error('清空愿望单失败:', error);
        alert('清空失败，请重试');
      }
    };

    // 跳转到课程页面
    const goToIndex = () => {
      window.location.href = '/index.html';
    };

    // 调试课程数据
    const debugCourse = (course: WishListVO) => {
      console.log('=== 课程数据结构 ===');
      console.log('原始对象:', course);
      console.log('所有属性:', Object.keys(course));
      console.log('JSON格式:', JSON.stringify(course, null, 2));
      console.log('可能的ID字段:');
      console.log('- id:', course.courseId);
      console.log('- courseId:', course.courseId);
      console.log('==================');
    };

    // 组件挂载时获取愿望单数据
    onMounted(() => {
      fetchWishlist();
    });

    return {
      iconWidth,
      wishlist,
      loading,
      formatTime,
      removeFromWishlist,
      clearWishlist,
      goToIndex,
      debugCourse,
      searchText,
      searchWishlist,
      searchResult
    };
  }
});
</script>

<style scoped>
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
  font-size: 2.2rem;
}

.empty-state p {
  margin-bottom: 30px;
  font-size: 1.6rem;
}

.browse-btn {
  background: linear-gradient(135deg, #165c91 0%, #134a7a 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(33, 84, 150, 0.3);
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
  box-shadow: 0 6px 20px rgba(33, 84, 150, 0.4);
  background: linear-gradient(135deg, #134a7a 0%, #0d3a5f 100%);
}

.browse-btn:hover::before {
  left: 100%;
}

.browse-btn:active {
  box-shadow: 0 2px 8px rgba(33, 84, 150, 0.3);
}

.wishlist-container {
  width: 110rem;
  min-width: 900px;
  padding: 2rem;
}

.wishlist-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 54px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.wishlist-header h2 {
  font-size: 2.8rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0;
}

.course-count {
  font-size: 1.6rem;
  color: #666;
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
  margin-left: 0;
}

.search-input,
.search-button {
  position: absolute;
  height: 3.4rem;
  border: .1px solid #215496;
  border-radius: 4px;
  padding: 0 1rem;
  font-size: 1.6rem;
  margin-left: 16px;
  outline: none;
  transition: border 0.2s;
}

.search-input {
  right: 3.7rem;
  width: 17rem;
}

.search-input:focus {
  border-color: #215496;
}

.search-button {
  padding: 0.3rem;
  margin-top: 0.1rem;
  width: 3.4rem;
  background-color: #215496;
  color: white;
  right: 1.7rem;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}


.course-card .course-title,
.course-card .course-meta {
  margin: 0px;
}

.course-duration {
  color: #666;
  font-size: 1.2rem;
}




.clear-btn {
  margin: 30px 0px 0px 1030px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
  color: white;
  border: none;
  width: fit-content;
  padding: 0px 12px;
  height: 42px;
  border-radius: 20px;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
}

button {
  white-space: nowrap;
}
</style>