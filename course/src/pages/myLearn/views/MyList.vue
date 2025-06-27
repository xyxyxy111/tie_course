<template>

  <div class="mycourses-container">
    <div class="course-card" v-for="(course, index) in courses" :key="index">
      <img :src="course.coverimg" :alt="course.title">
      <h5>{{ course.title }}</h5>
      <p v-if="course.price">￥{{ course.price }}</p>

      <div class="progress-bar">
        <div class="in-progressbar" :style="{ width: (course.progress || 0) + '%' }"></div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { orderApi } from '@/api/order';

export default defineComponent({
  name: 'MyList',
  setup() {
    const courses = ref<any[]>([]);

    onMounted(async () => {
      try {
        const res = await orderApi.getMyOrders();
        courses.value = (res.data || []).flatMap((order: any) =>
          (order.orderItemList || []).map((item: any) => ({
            coverimg: item.courseImage,
            title: item.courseName,
            progress: 0 // 这里没有进度，后续可扩展
          }))
        );
      } catch (e) {
        console.error('获取订单失败', e);
      }
    });
    return { courses };
  }
});
</script>

<style scoped>
.mycourses-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 30px 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  min-height: 300px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .mycourses-container {
    grid-template-columns: 1fr;
    padding: 20px 15px;
    gap: 16px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .mycourses-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.course-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 0.3s;
}

.course-card:hover img {
  transform: scale(1.05);
}

.course-card h5 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 16px 16px 8px 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-card p {
  font-size: 15px;
  color: #165c91;
  font-weight: 600;
  margin: 0 16px 12px 16px;
}

.progress-bar {
  height: 8px;
  background: #f1f3f4;
  border-radius: 4px;
  margin: 0 16px 16px 16px;
  overflow: hidden;
}

.in-progressbar {
  height: 100%;
  background: linear-gradient(90deg, #165c91 0%, #134a7a 100%);
  border-radius: 4px;
  width: 50%;
  /* 可用 :style 动态绑定进度 */
  transition: width 0.3s;
}

/* 移动端卡片样式优化 */
@media (max-width: 768px) {
  .course-card h5 {
    font-size: 14px;
    margin: 12px 12px 6px 12px;
  }

  .course-card p {
    font-size: 13px;
    margin: 0 12px 8px 12px;
  }

  .progress-bar {
    margin: 0 12px 12px 12px;
  }
}
</style>