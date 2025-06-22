<script lang="ts" setup>
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import { useWindowSize } from '@/useWindowSize'
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

const { width, height } = useWindowSize()

// 获取userId
const userId = ref<string | null>(null);

onMounted(() => {
  // 从URL参数获取userId
  const searchParams = new URLSearchParams(window.location.search);
  const urlUserId = searchParams.get('userId');
  if (urlUserId) {
    userId.value = decodeURIComponent(urlUserId);
  }

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

// 响应式数据
const orderList = ref<Course[]>([]);
const totalPrice = ref(0);
const courseCount = ref(0);
const selectedPayment = ref('alipay'); // 默认选择支付宝
const couponCode = ref(''); // 优惠券码
const discountAmount = ref(0); // 优惠金额
const finalPrice = ref(0); // 最终价格

// 计算最终价格
const calculateFinalPrice = () => {
  finalPrice.value = totalPrice.value - discountAmount.value;
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
    discountAmount.value = totalPrice.value * 0.1; // 10%折扣
    calculateFinalPrice();
    alert('优惠券应用成功！获得10%折扣');
  } else if (couponCode.value.toLowerCase() === 'save5') {
    discountAmount.value = 5; // 固定5美元折扣
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

  console.log(`使用${selectedPayment.value === 'alipay' ? '支付宝' : '微信支付'}支付 US$${finalPrice.value.toFixed(2)}`);
  // 这里可以添加实际的支付逻辑
  alert(`正在跳转到${selectedPayment.value === 'alipay' ? '支付宝' : '微信支付'}支付页面...`);
};

// 初始化最终价格
onMounted(() => {
  calculateFinalPrice();
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

    <!-- 右侧结算区域 -->
    <div class="total-section">
      <!-- 价格明细 -->
      <div class="price-breakdown">
        <h3>价格明细</h3>
        <div class="price-item">
          <span>小计:</span>
          <span>US${{ totalPrice.toFixed(2) }}</span>
        </div>
        <div class="price-item" v-if="discountAmount > 0">
          <span>优惠:</span>
          <span class="discount">-US${{ discountAmount.toFixed(2) }}</span>
        </div>
        <div class="price-item total">
          <span>总计:</span>
          <span class="final-price">US${{ finalPrice.toFixed(2) }}</span>
        </div>
      </div>

      <button class="pay-button" @click="handlePayment">支付 US${{ finalPrice.toFixed(2) }}</button>

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
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.section {
  flex: 2
}


.payment-methods {
  margin-bottom: 20px;
}

.payment-method {
  padding: 15px;
  border: 1px solid #d1d7dc;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
}

.payment-method.active {
  border-color: rgb(22, 92, 145);
  background-color: rgba(22, 92, 145, 0.1);
}

.order-summary {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.course-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.course-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  padding: 5px;
}

.price {
  font-weight: bold;
}

.total-section {
  flex: 1;
  text-align: right;
  margin: 20px 0;
  padding-left: 20px;
}

/* 优惠券样式 */
.coupon-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.coupon-section h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
  text-align: left;
}

.coupon-input {
  display: flex;
  gap: 10px;
}

.coupon-code-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.coupon-code-input:focus {
  outline: none;
  border-color: #165c91;
}

.apply-coupon-btn {
  padding: 8px 16px;
  background-color: #165c91;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  white-space: nowrap;
  min-width: fit-content;
}

.apply-coupon-btn:hover {
  background-color: #134a7a;
}

/* 价格明细样式 */
.price-breakdown {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
}

.price-breakdown h3 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.price-item.total {
  border-top: 1px solid #eee;
  padding-top: 8px;
  margin-top: 8px;
  font-weight: bold;
  font-size: 16px;
}

.discount {
  color: #dc3545;
}

.final-price {
  color: #165c91;
  font-weight: bold;
}

.pay-button {
  background-color: rgb(22, 92, 145);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}

.pay-button:hover {
  background-color: rgba(22, 92, 145, 0.8);
}

.refund-policy {
  margin-top: 20px;
  padding: 15px;
  background-color: #f7f9fa;
  border-radius: 4px;
}
</style>