<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import '../order.css'

// 导入共享的数据和逻辑
import { useOrderData, useOrderUtils, orderStatusOptions, timeRangeOptions } from '../content';

// 使用共享的数据和逻辑
const {
  orders,
  loading,
  error,
  userId,
  currentPage,
  pageSize,
  totalPages,
  totalOrders,
  selectedStatus,
  selectedTimeRange,
  initializeData,
  fetchOrders,
  handlePageChange,
  handleStatusFilter,
  handleTimeRangeFilter,
  cancelOrder,
  confirmReceipt,
  applyRefund
} = useOrderData();

const {
  formatOrderStatus,
  getOrderStatusColor,
  formatPrice,
  formatTime,
  formatOrderNumber,
  calculateOrderTotal,
  calculateOrderOriginalTotal,
  canCancelOrder,
  canConfirmReceipt,
  canApplyRefund
} = useOrderUtils();

onMounted(async () => {
  await initializeData();
});

// 购物车数据
const cartData = ref<any>(null);
const cartCourses = ref<any[]>([]);
const cartTotal = ref(0);
const cartOriginalTotal = ref(0);
const cartSaved = ref(0);

// 响应式数据
const selectedPayment = ref('alipay'); // 默认选择支付宝
const couponCode = ref(''); // 优惠券码
const discountAmount = ref(0); // 优惠金额
const finalPrice = ref(0); // 最终价格

// 从localStorage读取购物车数据
const loadCartData = () => {
  try {
    const storedData = localStorage.getItem('tempCartData');
    if (storedData) {
      cartData.value = JSON.parse(storedData);
      cartCourses.value = cartData.value.courses || [];
      cartTotal.value = cartData.value.total || 0;
      cartOriginalTotal.value = cartData.value.originalTotal || 0;
      cartSaved.value = cartData.value.saved || 0;

      // 初始化最终价格
      finalPrice.value = cartTotal.value;

      console.log('购物车数据加载成功:', cartData.value);
    } else {
      console.log('没有找到购物车数据');
      // 如果没有购物车数据，可以重定向回购物车页面
      // window.location.href = '/cart.html';
    }
  } catch (error) {
    console.error('读取购物车数据失败:', error);
  }
};

// 计算最终价格
const calculateFinalPrice = () => {
  finalPrice.value = cartTotal.value - discountAmount.value;
};

// 处理付款方式选择
const handlePaymentChange = (paymentMethod: string) => {
  selectedPayment.value = paymentMethod;
};

// 应用优惠券
const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    alert('请输入优惠券码');
    return;
  }

  // 这里可以添加实际的优惠券验证逻辑
  // 示例：简单的优惠券逻辑
  if (couponCode.value.toLowerCase() === 'discount10') {
    discountAmount.value = cartTotal.value * 0.1;
    calculateFinalPrice();
    alert('优惠券应用成功！获得10%折扣');
  } else if (couponCode.value.toLowerCase() === 'save5') {
    discountAmount.value = 5;
    calculateFinalPrice();
    alert('优惠券应用成功！获得5美元折扣');
  } else {
    alert('无效的优惠券码');
  }
};

// 处理支付
const handlePayment = () => {
  if (!selectedPayment.value) {
    alert('请选择付款方式');
    return;
  }

  console.log(`使用${selectedPayment.value === 'alipay' ? '支付宝' : '微信支付'}支付 ¥${finalPrice.value.toFixed(2)}`);
  // 这里可以添加实际的支付逻辑
  alert('支付功能开发中...');
};

// 组件挂载时加载购物车数据
onMounted(() => {
  loadCartData();
});
</script>

<!-- html -->
<template>
  <IconSprite />
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
        <h3>订单详细信息 ( {{ cartCourses.length }} 个课程)</h3>
        <ul class="course-list">
          <li v-for="(course, index) in cartCourses" :key="index" class="course-item">
            <img :src="course.image" alt="">
            <span class="title">{{ course.title }}</span>
            <span class="price">¥{{ course.price.toFixed(2) }}</span>
          </li>
        </ul>
      </div>

      <!-- 价格明细 -->
      <div class="price-breakdown">
        <h3>价格明细</h3>
        <div class="price-item" v-if="cartOriginalTotal > cartTotal">
          <span>原价:</span>
          <span class="original-price">¥{{ cartOriginalTotal.toFixed(2) }}</span>
        </div>
        <div class="price-item" v-if="cartSaved > 0">
          <span>节省:</span>
          <span class="saved">-¥{{ cartSaved.toFixed(2) }}</span>
        </div>
        <div class="price-item" v-if="discountAmount > 0">
          <span>优惠:</span>
          <span class="discount">-¥{{ discountAmount.toFixed(2) }}</span>
        </div>
        <div class="price-item total">
          <span>总计:</span>
          <span class="final-price">¥{{ finalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <div class="total-section">
      <button class="pay-button" @click="handlePayment">支付 ¥{{ finalPrice.toFixed(2) }}</button>

      <!-- 优惠券输入 -->
      <div class="coupon-section">
        <h3>优惠券</h3>
        <div class="coupon-input">
          <input type="text" v-model="couponCode" placeholder="输入优惠券码" class="coupon-code-input">
          <button @click="applyCoupon" class="apply-coupon-btn">应用</button>
        </div>
      </div>
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
  border-color: #215486;
  background-color: rgba(33, 84, 150, 0.1);
}

.payment-method:hover {
  border-color: #215486;
  background-color: rgba(33, 84, 150, 0.05);
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
  color: #215486;
}

.coupon-section {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.coupon-section h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: left;
}

.coupon-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.coupon-code-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #d1d7dc;
  border-radius: 4px;
  font-size: 14px;
}

.coupon-code-input:focus {
  outline: none;
  border-color: #165c91;
}

.apply-coupon-btn {
  background-color: #215486;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  white-space: nowrap;
  min-width: fit-content;
}

.apply-coupon-btn:hover {
  background-color: rgba(33, 84, 150, 0.8);
}

.price-breakdown {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 20px;
  background-color: white;
}

.price-breakdown h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.price-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
}

.price-item.total {
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 10px;
  font-weight: bold;
  font-size: 16px;
}

.price-item .discount {
  color: #dc3545;
}

.price-item .saved {
  color: #28a745;
}

.price-item .final-price {
  font-weight: bold;
  color: #165c91;
}

.total-section {
  text-align: center;
  margin: 20px 0;
  padding: 20px 0;
}

.pay-button {
  background-color: #215486;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-bottom: 20px;
}

.pay-button:hover {
  background-color: rgba(33, 84, 150, 0.8);
}
</style>