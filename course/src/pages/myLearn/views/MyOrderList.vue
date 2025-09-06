<template>

  <div class="order-list-container">
    <ul class="order-list">
      <li v-if="orders.length > 0" v-for="(order, idx) in orders" :key="order.id" class="order-item">
        <div class="order-header" @click="toggleOrder(idx)">
          <span>订单号：{{ order.orderId }}</span>
          <span>下单时间：{{ order.createTime }}</span>
          <span>总价：￥{{ order.paymentPrice }}</span>
          <span class="arrow" :class="{ open: expandedIndex === idx }">▼</span>
        </div>
        <ul v-if="expandedIndex === idx" class="course-list">
          <div v-for="course in order.orderItemList" :key="course.id" class="course-card">
            <div class="course-image">
              <img :src="course.courseImage" :alt="course.courseName">
            </div>
            <div class="course-content">
              <h3 class="course-title">{{ course.courseName }}</h3>
              <div class="course-meta">
                <div class="course-rating">
                  <span class="stars">★★★★★</span>
                  <span class="rating-text">4.8 (2,187)</span>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </li>
      <div v-else class="empty-state">
        <h3>订单为空</h3>
        <p>您还没有购买任何课程</p>
        <button class="browse-btn" @click="goToIndex">浏览课程</button>

      </div>
    </ul>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { orderApi } from '@/api/order';
import '../myLearn.css'
export default defineComponent({
  name: 'MyOrderList',
  setup() {
    const orders = ref<any[]>([]);
    const expandedIndex = ref<number | null>(null);
    const toggleOrder = (idx: number) => {
      expandedIndex.value = expandedIndex.value === idx ? null : idx;
    };
    onMounted(async () => {
      const res = await orderApi.getMyOrders();
      orders.value = res.data || [];
      console.log("orders:" + orders.value);
    });
    const goToIndex = () => {
      window.location.href = '/index.html';
    };
    return {
      goToIndex,
      orders,
      expandedIndex,
      toggleOrder,
    };
  }
});
</script>

<style scoped>
.order-list-container {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
}

.order-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.order-item {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.6rem;
  border-bottom: 1px solid #f0f0f0;
  user-select: none;
}

.order-header .arrow {
  margin-left: 12px;
  transition: transform 0.2s;
  font-size: 1.8rem;
  display: inline-block;
}

.order-header .arrow.open {
  transform: rotate(180deg);
}

.course-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 20px;
  background: #fafbfc;
  border-radius: 0 0 8px 8px;
}

.course-list .course-card {
  height: fit-content;
  padding-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 12px;
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
</style>