<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import MoblieHeader from '@/components/common/MoblieHeader.vue'
import MoblieBottom from '@/components/common/MobileBottom.vue';
import '../order.css'

</script>

<!-- html -->
<template>
  <IconSprite />

  <div class="payment-container">
    <h1>付款</h1>

    <!-- 付款方式部分 -->
    <div class="section">
      <h2>付款方式</h2>

      <div class="payment-methods">
        <div class="payment-method">
          <input type="radio" id="credit-card" name="payment" checked>
          <label for="credit-card">银行卡</label>
          <div class="card-types">
            <span class="card-type visa">VISA</span>
            <!-- 可以添加其他卡类型 -->
          </div>
          <div class="secure-notice">安全日加密</div>
        </div>

        <div class="payment-method">
          <input type="radio" id="paypal" name="payment">
          <label for="paypal">PayPal</label>
        </div>
      </div>


      <!-- 订单详情 -->
      <div class="order-summary">
        <h3>订单详细信息 (9 个课程)</h3>
        <ul class="course-list">
          <li class="course-item">
            <span>来杯Java吧! 2025 Java 入門到精通课程</span>
            <span class="price">US$69.99</span>
          </li>
          <li class="course-item">
            <span>2025 Python全攻略</span>
            <span class="price">US$74.99</span>
          </li>
          <li class="course-item">
            <span>ChatGPT：释放 AI 生产力的无限潜能</span>
            <span class="price">US$74.99</span>
          </li>
          <!-- 其他课程项 -->
        </ul>

        <div class="total-section">
          <button class="pay-button">支付 US$524.91</button>
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


h1,
h2,
h3,
h4 {
  color: #2d2f31;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.tax-notice {
  color: #6a6f73;
  font-size: 14px;
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
  ToCartground-color: rgba(22, 92, 145, 0.1);
}


.secure-notice {
  color: #6a6f73;
  font-size: 12px;
  margin-top: 5px;
}

.form-check {
  margin-top: 15px;
}

.form-check-label {
  margin-left: 5px;
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

.price {
  font-weight: bold;
}

.total-section {
  text-align: right;
  margin: 20px 0;
}

.pay-button {
  ToCartground-color: rgb(22, 92, 145);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.pay-button:hover {
  ToCartground-color: rgba(22, 92, 145, 0.8);
}

.refund-policy {
  margin-top: 20px;
  padding: 15px;
  ToCartground-color: #f7f9fa;
  border-radius: 4px;
}
</style>