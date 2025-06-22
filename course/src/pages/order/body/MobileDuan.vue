<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import MoblieHeader from '@/components/common/MoblieHeader.vue'
import '../order.css'
import { OrderItem } from '@/types/types';

interface Course {
  id: number;
  image: string;
  title: string;
  price: number;
}

interface CartData {
  courses: Course[];
  total: number;
  userId: string;
}

// 响应式数据
const orderList = ref<Course[]>([]);
const totalPrice = ref(0);
const courseCount = ref(0);
const selectedPayment = ref('alipay'); // 默认选择支付宝

onMounted(() => {
  try {
    // 1. 从localStorage获取数据
    const rawData = localStorage.getItem('tempCartData');

    // 2. 检查数据是否存在
    if (!rawData) {
      throw new Error('购物车数据不存在');
    }

    // 3. 解析数据
    const cartData: CartData = JSON.parse(rawData);

    // 4. 验证数据格式
    if (!cartData.courses || !Array.isArray(cartData.courses)) {
      throw new Error('购物车数据格式错误');
    }

    // 5. 赋值给响应式变量
    orderList.value = cartData.courses;
    totalPrice.value = cartData.total;
    courseCount.value = cartData.courses.length;

    // 6. 清除临时存储（可选）
    localStorage.removeItem('tempCartData');

  } catch (error) {
    console.error('加载购物车数据失败:', error);
    // 7. 出错时重定向回购物车页
    window.location.href = '/cart.html';
  }
});

// 处理付款方式选择
const handlePaymentChange = (paymentMethod: string) => {
  selectedPayment.value = paymentMethod;
};

// 处理支付
const handlePayment = () => {
  if (!selectedPayment.value) {
    alert('请选择付款方式');
    return;
  }

  console.log(`使用${selectedPayment.value === 'alipay' ? '支付宝' : '微信支付'}支付 US$${totalPrice.value.toFixed(2)}`);
  // 这里可以添加实际的支付逻辑
  alert(`正在跳转到${selectedPayment.value === 'alipay' ? '支付宝' : '微信支付'}支付页面...`);
};

</script>

<!-- html -->
<template>
  <IconSprite />
  <MoblieHeader />

  <div class="payment-container">
    <!-- 付款方式部分 -->
    <div class="section">
      <h2>付款方式</h2>

      <div class="payment-method" :class="{ active: selectedPayment === 'alipay' }"
        @click="handlePaymentChange('alipay')">
        <input type="radio" id="alipay" name="payment" value="alipay" :checked="selectedPayment === 'alipay'">
        <label for="alipay">支付宝</label>
      </div>

      <div class="payment-method" :class="{ active: selectedPayment === 'wechat' }"
        @click="handlePaymentChange('wechat')">
        <input type="radio" id="wechat" name="payment" value="wechat" :checked="selectedPayment === 'wechat'">
        <label for="wechat">微信支付</label>
      </div>

      <div class="order-summary">
        <h3>订单详细信息 ( {{ orderList.length }} 个课程)</h3>
        <ul class="course-list">
          <li v-for="(course, index) in orderList" class="course-item">
            <img :src="course.image" alt="">
            <span class="title">{{ course.title }}</span>
            <span class="price">{{ course.price }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="total-section">
      <button class="pay-button" @click="handlePayment">支付 US${{ totalPrice.toFixed(2) }}</button>
    </div>
  </div>
</template>


<style scoped>
.payment-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.section {
  width: 100%;
}

h2 {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
}

h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.payment-method {
  padding: 15px;
  border: 1px solid #d1d7dc;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method.active {
  border-color: rgb(22, 92, 145);
  background-color: rgba(22, 92, 145, 0.1);
}

.payment-method:hover {
  border-color: rgb(22, 92, 145);
  background-color: rgba(22, 92, 145, 0.05);
}

.payment-method input[type="radio"] {
  margin-right: 10px;
}

.payment-method label {
  cursor: pointer;
  font-weight: 500;
}

.order-summary {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 20px;
}

.course-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.course-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.course-item img {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.course-item .title {
  flex: 1;
  font-size: 14px;
  margin: 0 10px;
}

.course-item .price {
  font-weight: bold;
  color: rgb(22, 92, 145);
}

.total-section {
  text-align: center;
  margin: 20px 0;
  padding: 20px 0;
}

.pay-button {
  background-color: rgb(22, 92, 145);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
}

.pay-button:hover {
  background-color: rgba(22, 92, 145, 0.8);
}
</style>