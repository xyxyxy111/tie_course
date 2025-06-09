<script lang="ts" setup>
import { toRef, ref, onMounted, computed } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import PCBottom from '@/components/common/PCBottom.vue';
import { useWindowSize } from '@/useWindowSize';
import '../cart.css';
const { width, height } = useWindowSize()

const headerSpaceWidth = computed(() => Math.max(0, (width.value - 1200) / 2000));

const headerSpaceStyle = computed(() => ({
  padding: `calc(3vw * ${headerSpaceWidth.value})`
}));
function goToCheckout() {
  // 提取原始数据，不要直接使用响应式对象
  const cartData = {
    courses: courses.value.map(course => ({
      image: course.image,
      title: course.title,
      price: course.price
    })),
    total: totalPrice.value, // 获取计算属性的值
    userId: 'user123'
  };

  localStorage.setItem('tempCartData', JSON.stringify(cartData));
  window.location.href = '/checkout.html';
}

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

const CourseInstructorStyle = () => ({})

const CourseTitleStyle = () => ({})

const CourseIncartStyle = () => ({

})

</script>

<!-- html -->
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
            <td> <img :src="course.image" alt=""></td>
            <td>
              <div class="course-incart" :style="CourseIncartStyle()">
                <h2 :style="CourseTitleStyle()">{{ course.title }}</h2>
              </div>
            </td>
            <!-- 宽度<1200 -->
            <td v-if="width < 1200">
              <div class="course-price">${{ course.price }}</div>
              <div>
                <button class="cart-buttons">Remove</button>
              </div>
              <div>
                <button class="cart-buttons">Save for Later</button>
              </div>
            </td>
            <!-- 宽度>=1200 -->

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

      <!-- 右侧结算区域 -->
      <div class="checkout-section">
        <div class="checkout-summary">
          <div class="total-label">Total:</div>
          <div id="totalPrice"> ${{ totalPrice }}</div>
          <button @click="goToCheckout()">Proceed to checkout →</button>
        </div>
      </div>
    </div>
  </div>
  <PCBottom />



</template>

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
