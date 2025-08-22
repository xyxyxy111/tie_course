<template>
  <!-- <Header /> -->
  <div>
    <div class="course-page">
      <div class="video-container">
        <VideoPlayer />
      </div>

      <div class="course-sidebar">
        <div class="course-container">
          <h1 class="course-title">课程内容</h1>

          <div v-for="(chapter, index) in chapters" :key="index">
            <div class="chapter-header" @click="toggleChapter(index)">
              <div class="chapter">
                <h2 class="chapter-title">{{ chapter.title }}</h2>
                <div class="chapter-progress">{{ chapter.completed }}/{{ chapter.lessons.length }}</div>
              </div>
              <span class="arrow" :class="{ open: openChapters.includes(index) }"></span>
            </div>

            <div class="lessons-container" v-show="isChapterOpen(index)" :class="{ open: isChapterOpen(index) }">
              <div class="lesson" v-for="(lesson, lessonIndex) in chapter.lessons" :key="lessonIndex"
                @click="selectLesson(chapter, lesson)">
                <input type="checkbox" :id="`lesson-${index}-${lessonIndex}`" v-model="lesson.completed"
                  class="lesson-checkbox" @click.stop>
                <label :for="`lesson-${index}-${lessonIndex}`" class="lesson-label">
                  <div class="lesson-title">{{ lesson.title }}</div>
                  <svg width="24" height="24" viewBox="0 -7 24 30" fill="#222">
                    <use href="#ph--video-fill" />
                  </svg>
                  <span class="lesson-duration">


                    {{ lesson.duration }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="course-info">
      <div class="course-header">
        <div class="course-title">
          <h1>不光教您怎么用，更重要的是教您为什么·平台最好的Git中文课</h1>
        </div>
        <div class="course-meta">
          <div class="rating">
            <span class="stars">4.5★</span>
            <span class="rating-value"></span>
            <span class="reviews">1,030 个评分</span>
          </div>
          <div class="column">
            <h3>7,551</h3>
            <h4>学生</h4>
          </div>
          <div class="column">
            <h3>14.5</h3>
            <h4>小时</h4>
          </div>


        </div>
        <div class="update-info">
          <span>上次更新 2024年4月</span>
        </div>
        <div class="total-hour">
          视频:总共 {{ 14.5 }}小时
        </div>


      </div>

      <div class="course-description">


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
        <div class="course-info-card">
          <h3 class="section-title">基本信息</h3>
          <div class="info-section">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">技能水平:</span>
                <span class="info-value">初级</span>
              </div>
              <div class="info-item">
                <span class="info-label">学生:</span>
                <span class="info-value">3796</span>
              </div>
              <div class="info-item">
                <span class="info-label">语言:</span>
                <span class="info-value">简体中文</span>
              </div>
              <div class="info-item">
                <span class="info-label">字幕:</span>
                <span class="info-value">否</span>
              </div>
            </div>

          </div>
          <div class="info-section">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">练习测试:</span>
                <span class="info-value">2</span>
              </div>
              <div class="info-item">
                <span class="info-label">问题:</span>
                <span class="info-value">2</span>
              </div>
              <div class="info-item">
                <span class="info-label">讲授:</span>
                <span class="info-value">114</span>
              </div>
              <div class="info-item">
                <span class="info-label">视频:</span>
                <span class="info-value">总共 45.5 小时</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

// import type { CourseVO, Chapter, Lesson } from '@/api/course';
// interface Props {
//   completed: boolean;
// }
// type ChapterType = Chapter & Props;
// type LessonType = Lesson & Props;

// // 获取userId - 从token中获取而不是URL
// const userId = ref<string | null>(null)

// // 当前选中的课程
// const currentLesson = ref<LessonType | null>(null)

// // 打开的章节索引数组
// const openChapters = ref<number[]>([])

// // 响应式数据
// const chapters = ref<ChapterType[]>([])

import { useWindowSize } from '@/useWindowSize'
import { ref, onMounted, computed } from 'vue'
import { getCurrentUserId, getValidToken } from '@/utils/request'
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css'
import Header from '../components/Header.vue';
import VideoPlayer from '../components/VideoPlayer.vue';
const { width, height } = useWindowSize()


interface Lesson {
  title: string;
  duration: number;
  completed: boolean;
}

interface Chapter {
  title: string;
  completed: number;
  lessons: Lesson[];
}


// 获取userId - 从token中获取而不是URL
const userId = ref<string | null>(null)

// 当前选中的课程
const currentLesson = ref<Lesson | null>(null)

// 打开的章节索引数组
const openChapters = ref<number[]>([])

// 响应式数据
const chapters = ref<Chapter[]>([
  {
    title: 'Chapter 0 - Python简介',
    completed: 0,
    lessons: [
      { title: '什么是Python?', duration: 10, completed: false },
      { title: '为什么学习Python?', duration: 15, completed: false },
      { title: '课程内容概述', duration: 8, completed: false },
      { title: '如何做笔记?', duration: 12, completed: false }
    ]
  },
  {
    title: 'Chapter 1 - Python数据类型',
    completed: 0,
    lessons: [
      { title: '数字类型', duration: 18, completed: false },
      { title: '字符串', duration: 22, completed: false },
      { title: '列表', duration: 25, completed: false },
      { title: '元组', duration: 15, completed: false },
      { title: '字典', duration: 20, completed: false }
    ]
  },
  {
    title: 'Chapter 2 - 控制流程',
    completed: 0,
    lessons: [
      { title: '条件语句', duration: 20, completed: false },
      { title: '循环语句', duration: 25, completed: false },
      { title: '函数定义', duration: 30, completed: false },
      { title: '异常处理', duration: 25, completed: false }
    ]
  },
  {
    title: 'Chapter 2 - 控制流程',
    completed: 0,
    lessons: [
      { title: '条件语句', duration: 20, completed: false },
      { title: '循环语句', duration: 25, completed: false },
      { title: '函数定义', duration: 30, completed: false },
      { title: '异常处理', duration: 25, completed: false }
    ]
  },
  {
    title: 'Chapter 2 - 控制流程',
    completed: 0,
    lessons: [
      { title: '条件语句', duration: 20, completed: false },
      { title: '循环语句', duration: 25, completed: false },
      { title: '函数定义', duration: 30, completed: false },
      { title: '异常处理', duration: 25, completed: false }
    ]
  },
  {
    title: 'Chapter 2 - 控制流程',
    completed: 0,
    lessons: [
      { title: '条件语句', duration: 20, completed: false },
      { title: '循环语句', duration: 25, completed: false },
      { title: '函数定义', duration: 30, completed: false },
      { title: '异常处理', duration: 25, completed: false }
    ]
  }
])

// 使用 computed 计算总进度
const totalProgress = computed(() => {
  let totalLessons = 0;
  let completedLessons = 0;

  chapters.value.forEach(chapter => {
    totalLessons += chapter.lessons.length;
    completedLessons += chapter.completed;
  });

  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
});

// 使用计算属性创建章节的完成状态（替代watch的方案）
const computedChapters = computed(() => {
  return chapters.value.map(chapter => {
    return {
      ...chapter,
      completed: chapter.lessons.filter(lesson => lesson.completed).length
    };
  });
});

// 切换章节展开/折叠状态
function toggleChapter(index: number) {
  const chapterIndex = openChapters.value.indexOf(index);
  if (chapterIndex > -1) {
    openChapters.value.splice(chapterIndex, 1);
  } else {
    openChapters.value.push(index);
  }
}

// 检查章节是否打开
function isChapterOpen(index: number) {
  return openChapters.value.includes(index);
}

// 选择课程
function selectLesson(chapter: Chapter, lesson: Lesson) {
  currentLesson.value = lesson;
  // 这里可以添加视频播放逻辑
  console.log('播放课程:', lesson.title);
}

// 组件挂载时执行
onMounted(() => {
  // 从token获取userId
  const token = getValidToken()
  if (token) {
    userId.value = getCurrentUserId()
  }
  // 如果没有token，userId保持为null，用户仍然可以观看视频

  // 初始化章节完成状态
  chapters.value = computedChapters.value;

  // 默认打开第一个章节
  if (chapters.value.length > 0) {
    openChapters.value.push(0);
  }
})

// 导出变量和函数供模板使用
export default {
  components: {
    Header,
    VideoPlayer
  },
  setup() {
    return {
      width,
      height,
      userId,
      currentLesson,
      openChapters,
      chapters: computedChapters,
      totalProgress,
      toggleChapter,
      isChapterOpen,
      selectLesson
    }
  }
}


</script>

<style scoped>
@import "@/assets/rem.css";

.course-page {
  display: flex;
  width: 1920px;
  height: 700px;
  margin: 0 auto;
  overflow: visible;
  background-color: #000;
}

.course-sidebar {
  width: 480px;
  overflow-y: auto;
  height: 100vw;
  background-color: #fff;

  z-index: 2000;
}

.course-container {
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #fff;
}

.video-container {
  flex: 1;
  width: 1920px;
  height: 1080px;
  position: relative;
  background: #000;
  max-width: 1200px;
  max-height: 700px;
  margin: 0 auto;
  padding: 20px;
  /* padding-top: calc(9 / 16 * 100%); */
}

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  width: 100%;
  background: var(--bg-dark);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.video-info {
  text-align: center;
  padding: 20px;
  max-width: 80%;
  background: var(--bg-primary);
  border-radius: 8px;
  margin-bottom: 20px;
}

.video-placeholder {
  text-align: center;
  font-size: 1.2em;
}

.course-title {
  text-align: left;
  margin: 8px 20px;
  color: #2c3e50;
  font-size: 1.1em;
  font-weight: bolder;
}

.chapter-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  box-shadow: 0 0 0 0.5px #aaa;
}

.chapter {
  display: flex;
  flex-direction: column;
}

.chapter-title,
.lesson-title {
  font-size: 1.4rem;
  font-weight: bolder;
  color: #111;
}

.lesson-duration,
.chapter-progress {
  font-size: 1.1rem;
  font-weight: normal;
  color: #888;
}

.lessons-container {
  max-height: 0;
  transition: all 0.3s ease;
}

.lessons-container.open {
  max-height: fit-content;
  transition: max-height 0.5s ease-in;
}

.lesson {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 0.5px #aaa;
}

.lesson:hover {
  background: #e8f4fc;
}

.lesson input {
  margin-right: 15px;
  transform: scale(1.3);
}

.lesson-label svg {
  padding-top: 5px;
}

.course-info {
  margin: 0 auto;
  padding: 0 480px 0 0;
  width: 1920px;
  z-index: 1;
}

.course-platform {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #333;
}

.course-header {
  text-align: left;
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.course-title h1 {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.3;
}

.course-meta {
  display: flex;
  flex-wrap: wrap;
  padding-left: 20px;
  margin-bottom: 10px;
  gap: 25px;
  align-items: center;
}

.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stars {
  color: #FFD700;
  font-size: 1.3rem;
  letter-spacing: 2px;
  font-weight: bolder;
}


.reviews {
  font-size: 0.95rem;
  opacity: 0.9;
}

.column {
  display: flex;
  flex-direction: column;
}

.column h3 {
  margin: 0 auto;
  font-weight: bolder;
}

.students,
.duration {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
}


.update-info::before {
  content: "⏱️";
  font-size: 1.1rem;
}

.update-info,
.total-hour {
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 15px;
  border-radius: 20px;
}


.total-hour::before {
  content: "🎬";
  font-size: 1.1rem;
}

.course-description h2 {
  margin-top: 0;
  color: #2c3e50;
}

.description-content {
  line-height: 1.6;
}

.description-content h3 {
  margin: 20px 0 10px 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.description-content ul,
.description-content ol {
  padding-left: 20px;
}

.description-content li {
  margin-bottom: 8px;
}

.video-title {
  font-size: 2.4rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.video-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--border-primary);
}

.video-stats {
  display: flex;
  gap: 20px;
  color: var(--text-muted);
}

.video-actions {
  display: flex;
  gap: 10px;
}

.btn-like,
.btn-share {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-like {
  background-color: var(--primary-color);
  color: var(--text-white);
}

.btn-like:hover {
  background-color: var(--secondary-color);
}

.btn-share {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-share:hover {
  background-color: var(--border-primary);
}

.video-list {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 20px;
}

.video-list h3 {
  margin-bottom: 15px;
  color: var(--text-primary);
}

.video-item {
  display: flex;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.video-item:hover {
  background-color: var(--bg-secondary);
}

.video-item:last-child {
  border-bottom: none;
}

.video-thumbnail {
  width: 120px;
  height: 67px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  flex-shrink: 0;
}

.video-item-info {
  flex: 1;
}

.video-item-title {
  font-weight: 500;
  margin-bottom: 5px;
  color: var(--text-primary);
}

.video-item-duration {
  color: var(--text-muted);
  font-size: 1.2rem;
}

.arrow {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  transition: transform 0.2s;
  position: relative;
}

.arrow::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-left: 2px solid #888;
  border-bottom: 2px solid #888;
  position: absolute;
  top: 3px;
  left: 3px;
  transform: rotate(-45deg);
  transition: transform 0.2s;
}

.arrow.open::before {
  transform: rotate(135deg);
  top: 5px;
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
  font-size: 1.8rem;
  font-weight: 700;
  color: #222;
}

.plan-desc {
  font-size: 1.5rem;
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
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #215496;
}

.plan-btn {
  background: #215496;
  color: #fff;
}

.plan-btn:hover {
  background: #fff;
  color: #215496;
}

.cancel-btn {
  background: #fff;
  color: #215496;
}

.cancel-btn:hover {
  background-color: rgba(33, 84, 150, 0.1);
}

.course-info-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.info-section {
  flex: 1;
  margin-bottom: 12px;
  margin-right: 260px;
}

.section-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: bolder;
  color: #2c3e50;
  margin-bottom: 16px;
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2);
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
</style>