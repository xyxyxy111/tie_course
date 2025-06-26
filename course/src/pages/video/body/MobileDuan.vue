<template>
  <div class="course-page">
    <!-- 左侧课程目录 -->
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

    <!-- 右侧视频播放器 -->
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
  </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'

export default {
  name: 'MobileDuan',
  data() {
    return {
      currentLesson: null as any,
      chapters: [
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
        },
        {
          title: "第2节：Git Local Deep Dive 基本原理详解",
          completed: 0,
          lessons: [
            { name: "1. Git仓库初始化", duration: "8分钟", completed: false },
            { name: "2. 工作区与暂存区", duration: "10分钟", completed: false },
            { name: "3. 提交历史查看", duration: "7分钟", completed: false },
            { name: "4. 版本回退", duration: "12分钟", completed: false },
            { name: "5. 撤销修改", duration: "9分钟", completed: false },
            { name: "6. 删除文件", duration: "5分钟", completed: false },
            { name: "7. 忽略文件配置", duration: "6分钟", completed: false },
            { name: "8. 差异比较", duration: "7分钟", completed: false },
            { name: "9. 修改最后一次提交", duration: "4分钟", completed: false },
            { name: "10. 重命名文件", duration: "3分钟", completed: false },
            { name: "11. 储藏更改", duration: "8分钟", completed: false },
            { name: "12. 标签管理", duration: "6分钟", completed: false },
            { name: "13. 别名配置", duration: "4分钟", completed: false },
            { name: "14. 日志美化", duration: "5分钟", completed: false },
            { name: "15. 二分查找", duration: "7分钟", completed: false },
            { name: "16. 子模块", duration: "10分钟", completed: false },
            { name: "17. 大型项目优化", duration: "9分钟", completed: false },
            { name: "18. 实战演练", duration: "10分钟", completed: false }
          ],
          duration: "2小时4分钟",
          isOpen: false
        },
        {
          title: "第3节：Branch分支和HEAD",
          completed: 0,
          lessons: [
            { name: "1. 分支概念", duration: "6分钟", completed: false },
            { name: "2. 创建分支", duration: "5分钟", completed: false },
            { name: "3. 切换分支", duration: "4分钟", completed: false },
            { name: "4. 合并分支", duration: "8分钟", completed: false },
            { name: "5. 删除分支", duration: "3分钟", completed: false },
            { name: "6. HEAD指针", duration: "7分钟", completed: false },
            { name: "7. 分离HEAD状态", duration: "10分钟", completed: false },
            { name: "8. 实战演练", duration: "12分钟", completed: false }
          ],
          duration: "55分钟",
          isOpen: false
        },
        {
          title: "第4节：分支合并Branch Merge",
          completed: 0,
          lessons: [
            { name: "1. 快进合并", duration: "8分钟", completed: false },
            { name: "2. 三方合并", duration: "10分钟", completed: false },
            { name: "3. 解决冲突", duration: "12分钟", completed: false },
            { name: "4. 合并策略", duration: "7分钟", completed: false },
            { name: "5. 合并日志", duration: "5分钟", completed: false },
            { name: "6. 中止合并", duration: "3分钟", completed: false },
            { name: "7. 合并最佳实践", duration: "10分钟", completed: false },
            { name: "8. 实战演练", duration: "10分钟", completed: false }
          ],
          duration: "1小时5分钟",
          isOpen: false
        },
        {
          title: "第5节：Git Remote远程仓库",
          completed: 0,
          lessons: [
            { name: "1. 远程仓库概念", duration: "5分钟", completed: false },
            { name: "2. 添加远程仓库", duration: "4分钟", completed: false },
            { name: "3. 查看远程仓库", duration: "3分钟", completed: false },
            { name: "4. 推送分支", duration: "8分钟", completed: false },
            { name: "5. 拉取更新", duration: "7分钟", completed: false },
            { name: "6. 远程分支", duration: "8分钟", completed: false },
            { name: "7. 实战演练", duration: "6分钟", completed: false }
          ],
          duration: "41分钟",
          isOpen: false
        },
        {
          title: "第6节：本地仓库和远程仓库的交互",
          completed: 0,
          lessons: [
            { name: "1. 克隆仓库", duration: "6分钟", completed: false },
            { name: "2. 获取更新", duration: "7分钟", completed: false },
            { name: "3. 拉取与合并", duration: "9分钟", completed: false },
            { name: "4. 推送冲突解决", duration: "10分钟", completed: false },
            { name: "5. 跟踪分支", duration: "8分钟", completed: false },
            { name: "6. 删除远程分支", duration: "4分钟", completed: false },
            { name: "7. 远程标签", duration: "6分钟", completed: false },
            { name: "8. 多人协作流程", duration: "12分钟", completed: false },
            { name: "9. 远程仓库重命名", duration: "3分钟", completed: false },
            { name: "10. 远程仓库删除", duration: "2分钟", completed: false },
            { name: "11. 多远程仓库管理", duration: "8分钟", completed: false },
            { name: "12. 实战演练", duration: "15分钟", completed: false }
          ],
          duration: "2小时22分钟",
          isOpen: false
        },
        {
          title: "第7节：Pull Request",
          completed: 0,
          lessons: [
            { name: "1. PR概念", duration: "5分钟", completed: false },
            { name: "2. 创建PR", duration: "8分钟", completed: false },
            { name: "3. 评审PR", duration: "7分钟", completed: false },
            { name: "4. 解决冲突", duration: "6分钟", completed: false },
            { name: "5. 合并PR", duration: "5分钟", completed: false },
            { name: "6. 实战演练", duration: "4分钟", completed: false }
          ],
          duration: "35分钟",
          isOpen: false
        },
        {
          title: "第8节：Git SSH KEY",
          completed: 0,
          lessons: [
            { name: "1. SSH原理", duration: "7分钟", completed: false },
            { name: "2. 生成SSH Key", duration: "6分钟", completed: false },
            { name: "3. 添加公钥到Git平台", duration: "5分钟", completed: false },
            { name: "4. 测试连接", duration: "3分钟", completed: false },
            { name: "5. 实战演练", duration: "4分钟", completed: false }
          ],
          duration: "25分钟",
          isOpen: false
        },
        {
          title: "第9节：Git标签Tag",
          completed: 0,
          lessons: [
            { name: "1. 标签概念", duration: "5分钟", completed: false },
            { name: "2. 创建标签", duration: "6分钟", completed: false },
            { name: "3. 查看标签", duration: "4分钟", completed: false },
            { name: "4. 删除标签", duration: "3分钟", completed: false },
            { name: "5. 检出标签", duration: "8分钟", completed: false },
            { name: "6. 实战演练", duration: "13分钟", completed: false }
          ],
          duration: "39分钟",
          isOpen: false
        },
        {
          title: "第10节：Git Hooks",
          completed: 0,
          lessons: [
            { name: "1. Hooks概念", duration: "6分钟", completed: false },
            { name: "2. 常用Hooks", duration: "8分钟", completed: false },
            { name: "3. 自定义Hook", duration: "10分钟", completed: false },
            { name: "4. 团队共享Hooks", duration: "7分钟", completed: false },
            { name: "5. 实战演练", duration: "6分钟", completed: false }
          ],
          duration: "37分钟",
          isOpen: false
        },
        {
          title: "第11节：GitLab基础",
          completed: 0,
          lessons: [
            { name: "1. GitLab介绍", duration: "5分钟", completed: false },
            { name: "2. 创建项目", duration: "6分钟", completed: false },
            { name: "3. 用户权限", duration: "8分钟", completed: false },
            { name: "4. Issue跟踪", duration: "7分钟", completed: false },
            { name: "5. CI/CD基础", duration: "10分钟", completed: false },
            { name: "6. Wiki文档", duration: "5分钟", completed: false },
            { name: "7. 代码审查", duration: "12分钟", completed: false },
            { name: "8. 实战演练", duration: "8分钟", completed: false }
          ],
          duration: "1小时1分钟",
          isOpen: false
        }
      ],
      openChapters: [0] // 默认展开第一章
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