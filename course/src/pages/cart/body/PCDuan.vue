<script lang="ts" setup>
import {ref,computed} from 'vue'
import { useWindowSize } from '@/useWindowSize';
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
        </div>
      </div>
    </div>
  </div>
  <PCBottom />
</template>

<style scoped>
/* 保持原有PC端样式不变 */
.shopping-cart-container {
  width: 100%;
  min-width: 850px;
  max-width: 1600px;
  margin: 0 auto;
  padding-inline: 2%;
}

/* 其他原有样式保持不变 */
</style>
<style scoped>
.shopping-cart-container {
  width: 100%;
  min-width: 850px;
  max-width: 1600px;
  margin: 0 auto;
  padding-inline: 2%;
}


.shopping-cart-container .title {
  min-width: fit-content;
  font-size: 40px;
  text-align: left;
  min-width: 800px;
  font-weight: 600;
  padding-top: 20px;
  font-family: 'Times New Roman', Times, serif
}

.shopping-cart-container .content {
  display: flex;
  margin: 0 auto;
  border-radius: 10px;
  width: 90%;
  max-width: 1400px;
  min-width: 850px;
  padding: 20px 0px;
  border: none;
  margin-bottom: 100px;
}

.shopping-cart-container .course-list {
  flex: 2;
}


.shopping-cart-container .course-item img {
  width: 240px;
  height: 140px;
  margin-right: 10px;
}

.shopping-cart-container .checkout-section {
  flex: 1;
}

.shopping-cart-container .checkout-summary {
  border: none;
  padding: 15px;
  margin-bottom: 20px;
}

.shopping-cart-container .checkout-summary div {
  font-weight: 500;
  font-size: 20px;
  padding-inline: 10px;
}

.shopping-cart-container .checkout-summary #totalPrice {
  font-size: 40px;
}

.shopping-cart-container .checkout-summary button {
  font-weight: 600;
}


.shopping-cart-container .icon-demo {
  display: inline-block;
  color: white;
  background-color: rgb(22, 92, 145);
  border-radius: 25px;
}

.shopping-cart-container .icon-course {
  width: 48px;
  height: 48px;
  padding: 7px 8px;
}
</style>
