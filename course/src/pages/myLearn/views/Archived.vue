<template>
   <div class="mycourses-container">
      <div class="course-card" v-for="(course,index) in courses" :key="index">
        <img :src="course.coverimg" alt="">
        <h5>Git/GitHub/GitLab完全教程（包括Git底层原理）</h5>
        <div class="progress-bar">
          <div class="in-progressbar"></div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue';

export default defineComponent({
  name: 'Archived',
  setup(){ const courses = ref([
  {
    coverimg: '/src/images/git.png',
    title: 'Git/GitHub/GitLab完全教程（包括Git底层原理）',
    progress: 50
  }, {
    coverimg: '/src/images/git.png',
    title: 'Git/GitHub/GitLab完全教程（包括Git底层原理）',
    progress: 50
  }, {
    coverimg: '/src/images/git.png',
    title: 'Git/GitHub/GitLab完全教程（包括Git底层原理）',
    progress: 50
  }, {
    coverimg: '/src/images/git.png',
    title: 'Git/GitHub/GitLab完全教程（包括Git底层原理）',
    progress: 50
  }, {
    coverimg: '/src/images/git.png',
    title: 'Git/GitHub/GitLab完全教程（包括Git底层原理）',
    progress: 50
  }, {
    coverimg: '/src/images/git.png',
    title: 'Git/GitHub/GitLab完全教程（包括Git底层原理）',
    progress: 50
  }, {
    coverimg: '/src/images/git.png',
    title: 'Git/GitHub/GitLab完全教程（包括Git底层原理）',
    progress: 50
  }
  ]);
    return { courses };
}
});
</script>

<style scoped>
.mycourses-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;display: grid;
  grid-template-columns: repeat(4, minmax(24%, 280px));
}

.course-card{
  width: 240px;
 
  padding: 10px;
}

.course-card img{
  width: 100%;
  height: fit-content;
}
</style>