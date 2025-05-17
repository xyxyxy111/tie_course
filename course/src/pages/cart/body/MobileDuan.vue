<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, computed } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import { useWindowSize } from '@/useWindowSize';
import Tooltip from '@/components/common/Tooltip.vue';
import MoblieHeader from '@/components/common/MoblieHeader.vue';
import MobileBottom from '@/components/common/MobileBottom.vue';
import '../cart.css';
const { width, height } = useWindowSize()


const courses = ref([
  {
    id: 1,
    image: '/src/images/image1.png',
    title: 'Ultimate AWS Certified Solutions Architect Associate 2025',
    instructor: 'Shizhane Muresi',
    price: 109.99
  },
  {
    id: 2,
    image: '/src/images/image2.png',
    title: 'The Complete AI Guide: Learn ChatGPT, Generative AI & More',
    instructor: 'Julian Melancon',
    price: 79.99
  }
])

const totalPrice = computed(() =>
  courses.value.reduce((sum, course) => sum + course.price, 0)
)

const checkout = () => {
  console.log('Proceeding to checkout')
}

</script>

<template>
  <IconSprite />
  <MoblieHeader />
  <div>
    <div class="shopping-cart-container">
      <div class="title">Shopping Cart</div>
      <div class="content">
        <div class="course-list">
          <h1>{{ courses.length }} Courses in Cart</h1>
          <div v-for="course in courses" :key="course.id" class="course-item">
            <img :src="course.image" alt="">
            <div>
              <h3 class="course-title">{{ course.title }}</h3>
              <p v-if="width>500">By {{ course.instructor }}</p>
            </div>
            <div>
              <div class="course-price">${{ course.price }}</div>
              <div>
                <button class="cart-buttons">Remove</button>
              </div>
              <div>
                <button class="cart-buttons">Save for Later</button>
              </div>
            </div>
          </div>

        </div>

        <!-- 结算区域现在会在下方显示 -->
        <div class="checkout-section">
          <div class="checkout-summary">
            <div>Total:</div>
            <div id="totalPrice">${{ totalPrice }}</div>
            <button @click="checkout">Proceed to checkout →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MobileBottom />
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
  width: 35%;
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
  font-weight: 700;
  font-size: 16px;
  padding-inline: 20px;
}

.shopping-cart-container .checkout-summary #totalPrice {
  font-size: 36px;
}

</style>