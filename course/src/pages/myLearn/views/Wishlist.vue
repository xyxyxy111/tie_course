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

      <!-- 学习计划部分 -->
      <div class="learning-schedule">
         <h3>安排学习时间</h3>
         <p>学习需要日积月累。研究表明，养成良好学习习惯的学生更有可能实现目标。请留出时间学习并使用学习计划链接收提醒。</p>
         <button class="start-button">开始</button>
         <button class="cancel-button">取消</button>
      </div>

      <!-- 课程卡片 -->
      <div class="course-card">
         <h3>Git/GitHub/GitLab完全教程（包括Git底层原理）</h3>
         <p class="instructor">Peng Xiao</p>
         <button class="start-course-button">开始课程</button>
      </div>
   </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
   name: 'AllCourses',
});
</script>

<style scoped>
.learning-content {
   padding: 0 20px;
}

.learning-progress,
.learning-schedule,
.course-card {
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

.start-button,
.cancel-button,
.start-course-button {
   padding: 8px 16px;
   margin-right: 10px;
   border-radius: 4px;
   cursor: pointer;
}

.start-button,
.start-course-button {
   background-color: #1a73e8;
   color: white;
   border: none;
}

.start-button:hover,
.start-course-button:hover {
   background-color: #1765cc;
}

.cancel-button {
   background-color: transparent;
   border: 1px solid #dadce0;
   color: #3c4043;
}

.cancel-button:hover {
   background-color: #f1f3f4;
}

.instructor {
   color: #5f6368;
   margin: 10px 0;
}
</style>