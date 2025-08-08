<template>
  <div class="course-page">

    <div class="video-container">
      <div class="video-player">
        <div v-if="currentLesson" class="video-info">
          <h2>{{ currentLesson.name }}</h2>
          <p>时长: {{ currentLesson.duration }}</p>
        </div>
        <div v-else class="video-placeholder">
          <p>请从左侧选择课程</p>
        </div>
      </div>
    </div>

    <div class="course-sidebar">
      <div class="course-container">
        <h1 class="course-title">课程内容</h1>

        <div class="chapter" v-for="(chapter, index) in chapters" :key="index">
          <div class="chapter-header" @click="toggleChapter(index)">
            <h2 class="chapter-title">{{ chapter.title }}</h2>
            <span class="chapter-progress">{{ chapter.completed }}/{{ chapter.lessons.length }} | {{ chapter.duration
            }}</span>
            <span class="toggle-icon">{{ isChapterOpen(index) ? '−' : '+' }}</span>
          </div>

          <div class="lessons-container" v-show="isChapterOpen(index)">
            <div class="lesson" v-for="(lesson, lessonIndex) in chapter.lessons" :key="lessonIndex"
              @click="selectLesson(chapter, lesson)">
              <input type="checkbox" :id="`lesson-${index}-${lessonIndex}`" v-model="lesson.completed"
                class="lesson-checkbox" @click.stop>
              <label :for="`lesson-${index}-${lessonIndex}`" class="lesson-label">
                <span class="lesson-name">{{ lesson.name }}</span>
                <span class="lesson-duration">{{ lesson.duration }}</span>
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
          <span class="stars">★★★★☆</span>
          <span class="rating-value">4.5</span>
          <span class="reviews">(1,030 个评分)</span>
        </div>
        <div class="stats">
          <span class="students">7,551 名学生</span>
          <span class="duration">14.5小时</span>
        </div>
        <div class="update-info">
          <span>上次更新 2024年4月</span>
        </div>
        <div class="total-hour">
          视频:总共 {{ 14.5 }}小时
        </div>


      </div>
    </div>

    <!-- 课程描述 -->
    <div class="course-description">
      <h2>课程描述</h2>
      <div class="description-content">
        <p>Git是一个开源的分布式版本控制系统，可以有效、高速的处理从很小到非常大的项目版本管理。Git 是Linux之父 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。
        </p>

        <h3>本课程主要分为两大部分：</h3>
        <ol>
          <li>Git的基础知识，还有底层原理，包括本地和远程的Git操作，包括初始化代码仓库，提交，push，分支，merge等</li>
          <li>GitHub，GitLab的使用，通过详细的讲解两款产品的特性，达到熟悉和对比的效果，让每一个人都能从中选择一个适合自己的。</li>
        </ol>

        <h3>您将会学到什么</h3>
        <ul>
          <li>熟练掌握Git/Github/GitLab的使用</li>
          <li>多人协作下基于Git的开发流程</li>
          <li>Git的Best Practice</li>
          <li>Git的基本原理</li>
        </ul>

        <h3>有哪些课程要求或基本要求？</h3>
        <p>Basic computer knowledge基本的计算机知识</p>

        <h3>此课程面向哪些人：</h3>
        <ul>
          <li>想学习如何使用Git</li>
          <li>想学习如何使用GitHub</li>
          <li>想学习如何使用GitLab</li>
        </ul>
      </div>
    </div>
  </div>


</template>

<script lang="ts">
import { useWindowSize } from '@/useWindowSize'
import { ref, onMounted } from 'vue'
import PCHeader from '@/components/common/PCHeader.vue'
import { getCurrentUserId, getValidToken } from '@/utils/request'

export default {
  name: 'CoursePage',
  components: {
    PCHeader
  },
  setup() {
    const { width, height } = useWindowSize()

    // 获取userId - 从token中获取而不是URL
    const userId = ref<string | null>(null)

    onMounted(() => {
      // 从token获取userId
      const token = getValidToken()
      if (token) {
        userId.value = getCurrentUserId()
      }
      // 如果没有token，userId保持为null，用户仍然可以观看视频
    })

    return {
      userId
    }
  },
  data() {
    return {
      currentLesson: null
    }
  },
  methods: {
    toggleChapter(index: number) {
      const chapterIndex = this.openChapters.indexOf(index);
      if (chapterIndex > -1) {
        this.openChapters.splice(chapterIndex, 1);
      } else {
        this.openChapters.push(index);
      }
    },
    isChapterOpen(index: number) {
      return this.openChapters.includes(index);
    },
    selectLesson(chapter: any, lesson: any) {
      this.currentLesson = lesson;
      // 这里可以添加视频播放逻辑
      console.log('播放课程:', lesson.name);
    }
  },
  watch: {
    chapters: {
      deep: true,
      handler(newVal: any[]) {
        newVal.forEach((chapter: any) => {
          chapter.completed = chapter.lessons.filter((lesson: any) => lesson.completed).length;
        });
      }
    }
  }
}
</script>

<style scoped>
@import "@/assets/rem.css";

.course-page {
  display: flex;
  width: 2200px;
  height: 1080px;
  margin: 0 auto;
  overflow: hidden;
}

.course-sidebar {
  width: 280px;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #eaeaea;
  background: #fff;
}

.course-container {
  font-family: Arial, sans-serif;
  color: #333;
  padding: 15px;
}

.video-container {
  flex: 1;
  width: 1920px;
  height: 1080px;
  position: relative;
  background: #000;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.2em;
}

.chapter {
  border: 1px solid #eaeaea;
  border-radius: 4px;
  margin-bottom: 15px;
  overflow: hidden;
}

.chapter-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background-color: #f9f9f9;
  cursor: pointer;
  user-select: none;
}

.chapter-header:hover {
  background-color: #f0f0f0;
}

.chapter-title {
  flex-grow: 1;
  margin: 0;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-progress {
  margin: 0 10px;
  color: #666;
  font-size: 0.8em;
  white-space: nowrap;
}

.toggle-icon {
  width: 16px;
  text-align: center;
  font-weight: bold;
  font-size: 0.9em;
}

.lessons-container {
  padding: 8px;
}

.lesson {
  display: flex;
  align-items: center;
  padding: 6px 3px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.lesson:hover {
  background-color: #f8f8f8;
}

.lesson:last-child {
  border-bottom: none;
}

.lesson-checkbox {
  margin-right: 8px;
}

.lesson-label {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
}

.lesson-name {
  color: #333;
  font-size: 0.85em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.lesson-duration {
  color: #888;
  font-size: 0.8em;
  margin-left: 10px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .course-page {
    flex-direction: column;
  }

  .course-sidebar {
    width: 100%;
    height: auto;
    max-height: 40vh;
  }

  .video-container {
    height: 60vh;
  }
}

.course-info {
  margin: 0 auto;
  width: 2200px;
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
  text-align: left;
  font-size: 2.8rem;
  margin-bottom: 10px;
  color: #2c3e50;
}


.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stars {
  color: #f8d64e;
  font-size: 1.8rem;
}

.rating-value {
  font-weight: bold;
  font-size: 1.8rem;
}

.reviews {
  color: #666;
}

.stats {
  display: flex;
  gap: 15px;
}


.course-description {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .video-container {
    padding: 10px;
  }

  .video-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .video-stats {
    gap: 15px;
  }

  .video-item {
    flex-direction: column;
  }

  .video-thumbnail {
    width: 100%;
    height: 150px;
  }
}
</style>