<script lang="ts" setup>
import { RouterView, RouterLink} from 'vue-router';
import { toRef,ref,onMounted , defineComponent} from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import Filter from '../components/Filter.vue';
import MoblieHeader from '@/components/common/MoblieHeader.vue';
import MobileBottom from '@/components/common/MobileBottom.vue';
import '../search.css'


const showFilter = ref(false)


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

const searchQuery = ref('');

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  searchQuery.value = urlParams.get('q') || '';
});

</script>

<!-- html -->
<template>
  <IconSprite />
  <main>
    <MoblieHeader />

    <div class="title">“{{ searchQuery }}”的1000个结果
      <button @click="showFilter = true">Filter</button>
    </div>

    <div class="content">

      <div class="search-result">
        <div v-for="course in courses" :key="course.id" class="course-item">
          <div class="image-container">
            <img :src="course.image" alt="">
            <p class="price">${{ course.price }}</p>
          </div>
          <div class="course-details">
            <h3>{{ course.title }}</h3>
            <p>By {{ course.instructor }}</p>
            <button>Add to Cart</button>
          </div>
        </div>
      </div>

    </div>
    <Filter v-model:isOpen="showFilter" position="left" :width="260" title="Course">
    </Filter>
    <MobileBottom />
  </main>

</template>
<style scoped>
.title {
  min-width: 700px;
 }
 
.title button{
  margin: 0px 0px 10px 20px;
  padding-inline: 10px;
}

.content {
  width: 100%;
  max-width: 1000px;
}

.image-container {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.image-container img {
  width: 240px;
  height: 140px;
}

.price {
  font-weight: bold;
  margin-top: 8px;
  text-align: center;
}

.course-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

button {
  margin-top: 10px;
  padding: 10px;
  border: none;
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
  color: rgb(22, 92, 145);
  background-color: white;
  border-radius: 8px;
  align-self: flex-start;
}

button:hover {
  background-color: rgba(22, 92, 145, 0.1);
}

</style>
