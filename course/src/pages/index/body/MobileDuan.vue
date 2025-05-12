<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, defineComponent} from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import { NavigationButton } from '../components/widget/NavigateButton';
import { useWindowSize } from '@/useWindowSize';
import MoblieHeader from '@/components/common/MoblieHeader.vue';
import MobileBottom from '@/components/common/MobileBottom.vue';
import {
  courseTitles, projectTitles, courseQuickViews,
  projectQuickViews, CommunityVoices
  
} from '../components/content.ts';


courseTitles.value[0].activeFlag = true

projectTitles.value[0].activeFlag = true
const { width, height } = useWindowSize()

const voiceStyle = (index: number) => ({
  height: '3' + (index % 4 == 0 ? '6' : (index % 4 == 1 ? '9' : (index % 4 == 2 ? '3' : '0'))) + '0px'
})

const voiceCommentStyle = (index: number) => ({
  height: '1' + (index % 4 == 0 ? '6' : (index % 4 == 1 ? '9' : (index % 4 == 2 ? '3' : '0'))) + '0px'
})

//title   font-size: 36px;  )
const titleStyle = () => ({
  fontSize:
    (width.value < 200) ? '12px' :
      (width.value < 260) ? '16px' :
        (width.value < 500) ? '20px' : '32px'
})


//navigator    height: 30px;
const navigaterBtnStyle = (activeFlag: boolean, hoverFlag: boolean) => ({
  backgroundColor: (activeFlag && hoverFlag) ? 'rgba(22,92,145,0.7)' :
    (hoverFlag ? 'rgba(22,92,145,0.3)' : (activeFlag ? 'rgb(22,92,145)' : 'gainsboro')),
  color: activeFlag ? 'gainsboro' : 'rgb(22,92,145)',
  fontSize:
    (width.value < 200) ? '6px' :
      (width.value < 260) ? '8px' :
        (width.value < 500) ? '12px' : '16px',
  height:
    (width.value < 200) ? '12px' :
      (width.value < 260) ? '18px' :
        (width.value < 500) ? '26px' : '30px',
  padding:
    (width.value < 200) ? '0 12px' :
      (width.value < 260) ? '0 16px' :
        (width.value < 500) ? '0 20px' :
          '0 24px'
});

//切换主题

function changeCourseTheme(i: NavigationButton) {
  courseTitles.value.forEach(element => {
    element.activeFlag = false;
  });
  i.activeFlag = true;
}
//course 样式
const hoverCourseImgStyle = (flag: boolean) => ({
  opacity: flag ? '0.5' : '1',
});

const courseIntroductionStyle = (flag: boolean) => ({
  height: flag ? '50%' : '35%'
});


function changeProjectTheme(i: NavigationButton) {
  projectTitles.value.forEach(element => {
    element.activeFlag = false;
  });
  i.activeFlag = true;
}

const projectImgStyle = (flag: boolean) => ({
  opacity: (flag) ? '0.5' : '1'
});

const projectBtnStyle = (flag: boolean) => ({
  top: (flag) ? '-100%' : '50%'
});


function toCourse() {
  console.log("WWW")
}

function toProject() {

}


function toComment() {

}

</script>

<!-- html -->
<template>
  <IconSprite />
  <main>
    <MoblieHeader />
    <!-- PC -->
    <div>


      <div class="title" :style="titleStyle()">Software Engineering Courses</div>
      <div class="navigate">
        <button v-for="(title, index) in courseTitles" :key="index" @click="changeCourseTheme(title)"
          @mouseenter="title.mouseEnter()" @mouseleave="title.mouseLeave()"
          :style="navigaterBtnStyle(title.activeFlag, title.hoverFlag)">
          {{ title.text }}</button>
      </div>
      <div class="container">
        <div class="content">
          <div v-for="(courseQuickView, index) in courseQuickViews" :key="index" @click="toCourse()" class="course"
            @mouseenter="courseQuickView.mouseEnter()" @mouseleave="courseQuickView.mouseLeave()">
            <div class="icon-demo icon-course">
              <SvgIcon name="gravity-ui--logo-linux" size="48" color="#35495e" />
            </div>
            <div class="course-title">
              {{ courseQuickView.title }}
            </div>
            <div class="course-introduction" :style="courseIntroductionStyle(courseQuickView.hoverFlag)">
              {{ courseQuickView.text }}
            </div>
            <img :src="courseQuickView.imgpath" alt="" :style="hoverCourseImgStyle(courseQuickView.hoverFlag)">

          </div>
        </div>
      </div>

      <div class="title" :style="titleStyle()">Software Engineering Projects</div>
      <div class="navigate">
        <button v-for="(title, index) in projectTitles" :key="index" @click="changeProjectTheme(title)"
          @mouseenter="title.mouseEnter()" @mouseleave="title.mouseLeave()"
          :style="navigaterBtnStyle(title.activeFlag, title.hoverFlag)">
          {{ title.text }}</button>
      </div>
      <div class="container">
        <div class="content">
          <div v-for="(projectQuickView, index) in projectQuickViews" @click="toProject()" class="project"
            @mouseenter="projectQuickView.mouseEnter()" @mouseleave="projectQuickView.mouseLeave()">
            <img :src="projectQuickView.imgpath" alt="" :style="projectImgStyle(projectQuickView.hoverFlag)">
            <div class="project-title">
              {{ projectQuickView.title }}
            </div>
            <div class="project-introduction">
              {{ projectQuickView.text }}
            </div>
            <button :style="projectBtnStyle(projectQuickView.hoverFlag)">
              <svg width="40" height="24" viewBox="0 1 48 48" fill="#35495e">
                <use href="#fluent--apps-list-detail-24-regular" />
              </svg>
              Detail</button>


            <button :style="projectBtnStyle(projectQuickView.hoverFlag)">
              <svg width="40" height="24" viewBox="0 1 48 48" fill="#35495e">
                <use href="#icon-park-outline--video" />
              </svg>
              View</button>
          </div>

        </div>
      </div>

      <div class="title" :style="titleStyle()">Voices across Commnities</div>
      <div class="voice-container">
        <div class="inContainer">

          <div v-for="(communityVoice, index) in CommunityVoices" @click="toComment()" class="comment"
            :style="voiceStyle(index)">
            <div>
              <svg width="80" height="40" viewBox="0 -10 48 48" fill="#35495e">
                <use href="#raphael--quote" />
              </svg>
            </div>
            <div class="voice-comment" :style="voiceCommentStyle(index)">{{ communityVoice.comment }}</div>
            <img class="voice-img" :src="communityVoice.userPictrue" alt="">
            <div class="voice-link">View {{ communityVoice.course }} ></div>
          </div>
        </div>

      </div>
    </div>

    <MobileBottom />
  </main>

</template>

<!-- css -->
<style scoped>
.title {
  min-width: fit-content;
  overflow: hidden;
  text-align: center;
  width: 100%;
  font-weight: 600;
  padding-top: 20px;
  font-family: 'Times New Roman', Times, serif
}

.navigate {
  display: flex;
  width: 100%;
  height: 50px;
  overflow: scroll;
  justify-items: center;
  margin-top: 30px;
}

.navigate button,
.project button {
  font-size: 16px;
  display: inline-block;
  margin: 0px 0.6rem;
  padding: 0px 24px;
  min-width: fit-content;
  border-radius: 25px;
  background-color: gainsboro;
  text-decoration: none;
  color: rgb(22, 92, 145);
  letter-spacing: 1px;
  border: 0;
  cursor: pointer;
  font-family: 微软雅黑;
  font-weight: bolder
}

.navigate button:hover {
  background-color: rgba(128, 128, 128, 0.5);
  color: rgb(22, 92, 145);
}

.container,
.voice-container {
  width: 100%;
  height: 300%;
  overflow: scroll;
  margin-bottom: 50px;
}

.content {
  margin: 0 auto;
  border-radius: 10px;
  width: 2000px;
  height: 300px;
  display: inline-flex;
  overflow: scroll;
  /* grid-auto-columns: calc((100% -(2)* 1.6rem) / 3);
  grid-template-columns: repeat(3, 1fr); */
  grid-gap: 0.6rem;
  border: none;
  padding-inline: 1%;
}

.course,
.project,
.comment {
  display: inline-block;
  height: 280px;
  padding: 10px;
  width: 240px;
  margin: 10px;
  margin-left: 0px;
  overflow: hidden;
  border: rgba(22, 92, 145, 0.1) 2px solid;
  border-radius: 20px;
}


.course:hover {
  background-color: rgba(22, 92, 145, 0.03);
}

.icon-demo {
  display: inline-block;
  color: white;
  background-color: rgb(22, 92, 145);
  border-radius: 25px;
}

.icon-course {
  width: 48px;
  height: 48px;
  padding: 7px 8px;
}

.course .course-title {
  height: 30px;
  font-size: 18px;
  font-weight: 500;
}

.course .course-introduction {
  color: gray;
  display: inline-block;
  padding: 5px;
  padding-left: 15px;
  overflow: hidden;
  font-size: 10px;
  font-weight: 300;
  transition: height 0.5s ease;
}

.course img {
  position: relative;
  margin: 0 5%;
  width: 90%;
  height: 40%;
  box-shadow: 0 0 10px rgba(22, 92, 145, 0.3);
  transition: opacity 0.5s ease, top 0.5s ease;
}

.project {
  padding: 0%;
  overflow: hidden;
}

.project img {
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 50%;
  box-shadow: 0 0 10px rgba(22, 92, 145, 0.3);
  transition: opacity 0.5s ease;
}

.project .project-title {
  height: 30px;
  font-size: 18px;
  padding-top: 5px;
  padding-left: 10px;
  font-weight: 500;
}

.project button {
  margin: 50px;
  position: relative;
  left: 10%;
  justify-content: center;
  display: inline-flex;
  width: 80%;
  min-width: fit-content;
  margin: 0 auto;
  padding: 4px 20px;
  background-color: rgb(22, 92, 145);
  color: white;
  font-weight: 500;
  border: none;
  transition: top 0.5s ease;
}

.inContainer {
  display: inline-flex;
  overflow: scroll;
}

.voice-comment {
  margin: 15px;
  overflow: hidden;
  color: rgba(22, 92, 145, 0.7);
}

.voice-img {
  height: 70px;
  margin-left: 10px;
}

.voice-link {
  padding-left: 20px;
  color: gray;
  font-size: 24px;
}

.voice-link:hover {
  color: rgb(22, 92, 145);
}
</style>

<!--
改变透明度
img {
 
}
坐标在1秒内逐渐增大
img {
  transform: translateX(0);
  transition: transform 1s ease;
}

img:hover {
  transform: translateX(100px); /* 向右移动100像素 */
}
-->