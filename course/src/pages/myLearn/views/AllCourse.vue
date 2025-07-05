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
      <div class="course-card" v-for="(course, index) in mylist" :key="index" @mouseenter="hoverIndex = index"
        @mouseleave="hoverIndex = null">
        <div class="img-wrapper" :class="{ 'hovered': hoverIndex === index }">
          <img :src="course.coverImgUrl" alt="" />
          <div v-if="hoverIndex === index" class="overlay">
            <svg width="50" height="50" viewBox="0 0 16 16" fill="#eee">
              <use href="#solar--play-broken" />
            </svg>
          </div>
        </div>
        <h5>{{ course.title }}</h5>
        <div class="progress-bar">
          <div class="in-progressbar"></div>
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
    const hoverIndex = ref(null);
    const fetchMylist = async () => {
      try {
        loading.value = true;
        const response = await myListApi.getMyList();
        console.log('愿望单API响应:', response);

        // 根据API返回的数据更新Mylist
        if (response && response.data && Array.isArray(response.data)) {
          console.log('愿望单数据:', response.data);
          mylist.value = response.data as MyListVO[];

          // 检查每个课程的ID字段
          mylist.value.forEach((course, index) => {
            console.log(`课程 ${index} 完整数据:`, course);
            console.log(`课程 ${index} 所有属性:`, Object.keys(course));
          });
        } else {
          console.log('愿望单数据为空或格式不正确');
          mylist.value = [];
        }
      } catch (error) {
        console.error('获取愿望单失败:', error);
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


.mycourses-container {
  width: 1260px;
  display: grid;
  grid-template-columns: repeat(4, 320px);
}

.course-card {
  width: 300px;
  height: 308px;
  display: inline-block;
  margin: 0 20px 30px 0;
  vertical-align: top;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
}

.img-wrapper {
  position: relative;
  width: 100%;
  height: 176px;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
  background: #f5f5f5;
  transition: all 0.2s;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.img-wrapper .overlay {
  display: none;
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.img-wrapper.hovered .overlay {
  transition: all 0.3s;
  display: flex;
  color: #eee;
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