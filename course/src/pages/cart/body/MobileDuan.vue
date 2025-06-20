<script lang="ts" setup>
import { useWindowSize } from '@/useWindowSize';
import { ref, computed } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue';
import PCHeader from '@/components/common/PCHeader.vue';
import PCBottom from '@/components/common/PCBottom.vue';
import { useCartLogic } from '../components/content';
import '../cart.css';

const { width } = useWindowSize();
const { courses, totalPrice, goToCheckout } = useCartLogic();

const headerSpaceWidth = computed(() => Math.max(0, (width.value - 1200) / 2000));
const headerSpaceStyle = computed(() => ({
  padding: `calc(3vw * ${headerSpaceWidth.value})`
}));

const CourseInstructorStyle = () => ({});
const CourseTitleStyle = () => ({});
const CourseIncartStyle = () => ({});
</script>

<template>
  <IconSprite />
  <PCHeader />
  <div class="shopping-cart-container" :style="headerSpaceStyle">
    <div class="title">Shopping Cart</div>
    <div class="content">
      <div class="course-list">
        <h1>{{ courses.length }} Courses in Cart</h1>
        <table>
          <tr v-for="course in courses" :key="course.id" class="course-item">
            <td><img :src="course.image" alt=""></td>
            <td>
              <div class="course-incart" :style="CourseIncartStyle()">
                <h2 :style="CourseTitleStyle()">{{ course.title }}</h2>
              </div>
            </td>
            <td v-if="width < 1200">
              <div class="course-price">${{ course.price }}</div>
              <div>
                <button class="cart-buttons">Remove</button>
              </div>
              <div>
                <button class="cart-buttons">Save for Later</button>
              </div>
            </td>
            <td v-if="width >= 1200">
              <div>
                <button class="cart-buttons">Remove</button>
              </div>
              <div>
                <button class="cart-buttons">Save for Later</button>
              </div>
            </td>
            <td v-if="width >= 1200" class="course-price">
              <div>${{ course.price }}</div>
            </td>
          </tr>
        </table>
      </div>

      <div class="checkout-section">
        <div class="checkout-summary">
          <div class="total-label">Total:</div>
          <div id="totalPrice"> ${{ totalPrice }}</div>
          <button @click="goToCheckout">Proceed to checkout →</button>
          <hr>
          <div class="promotion-label">Promotions</div>
          <input type="text" name="couponId" id="coupon">
          <button class="coupon-btn">Apply</button>
        </div>
      </div>
    </div>
  </div>
  <PCBottom />
</template>

<style scoped>
.shopping-cart-container .content {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  border-radius: 10px;
  width: 100%;
  min-width:400px;
  padding: 20px 0px;
  border: none;
  margin-bottom: 100px;
}

.shopping-cart-container .course-list {
  width: 100%;
}

.shopping-cart-container .checkout-section {
  margin: 0 auto;
  width: 90%;
}

.shopping-cart-container .title {
  min-width: fit-content;
  font-size: 36px;
  text-align: left;
  font-weight: 600;
  padding-top: 10px;
  padding-left: 10%;
  white-space: nowrap;
  font-family: 'Times New Roman', Times, serif
}


.shopping-cart-container .course-item img {
  width: 100%;
  max-width: 180px;
  height: 120px;
  margin-right: 20px;
}

.shopping-cart-container .course-title{
  margin-bottom: 10px;
overflow: hidden;
}

.shopping-cart-container .checkout-summary {
  border: none;
  margin: 0 auto;
}

.shopping-cart-container .checkout-summary div {
  margin: 0 auto;
  font-weight: 700;
  font-size: 16px;
  padding-inline: 20px;
}

.shopping-cart-container .checkout-summary #totalPrice {
  font-size: 36px;
}

</style>