<template>
  <div class="learning-content">
    <div class="study-summary-card">
      <div class="summary-left">
        <div class="summary-title">开始每周坚持记录</div>
        <div class="summary-desc">完成了一个环！现在，请观看您的课程。</div>
        <div class="summary-week">
          <svg width="24" height="24" fill="#fbbf24" style="vertical-align: middle;">
            <use href="#flame-icon" />
          </svg>
          <span class="summary-week-num">3</span>
          <span class="summary-week-label">周</span>
          <span class="summary-week-desc">当前坚持记录</span>
        </div>
      </div>
      <div class="summary-right">
        <div class="summary-progress">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <!-- 灰色底环 -->
            <circle cx="30" cy="30" r="26" stroke="#e5e7eb" stroke-width="6" fill="none" />
            <!-- 黄色进度 -->
            <circle cx="30" cy="30" r="26" stroke="#fbbf24" stroke-width="6" fill="none" stroke-dasharray="163.36"
              stroke-dashoffset="54" />
            <!-- 绿色进度 -->
            <!-- 灰色底环 -->
            <circle cx="30" cy="30" r="20" stroke="#f6f8fc" stroke-width="6" fill="none" />

            <circle cx="30" cy="30" r="20" stroke="#22c55e" stroke-width="6" fill="none" stroke-dasharray="75.66"
              stroke-dashoffset="55" />
          </svg>
          <div class="summary-progress-text">
            <div><span class="yellow">18/30</span> 课程分钟数</div>
            <div><span class="green">4/5</span> 次访问</div>
            <div class="summary-date">2025年6月29日~2025年7月5日</div>
          </div>
        </div>
      </div>
    </div>
    <div class="study-plan-card-container">
      <div class="study-plan-card">
        <svg width="60" height="60" fill="#222" style="vertical-align: middle;">
          <use href="#lets-icons--clock" />
        </svg>
        <div class="plan-header">
          <div class="plan-title">安排学习时间</div>
          <div class="plan-desc">
            学习需要日积月累。研究表明，养成良好学习习惯的学生更有可能实现目标。请留出时间向学习计划提醒接收提醒。
          </div>
        </div>

      </div>
      <div class="plan-actions">
        <button class="plan-btn">开始</button>
        <button class="cancel-btn">取消</button>
      </div>
    </div>


    <div class="mycourses-container">
      <div class="course-card" v-for="(course, index) in mylist" :key="index" @mouseenter="hoverIndex = index"
        @mouseleave="hoverIndex = -1">
        <div class="img-wrapper" :class="{ 'hovered': hoverIndex === index }">
          <img :src="course.coverImgUrl" alt="" />
          <div v-if="hoverIndex === index" class="overlay">
            <svg width="50" height="50" viewBox="0 0 16 16" fill="#eee">
              <use href="#solar--play-broken" />
            </svg>
          </div>
        </div>
        <h5>{{ course.title }}</h5>
        <div class="iclass">
          iClass
        </div>
        <div class="progress-bar">
          <div class="in-progressbar" :style="{ width: (course.watchProgress * 100) + '%' }">
          </div>
        </div>
        <div class="watchProgress">
          完成 {{ course.watchProgress * 100 }} %
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { myListApi } from '@/api/user';
import type { MyListVO } from '@/api/user';
export default defineComponent({
  name: 'AllCourse',
  setup() {
    const mylist = ref<MyListVO[]>([]);
    const loading = ref(true);
    const hoverIndex = ref(0);
    const fetchMylist = async () => {
      try {
        loading.value = true;
        const response = await myListApi.getMyList();
        console.log('我的课程API响应:', response);
        if (response && response.data && Array.isArray(response.data)) {
          mylist.value = response.data as MyListVO[];
          mylist.value.forEach((course, index) => {
          });
        } else {
          mylist.value = [];
        }
      } catch (error) {
        console.error('获取我的课程失败:', error);
        mylist.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchMylist();
    });

    return { mylist, hoverIndex };
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
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.study-summary-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1.5px solid #f3f4f6;
  padding: 32px 36px 28px 36px;
  margin-bottom: 24px;
  min-height: 120px;
}

.summary-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
}

.summary-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
}

.summary-week {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.summary-week-num {
  font-size: 22px;
  font-weight: 700;
  color: #fbbf24;
  margin: 0 2px;
}

.summary-week-label {
  font-size: 15px;
  color: #222;
  font-weight: 600;
}

.summary-week-desc {
  font-size: 14px;
  color: #888;
  margin-left: 8px;
}

.summary-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.summary-progress {
  display: flex;
  align-items: center;
  gap: 18px;
}

.summary-progress-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 15px;
  color: #222;
}

.summary-progress-text .yellow {
  color: #fbbf24;
  font-weight: 700;
}

.summary-progress-text .green {
  color: #22c55e;
  font-weight: 700;
}

.summary-date {
  font-size: 13px;
  color: #888;
  margin-top: 2px;
}

.study-plan-card-container {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1.5px solid #f3f4f6;
  padding: 28px 36px 24px 36px;
  margin-bottom: 24px;
  min-height: 80px;
}

.study-plan-card {
  display: flex;
}

.plan-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 36px;
  margin-bottom: 8px;
}

.plan-title {
  font-size: 18px;
  font-weight: 700;
  color: #222;
}

.plan-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 18px;

}

.plan-actions {
  display: flex;
  gap: 16px;
  margin-left: 36px;
}

.plan-btn,
.cancel-btn {
  padding: 8px 40px;
  border-radius: 6px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #215486;
}

.plan-btn {
  background: #215486;
  color: #fff;
}

.plan-btn:hover {
  background: #fff;
  color: #215486;
}

.cancel-btn {
  background: #fff;
  color: #215486;
}

.cancel-btn:hover {
  background-color: rgba(33, 84, 150, 0.1);
}

.mycourses-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 24px 0;
}

.course-card {
  width: 260px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 18px 18px 16px 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.2s;
  position: relative;
}

.course-card:hover {
  transform: translateY(-3px);
  background-color: rgba(33, 84, 150, 0.02);
  box-shadow: 0 6px 24px rgba(33, 84, 150, 0.13);
}

.img-wrapper {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: #f5f5f5;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.img-wrapper .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  opacity: 1;
  transition: opacity 0.2s;
}

.img-wrapper:not(.hovered) .overlay {
  opacity: 0;
  pointer-events: none;
}

.course-card h5 {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-card .iclass {
  color: #888;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 7px;
  background: #e5e7eb;
  margin: 10px 0 0 0;
  overflow: hidden;
  position: relative;
}

.in-progressbar {
  height: 100%;
  background: #215486;
  transition: width 0.3s;
}

.course-card .watchProgress {
  font-weight: 700;
}

.play-btn {
  font-size: 48px;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>