<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, computed } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import PCBottom from '@/components/common/PCBottom.vue';
import { useWindowSize } from '@/useWindowSize';
import '../cart.css';
import Tooltip from '@/components/common/Tooltip.vue';
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

<!-- html -->
<template>
  <IconSprite />

  <PCHeader />
  <div>
    <div class="title">Shopping Cart</div>
    <div class="content">
      <div class="course-list">
        <h1>{{ courses.length }} Courses in Cart</h1>

        <div v-for="course in courses" :key="course.id" class="course-item">
          <img :src="course.image" alt="">
          <div>
            <h2>{{ course.title }}</h2>
            <p>By {{ course.instructor }}</p>
          </div>
          <div> <button>Remove</button>
            <button>Save for Later</button>
          </div>

          <p>${{ course.price }}</p>
        </div>
        
      </div>

      <!-- 右侧结算区域 -->
      <div class="checkout-section">
        <div class="checkout-summary">
          <div>Total:</div>
          <div id="totalPrice"> ${{ totalPrice }}</div>
          <button @click="checkout">Proceed to checkout →</button>
        </div>
      </div>
    </div>
  </div>
  <PCBottom />



</template>

<!-- css -->
<style scoped>

.title {
  min-width: fit-content;
  font-size: 40px;
  text-align: left;
  min-width: 1000px;
  font-weight: 600;
  padding-top: 20px;
  padding-left: 10%;
  font-family: 'Times New Roman', Times, serif
}

.content {
  display: flex;
  margin: 0 auto;
  border-radius: 10px;
  width: 80%;
  max-width: 1400px;
  min-width: 1000px;
  padding: 20px 0px;
  border: none;
  margin-bottom: 100px;
}

.course-list {
  flex: 2;
}


.course-item img {
  width: 240px;
  height: 140px;
  margin-right: 20px;
}


.checkout-section {
  flex: 1;
}

.checkout-summary {
  border: none;
  padding: 15px;
  margin-bottom: 20px;
}

.checkout-summary div {
  font-weight: 700;
  font-size: 20px;
  padding-inline: 10px;
}

.checkout-summary #totalPrice {
  font-size: 40px;
}

.icon-demo {
  display: inline-block;
  color: white;
  background-color: rgb(22, 92, 145);
  border-radius: 25px;
}

.icon-course {
  width: 48px;
  height: 48px;
  padding: 7px 8px;
}
</style>
