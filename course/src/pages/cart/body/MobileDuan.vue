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
    <div class="title">Shopping Cart</div>
    <div class="content">
      <div class="course-list">
        <h1>{{ courses.length }} Courses in Cart</h1>
        <div v-for="course in courses" :key="course.id" class="course-item">
          <img :src="course.image" alt="">
          <div>
            <h3>{{ course.title }}</h3>
            <p>By {{ course.instructor }}</p>
          </div>
          <div>
            <button>Remove</button>
            <button>Save for Later</button>
          </div>
          <p>${{ course.price }}</p>
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
  <MobileBottom />
</template>

<style scoped>
/* 修改布局为上下排列 */
.content {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  border-radius: 10px;
  width: 100%;
  padding: 20px 0px;
  border: none;
  margin-bottom: 100px;
}

/* 移除原来的flex:2和flex:1设置 */
.course-list {
  width: 100%;
}

.checkout-section {
  width: 100%;
  margin-top: 40px;
  /* 增加与课程列表的间距 */
}

/* 保持其他样式不变 */
.title {
  min-width: fit-content;
  font-size: 36px;
  text-align: left;
  font-weight: 600;
  padding-top: 10px;
  padding-left: 10%;
  font-family: 'Times New Roman', Times, serif
}


.course-item img {
  width: 200px;
  height: 120px;
  margin-right: 20px;
}



.checkout-summary {
  border: none;
  padding: 15px;
}

.checkout-summary div {
  font-weight: 700;
  font-size: 16px;
  padding-inline: 10px;
}

.checkout-summary #totalPrice {
  font-size: 36px;
}

</style>