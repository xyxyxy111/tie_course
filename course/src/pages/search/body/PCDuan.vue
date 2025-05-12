<script lang="ts" setup>
import { toRef,ref,onMounted ,watch, defineComponent} from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import PCBottom from '@/components/common/PCBottom.vue';
import '../search.css'


const searchQuery = ref('');

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  searchQuery.value = urlParams.get('q') || '';
});
// 主题数据
const themes = ["JavaScript", "React JS", "Angular", "Java", "CSS", "Android", "iOS"];
const selectedThemes = ref([]);

const levels = [
  { value: "all", label: "所有级别" },
  { value: "beginner", label: "初级" },
  { value: "intermediate", label: "中级" },
  { value: "expert", label: "专家" },
];
const selectedLevel = ref("all"); // 默认选中"所有级别"

const prices = [
  { value: "paid", label: "付费" },
  { value: "free", label: "免费" },
];
const selectedPrice = ref("free"); // 默认选中"免费"

const sortBy = ref('relevance')


const emit = defineEmits(['update:isOpen','filter-change'])



// 监听筛选条件变化
watch([sortBy,  selectedThemes], () => {
  emit('filter-change', {
    sortBy: sortBy.value,
    themes: selectedThemes.value // 加入主题筛选
  })
}, { deep: true })


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

</script>


<template>
  <IconSprite />

  <PCHeader />

  <div class="title">“{{ searchQuery }}”的1000个结果</div>

  <div class="content">

    <div class="sidebar-body">
      <div class="sidebar-header">
        <h3>筛选</h3>
      </div>

      <!-- 排序方式 -->
      <ul class="sidebar-content">
        <li class="sidebar-title">排序方式</li>
        <li><button :class="{ active: sortBy === 'relevance' }" @click="sortBy = 'relevance'">相关度最高</button></li>
        <li><button :class="{ active: sortBy === 'newest' }" @click="sortBy = 'newest'">最新</button></li>
        <li><button :class="{ active: sortBy === 'highest-rated' }" @click="sortBy = 'highest-rated'">评分最高</button>
        </li>
      </ul>


      <ul class="sidebar-content">
        <li class="sidebar-title">语言</li>
        <li><button>中文</button></li>
        <li><button>English</button></li>
      </ul>

      <ul class="sidebar-content">
        <li class="sidebar-title">主题</li>
        <li v-for="(theme, index) in themes" :key="index">
          <label>
            <input type="checkbox" v-model="selectedThemes" :value="theme">
            {{ theme }}
          </label>
        </li>
      </ul>


      <ul class="sidebar-content">
        <li class="sidebar-title">级别</li>
        <li v-for="level in levels" :key="level.value">
          <label>
            <input type="radio" v-model="selectedLevel" :value="level.value"> {{ level.label }}
          </label>
        </li>
      </ul>

      <ul class="sidebar-content">
        <li class="sidebar-title">价格</li>
        <li v-for="price in prices" :key="price.value">
          <label>
            <input type="radio" v-model="selectedPrice" :value="price.value"> {{ price.label }}
          </label>
        </li>
      </ul>

    </div>

    <div class="search-result">

      <div v-for="course in courses" :key="course.id" class="course-item">
        <img :src="course.image" alt="">
        <div>
          <h3>{{ course.title }}</h3>
          <p>By {{ course.instructor }}</p>
        </div>


        <p class="price">${{ course.price }}
          <button>Add to Cart</button>
        </p>
      </div>
    </div>
  </div>


  <PCBottom />



</template>

<style scoped>
.title {
  min-width: 1000px;
}

.content {
  width: 80%;
  max-width: 1400px;
  min-width: 900px;
}

.sidebar-body {
  flex: 1;
}

.sidebar-body {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 15px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.sidebar-header h3 {
  margin: 0;
}

.sidebar-content {
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.sidebar-title {
  font-weight: 700;
  padding: 15px 0 5px;
  color: #35495e;
}

.sidebar-body button {
  width: 100%;
  padding: 10px 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: #35495e;
  transition: background-color 0.2s;
}

.sidebar-body button:hover {
  background-color: rgba(22, 92, 145, 0.1);
}

.sidebar-body button.active {
  color: rgb(22, 92, 145);
  font-weight: bold;
}

.search-result {
  flex: 6;
}

.course-item img {
  width: 240px;
  height: 140px;
  margin-right: 20px;
}

.course-item button {
  margin-top: 80px;
  padding: 10px;
  border: none;
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
  color: rgb(22, 92, 145);
  background-color: white;
  border-radius: 8px;
}

.course-item button:hover {
  background-color: rgba(22, 92, 145, 0.1);
}

.course-item p{
  text-align: left;
}

</style>
