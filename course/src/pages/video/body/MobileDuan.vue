<template>
  <MobileHeader :userId="userId" />
  <div class="course-page">
    <!-- 左侧课程目录 -->
    <div class="course-sidebar">
      <div class="course-container">
        <h1 class="course-title">课程内容</h1>

        <div class="chapter" v-for="(chapter, index) in chapters" :key="index">
          <div class="chapter-header" @click="toggleChapter(chapter.chapterSortOrder)">
            <h2 class="chapter-title">{{ chapter.title }}</h2>
            <span class="chapter-progress">{{ chapter.lessonNum }}个讲座 | {{ chapter.lessonTotalMinute }}分钟</span>
            <span class="toggle-icon">{{ isChapterOpen(index) ? '−' : '+' }}</span>
          </div>

          <div class="lessons-container" v-show="isChapterOpen(index)">
            <div class="lesson" v-for="(lesson, lessonIndex) in chapter.lessons" :key="lessonIndex"
              @click="selectLesson(chapter, lesson)">
              <input type="checkbox" :id="`lesson-${index}-${lessonIndex}`" v-model="lesson.completed"
                class="lesson-checkbox" @click.stop>
              <label :for="`lesson-${index}-${lessonIndex}`" class="lesson-label">
                <span class="lesson-name">{{ lesson.title }}</span>
                <span class="lesson-duration">{{ lesson.duration || '5分钟' }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧视频播放器 -->
    <div class="video-container">
      <div class="video-player">
        <div v-if="currentLesson" class="video-info">
          <h2>{{ currentLesson.title }}</h2>
          <p>时长: {{ currentLesson.duration || '5分钟' }}</p>
        </div>
        <div v-else class="video-placeholder">
          <p>请从左侧选择课程</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useWindowSize } from '@/useWindowSize';
import MobileHeader from '@/components/common/MoblieHeader.vue';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { courseApi } from '@/api/course.ts';
import type { Chapter, Lesson } from '@/api/course.ts';

export default {
  name: 'MobileDuan',
  components: {
    MobileHeader
  },
  setup() {
    const { width, height } = useWindowSize();
    const userId = ref<string | null>(null);
    const courseId = ref<number | null>(null);
    const chapters = ref<Chapter[]>([]);
    const currentLesson = ref<Lesson | null>(null);
    const expandedChapters = ref<number[]>([]);

    onMounted(async () => {
      // 用户身份校验
      const token = getValidToken();
      if (token) {
        userId.value = getCurrentUserId();
      } else {
        window.location.href = '/login.html';
        return;
      }

      // 获取课程ID
      const searchParams = new URLSearchParams(window.location.search);
      courseId.value = parseInt(searchParams.get('courseId')!);
      if (!courseId.value) return;

      // 获取章节列表
      try {
        const chaptersResponse = await courseApi.getChapterListById(courseId.value);
        chapters.value = chaptersResponse.data;

        // 默认展开第一章
        if (chapters.value.length > 0) {
          await loadChapterLessons(courseId.value, chapters.value[0].chapterSortOrder);
          expandedChapters.value.push(chapters.value[0].chapterSortOrder);
        }
      } catch (error) {
        console.error('获取章节失败:', error);
      }
    });

    const loadChapterLessons = async (courseId: number, sortOrder: number) => {
      const chapter = chapters.value.find(ch => ch.chapterSortOrder === sortOrder);
      if (!chapter?.hasLoadedLessons) {
        try {
          const lessonsResponse = await courseApi.getLessonsByCourseIdAndSortOrder(courseId, sortOrder);
          if (chapter) {
            chapter.lessons = lessonsResponse.data;
            chapter.hasLoadedLessons = true;
          }
        } catch (error) {
          console.error('获取讲座失败:', error);
        }
      }
    };

    const toggleChapter = async (sortOrder: number) => {
      const idx = expandedChapters.value.indexOf(sortOrder);
      if (idx > -1) {
        expandedChapters.value.splice(idx, 1);
      } else {
        if (courseId.value) {
          await loadChapterLessons(courseId.value, sortOrder);
          expandedChapters.value.push(sortOrder);
        }
      }
    };

    const selectLesson = (chapter: Chapter, lesson: Lesson) => {
      currentLesson.value = lesson;
      // 这里可以添加视频播放逻辑
    };

    return {
      userId,
      chapters,
      currentLesson,
      expandedChapters,
      toggleChapter,
      selectLesson
    };
  },
  data() {
    return {
      // 保留原有的静态数据作为备用
      staticChapters: [
        {
          title: "第1节：Git Basic",
          completed: 0,
          lessons: [
            { name: "1. Git介绍", duration: "5分钟", completed: false },
            { name: "2. Git在Windows上的安装演示", duration: "9分钟", completed: false },
            { name: "3. 视频播放器设置", duration: "1分钟", completed: false },
            { name: "4. 关于Windows terminal的一点修正", duration: "0分钟", completed: false },
            { name: "5. Git在Mac上的安装演示", duration: "10分钟", completed: false },
            { name: "6. Mac用户可以选择zsh", duration: "0分钟", completed: false },
            { name: "7. 课程里常用的命令行总结", duration: "2分钟", completed: false }
          ],
          duration: "27分钟",
          isOpen: true
        }
        // ... 其他章节数据
      ]
    };
  },
  methods: {
    isChapterOpen(index: number) {
      const chapter = this.chapters[index];
      return chapter ? this.expandedChapters.includes(chapter.chapterSortOrder) : false;
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
  height: 100vh;
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
  height: 100%;
  position: relative;
  background: #000;
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
}

.video-info {
  text-align: center;
  padding: 20px;
  max-width: 80%;
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
</style>