<template>
  <div class="learning-content">
    <!-- 学习进度部分 -->
    <div class="learning-progress">
      <h3>开始每周坚持记录</h3>
      <p>完成了一个环！现在，请观看您的课程。</p>

      <div class="progress-stats">
        <div class="stat-item">
          <strong>0</strong> 周<br>
          <span>当前坚持记录</span>
        </div>
        <div class="stat-item">
          <strong>0/30</strong> 课程分钟数<br>
          <span>4/1 次访问</span><br>
          <span>6月1日 - 6月14日</span>
        </div>
      </div>
    </div>

    <div class="mycourses-container">
      <div class="course-card" v-for="(course, index) in courses" :key="index">
        <img :src="course.coverimg" alt="">
        <h5>Git/GitHub/GitLab完全教程（包括Git底层原理）</h5>
        <div class="progress-bar">
          <div class="in-progressbar"></div>
        </div>
      </div>
    </div>

    <PCHeader :userId="userId" />

  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import PCHeader from '@/components/common/PCHeader.vue';

const progressBarStyle = computed(() => ({

}))

export default defineComponent({
  name: 'AllCourses',
  components: {
    PCHeader
  },
  setup() {
    const courses = ref([
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

    // 获取userId
    const userId = ref<string | null>(null);

    onMounted(() => {
      // 从URL参数获取userId
      const searchParams = new URLSearchParams(window.location.search);
      const urlUserId = searchParams.get('userId');
      if (urlUserId) {
        userId.value = decodeURIComponent(urlUserId);
      }
    });

    return { courses, userId };
  }

});
</script>

<style scoped>
.learning-content {
  padding: 0 20px;
}

.learning-progress,
.learning-schedule,
.mycourses-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

h3 {
  margin-top: 0;
  color: #202124;
}

.progress-stats {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}

.stat-item {
  line-height: 1.6;
}

.stat-item strong {
  font-size: 1.2em;
  color: #1a73e8;
}

button {
  position: relative;
  left: 80%;
  width: fit-content;
  background-color: rgb(22, 92, 145);
  color: white;
  border: none;
  margin: 5px 20px;
  padding: 2px 15px;
  border-radius: 4px;
  cursor: pointer;
  height: 30px;
  font-size: 12px;
  transition: all 0.3s;
  border: 1px rgb(22, 92, 145) solid;
}

button:hover {
  background-color: rgba(22, 92, 145, 0.8);
}

.start-btn {
  background-color: white;
  color: rgb(22, 92, 145);
  border: 1px rgb(22, 92, 145) solid;
}

.start-btn:hover {
  background-color: rgba(22, 92, 145, 0.08);
}

.mycourses-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(24%, 280px));
}

.course-card {
  width: 240px;

  padding: 10px;
}

.course-card img {
  width: 100%;
  height: fit-content;
}
</style>