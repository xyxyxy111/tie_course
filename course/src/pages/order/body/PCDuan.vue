<script lang="ts" setup>
import { toRef, ref, onMounted, computed } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import { useWindowSize } from '@/useWindowSize'
import '../order.css'
// 导入共享的数据和逻辑
import {
  cartCourses,
  orderCourseIds,
  cartTotal,
  cartOriginalTotal,
  cartSaved,
  selectedPayment,
  couponCode,
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
  qrCodeImage,
  showWechatModal,
  isConfirmingPayment,
  confirmPayment
} from '../content';
import PCHeader from '@/components/common/PCHeader.vue'
import { type UserCouponVO, type PriceDetailVO, CouponStatus, CouponType } from '@/api/coupon'
import { useCoupon } from '@/composables/useCoupon'
const { width, height } = useWindowSize()
const {
  coupons,
  loading: couponLoading,
  error: couponError,
  fetchMyCoupons,
  applyCoupon,
  getAvailableCoupons,
  CouponStatus: CouponStatusEnum,
  CouponType: CouponTypeEnum
} = useCoupon()

import { getCurrentUserId, getValidToken } from '@/utils/request';

// 优惠券相关状态
const selectedCouponId = ref<number | null>(null)
const priceDetail = ref<PriceDetailVO | null>(null)
const showCouponList = ref(false)
const filterStatus = ref<string | null>(null)
const filterType = ref<string | null>(null)
const userId = ref<string | null>(null)

onMounted(() => {
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  }
  initializeData();
  fetchCoupons();
});

async function fetchCoupons() {
  try {
    await fetchMyCoupons();
  } catch (err) {
    console.error(err);
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}


// 输入优惠券ID并应用优惠券
const applyCoupons = async () => {
  try {
    const courseIds = cartCourses.value.map(course => course.coureseId);
    console.log(cartCourses.value[0] + "---===" + courseIds)
    const result = await applyCoupon(couponCode.value, orderCourseIds.value, finalPrice.value);
    discountAmount.value = 0;
    // 更新价格
    priceDetail.value = result.data;
    discountAmount.value = result.data.discountPrice;
    console.log(discountAmount.value)
    finalPrice.value = result.data.finalPrice;
    // couponCode.value = result.data.couponIds || "优惠券";

    console.log('优惠券已应用:', result);
  } catch (err) {
    console.error('应用优惠券失败:', err);
  }
}

// 移除已使用的优惠券
const removeCoupon = () => {
  selectedCouponId.value = null;
  couponCode.value = 0;
  priceDetail.value = null;
  discountAmount.value = 0;
  finalPrice.value = cartTotal.value; // 恢复为未应用优惠券时的原始总价
}

</script>

<!-- html -->
<template>
  <IconSprite />
  <transition name="fade">
    <div v-if="showWechatModal" class="wechat-modal-overlay" @click.self="showWechatModal = false">
      <div class="wechat-modal">
        <div class="modal-header">
          <h3>微信支付</h3>
          <button class="close-btn" @click="showWechatModal = false">
            <SvgIcon name="close" width="20" height="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="qr-code-container">
            <img :src="qrCodeImage" alt="微信支付二维码" v-if="qrCodeImage" />
            <div v-else class="qr-loading">
              <SvgIcon name="loading" spin width="40" height="40" />
              <p>正在生成支付二维码...</p>
            </div>
          </div>
          <div class="payment-info">
            <p class="amount">支付金额：<span>¥{{ finalPrice.toFixed(2) }}</span></p>
            <p class="order-id">订单号：{{ currentOrderId }}</p>
          </div>
          <button class="confirm-btn" @click="confirmPayment" :disabled="isConfirmingPayment">
            <SvgIcon v-if="isConfirmingPayment" name="loading" spin width="16" height="16" />
            {{ isConfirmingPayment ? "支付确认中..." : "已完成支付" }}
          </button>
          <p class="hint-text">请打开微信扫一扫完成支付</p>
        </div>
      </div>
    </div>
  </transition>
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
        <h3>订单概要</h3>
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
          <button @click="applyCoupons()" class="apply-coupon-btn">应用</button>
        </div>
        <div class="coupon-list-container">

          <div v-if="showCouponList" class="coupon-list-content">
            <div v-if="couponLoading" class="coupon-loading">
              加载中...
            </div>
            <div v-else-if="couponError" class="coupon-error">
              {{ couponError }}
            </div>
            <div v-else-if="coupons.length === 0" class="coupon-empty">
              暂无优惠券
            </div>
            <!-- 优惠券列表 -->
            <div v-else class="coupon-items">
              <div v-for="coupon in coupons" :v-if="coupon.status == 'unused'" :key="coupon.userCouponId"
                class="coupon-item">
                <div class="coupon-content">
                  <div class="coupon-discount">
                    <span class="coupon-type">{{ coupon.couponType == 'fixed' ? '折扣券' : '满减券' }} </span>
                    <span v-if="coupon.couponType !== 'fixed'">满¥{{ coupon.minOrderAmount || 0 }}减{{
                      coupon.discountValue ? `${coupon.discountValue}` :
                        '无' }}元</span>
                    <span v-if="coupon.couponType === 'fixed' && coupon.discountValue && coupon.minOrderAmount">
                      满¥{{ coupon.minOrderAmount || 0 }}享{{ (10 - (coupon.discountValue / coupon.minOrderAmount * 10))
                      }}折</span>
                  </div>
                  <div class="coupon-field">
                    <span class="field-label">优惠券ID:</span> <span>{{ coupon.userCouponId }}</span>
                  </div>
                  <div class="coupon-field">
                    <span class="field-label">有效期至:</span> <span>{{ formatDate(coupon.expireTime) }}</span>
                  </div>


                </div>
              </div>
            </div>

          </div>

          <div class="coupon-list-header">
            <button class="toggle-coupon-list" @click="showCouponList = !showCouponList">
              {{ showCouponList ? '收起' : '可用优惠券' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>



</template>


<style scoped>
@import "@/assets/rem.css";

.payment-container {
  display: flex;
  width: 1200px;
  max-width: 100%;
  min-width: 800px;
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
  flex: 2;
}

.section h2 {
  height: 60px;
  margin-bottom: 50px;
  color: rgba(16, 16, 16, 1);
  font-size: 48px;
  text-align: left;
  font-family: PingFangSC-bold;
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
  border-radius: 8px;
  width: 700px;
}

.order-summary h3 {
  border-bottom: 1px solid #e0e0e0;
  height: 40px;
  color: rgba(16, 16, 16, 1);
  font-size: 16px;
  text-align: left;
  font-family: PingFangSC-bold;
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
  font-size: 1.6rem;
}

.course-item img {
  width: 100px;
  height: 58px;
  border: 1px solid #e0e0e0;
}

.title {
  width: calc(100% - 100px);
  padding-left: 1rem;
  color: #010101;
  font-size: 18px;
  text-align: left;
  font-family: PingFangSC-bold;
}

.price {
  text-align: right;
  width: 60px;
  font-family: PingFangSC-regular;
}



.total-section {
  flex: 1;
  text-align: right;
  margin: 20px 0;
  border: none;
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
  border: none;
  border-radius: 8px;
  background-color: white;
}

.price-breakdown h3 {
  margin-bottom: 15px;
  width: 156px;
  height: 40px;
  line-height: 39px;
  color: rgba(69, 69, 69, 1);
  font-size: 28px;
  text-align: left;
  font-family: PingFangSC-bold;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #010101;
  font-size: 16px;
  text-align: left;
  font-family: PingFangSC-regular;
}

.price-item.total {
  border-top: 1px solid #eee;
  padding-top: 8px;
  margin-top: 8px;
  font-weight: bold;
  font-size: 2rem;
  font-family: PingFangSC-bold;
}

.discount,
.saved,
.final-price {
  color: rgba(16, 16, 16, 1);
}

.final-price {
  color: #010101;
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

/* 遮罩层样式 */
.wechat-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

/* 弹窗容器 */
.wechat-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
}

/* 弹窗头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #666;
}

/* 弹窗内容 */
.modal-body {
  padding: 20px;
  text-align: center;
}

/* 二维码容器 */
.qr-code-container {
  margin: 0 auto 20px;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 8px;
  display: inline-block;
}

.qr-code-container img {
  width: 200px;
  height: 200px;
  display: block;
}

.qr-loading {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
}

/* 支付信息 */
.payment-info {
  margin-bottom: 20px;
  text-align: center;
}

.amount {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.amount span {
  font-weight: bold;
  color: #f56c6c;
  font-size: 20px;
}

.order-id {
  font-size: 12px;
  color: #999;
  word-break: break-all;
}

/* 确认按钮 */
.confirm-btn {
  width: 100%;
  padding: 12px;
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.confirm-btn:hover {
  background-color: #06ad56;
}

.confirm-btn:disabled {
  background-color: #a0d8b3;
  cursor: not-allowed;
}

/* 提示文字 */
.hint-text {
  margin-top: 12px;
  font-size: 12px;
  color: #999;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes modalFadeIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.coupon-list-container {
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}

.coupon-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.toggle-coupon-list {
  background-color: #215496;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-coupon-list:hover {
  background-color: #0056b3;
}


.coupon-loading {
  text-align: center;
  font-size: 14px;
  color: #999;
}

.coupon-error {
  color: red;
  font-size: 14px;
  text-align: center;
}

.coupon-empty {
  text-align: center;
  font-size: 16px;
  color: #666;
}

.coupon-items {
  margin-top: 20px;
}

.coupon-item {
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  width: 100%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.coupon-item:hover {
  transform: scale(1.02);
  background-color: #e7edf931;
}

.coupon-content {
  display: flex;
  flex-direction: column;
  /* 垂直排列 */
}

.coupon-discount {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}

.coupon-discount span {
  font-size: 18px;
  font-weight: bolder;
}

.coupon-discount .coupon-type {
  color: #133c71;
}

.coupon-field {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  font-size: 14px;
}
</style>