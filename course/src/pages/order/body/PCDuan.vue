<script lang="ts" setup>
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import { useWindowSize } from '@/useWindowSize'
import '../order.css'
// 导入共享的数据和逻辑
import {
  cartCourses,
  cartTotal,
  cartOriginalTotal,
  cartSaved,
  selectedPayment,
  couponCode,
  applyCoupon,
  discountAmount,
  finalPrice,
  payAmount,
  payLoading,
  payStatusMsg,
  payStatusType,
  payOrderInfo,
  currentOrderId,
  useOrderData,
  useOrderUtils,
  orderStatusOptions,
  timeRangeOptions,
  initializeData,
  handlePayment,
  handlePaymentChange,
  testNotify,
  testCancel,
  testRefund,
  queryOrder,
  getStatusText,
} from '../content';
import PCHeader from '@/components/common/PCHeader.vue'

const { width, height } = useWindowSize()


// 组件挂载时加载购物车数据
onMounted(() => {
  initializeData();
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#27b148">
          <use href="#bi--alipay" />
        </svg>
        <label for="alipay">

          支付宝</label>
      </div>

      <div class="payment-method" :class="{ active: selectedPayment === 'wechat' }"
        @click="handlePaymentChange('wechat')">
        <input type="radio" id="wechat" name="payment" value="wechat" :checked="selectedPayment === 'wechat'">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#27b148">
          <use href="#ic--baseline-wechat" />
        </svg>
        <label for="wechat">

          微信支付</label>
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
    </div>

    <!-- 右侧结算区域 -->
    <div class="total-section">
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
@import "@/assets/rem.css";

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

.payment-method.active {
  background-color: #215496;
  color: #fff;
}

.payment-method {
  display: flex;
  background: #fff;
  color: #215496;
  border: 1px #215496 solid;
  font-size: 1.6rem;
  font-weight: bold;
  border-radius: 10px;
  padding: 1rem 2rem;
  margin: 2rem;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}

.payment-method .icon {
  margin-right: 15px;
  width: 28px;
  height: 28px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
}

.payment-method input[type="radio"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.payment-method label {
  margin-left: 1rem;
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
  font-size: 1.6rem;
}

.course-item img {
  width: 200px;
  height: 120px;
  border-radius: 6px;
}

.title {
  width: calc(100% - 260px);
  padding-left: 1rem;
}

.price {
  width: 60px;
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
  font-size: 1.6rem;
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
  font-size: 1.4rem;
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
  font-size: 1.4rem;
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
  font-size: 1.6rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 1.4rem;
}

.price-item.total {
  border-top: 1px solid #eee;
  padding-top: 8px;
  margin-top: 8px;
  font-weight: bold;
  font-size: 1.6rem;
}

.discount {
  color: #dc3545;
}

.saved {
  color: #28a745;
}

.final-price {
  color: #165c91;
  font-weight: bold;
}

.pay-button {
  background-color: #215496;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1.6rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
  margin-bottom: 20px;
}

.pay-button:hover {
  background-color: rgba(33, 84, 150, 0.8);
}

.refund-policy {
  margin-top: 20px;
  padding: 15px;
  background-color: #f7f9fa;
  border-radius: 4px;
}
</style>