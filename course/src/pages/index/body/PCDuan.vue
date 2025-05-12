<script lang="ts" setup>
import { RouterView, RouterLink} from 'vue-router';
import { toRef, ref, onMounted, defineComponent } from 'vue';
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import PCBottom from '@/components/common/PCBottom.vue';
import { NavigationButton } from '../components/widget/NavigateButton';
import { useWindowSize } from '@/useWindowSize';
const { width, height } = useWindowSize()
import {
  courseTitles, projectTitles, courseQuickViews,
  projectQuickViews, CommunityVoices

} from '../components/content.ts';

courseTitles.value[0].activeFlag = true

projectTitles.value[0].activeFlag = true
//navigator 
const navigaterBtnStyle = (activeFlag: boolean, hoverFlag: boolean) => ({
   backgroundColor: (activeFlag && hoverFlag) ? 'rgba(22,92,145,0.7)' :
    (hoverFlag? 'rgba(22,92,145,0.3)':(activeFlag? 'rgb(22,92,145)':'gainsboro')),
  color: activeFlag ? 'gainsboro' : 'rgb(22,92,145)'
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
height:flag?'50%':'35%'
});
function changeProjectTheme(i: NavigationButton) {
  projectTitles.value.forEach(element => {
    element.activeFlag = false;
  });
  i.activeFlag = true;
}

const projectImgStyle = (flag:boolean) => ({
  opacity: (flag) ? '0.5': '1'
});

const projectBtnStyle = (flag:boolean) => ({
  top : (flag) ? '-63%': '50%'
});

const voiceStyle = (index: number) => ({
  height : '3'+(index%4==0?'6':(index%4==1?'9':(index%4==2?'3':'0')))+'0px'
})

const voiceCommentStyle = (index: number) => ({
  height :'1'+(index%4==0?'6':(index%4==1?'9':(index%4==2?'3':'0')))+'0px'
})
 
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
<PCHeader />
<div>
    <div class="title">Software Engineering Courses</div>
   <div class="navigate">
  <button  v-for="(title,index) in courseTitles"  :key="index" @click="changeCourseTheme(title)" @mouseenter="title.mouseEnter()"
   @mouseleave="title.mouseLeave()" :style="navigaterBtnStyle(title.activeFlag,title.hoverFlag)">
  {{ title.text }}</button>
  </div>

  <div class="content">
   <div v-for="(courseQuickView,index) in courseQuickViews"  :key="index"  @click="toCourse()" class="course"
    @mouseenter="courseQuickView.mouseEnter()" @mouseleave="courseQuickView.mouseLeave()">
      <div class="icon-demo icon-course">
      <SvgIcon name="gravity-ui--logo-linux" size="48" color="#35495e" />
      </div>
      <div class="course-title">
       {{courseQuickView.title}}
      </div>
      <div class="course-introduction" :style="courseIntroductionStyle(courseQuickView.hoverFlag)">
      {{ courseQuickView.text }}
       </div>
     <img :src="courseQuickView.imgpath" alt="" :style="hoverCourseImgStyle(courseQuickView.hoverFlag)">
     
    </div>  
   <button class="exploreBtn">Explore More</button>
  </div>
 
<div class="title">Software Engineering Projects</div>
 <div class="navigate">
   <button  v-for="(title,index) in projectTitles"  :key="index" @click="changeProjectTheme(title)" @mouseenter="title.mouseEnter()"
   @mouseleave="title.mouseLeave()" :style="navigaterBtnStyle(title.activeFlag,title.hoverFlag)">
  {{ title.text }}</button>
  </div>

  <div class="content">
    <div v-for="(projectQuickView,index) in projectQuickViews" @click="toProject()" class="project"
     @mouseenter="projectQuickView.mouseEnter()"  @mouseleave="projectQuickView.mouseLeave()">
     <img :src="projectQuickView.imgpath" alt="" :style="projectImgStyle(projectQuickView.hoverFlag)">
      <div class="project-title">
       {{projectQuickView.title}}
      </div>
      <div class="project-introduction">
        {{ projectQuickView.text }}
      </div>
      <button :style="projectBtnStyle(projectQuickView.hoverFlag)" class="video">
        <svg width="40" height="24" viewBox="0 1 48 48" fill="#35495e">
          <use href="#icon-park-outline--video"/></svg>
        View</button>
    </div> 
    <button class="exploreBtn">Explore More</button>
  </div>

<div class="title">Voices across Commnities</div>
 <div class="voice-container">
  <div class="inContainer" >
   
   <div v-for="(communityVoice,index) in CommunityVoices" @click="toComment()" class="comment" :style="voiceStyle(index)">
    <div>
       <svg width="80" height="40" viewBox="0 -10 48 48" fill="#35495e">
          <use href="#raphael--quote"/></svg>
    </div>
    <div class="voice-comment" :style="voiceCommentStyle(index)">{{ communityVoice.comment }}</div>
    <img class="voice-img" :src="communityVoice.userPictrue" alt="">
    <div class="voice-link">View {{ communityVoice.course }} ></div>
  </div>
</div>

</div>
</div>
<PCBottom />
  <!-- <div class="demo-container">
    <Tooltip content="顶部提示" position="top">
      <template #trigger>
        <button>顶部悬浮</button>
      </template>
    </Tooltip>

    <Tooltip content="右侧提示" position="right">
      <template #trigger>
        <button>右侧悬浮</button>
      </template>
    </Tooltip>

    <Tooltip position="bottom">
      <template #trigger>
        <button>自定义内容</button>
      </template>
      <div style="color: #ffcc00;">
        <p>这是自定义HTML内容</p>
        <p>支持多行和样式</p>
      </div>
    </Tooltip>
  </div> -->
</main>
 
</template>

<!-- css -->
<style scoped>
.demo-container {
  display: flex;
  gap: 20px;
  padding: 40px;
}
.title{
  min-width: fit-content;
  font-size: 40px;
  text-align: center;
  min-width: 1000px;
  font-weight: 600;
  padding-top: 20px;
  font-family:'Times New Roman', Times, serif
}

.navigate {
  display: flex;
  max-width: 1400px; /* 但不超过最大值 */
  min-width: 1000px; /* 不小于最小值 */
  justify-items: center;
  justify-content:center;
  margin: 0 auto;
}

.navigate button,.project button {
  font-size: 16px;
  display: inline-block;
  margin: 0px 18px;
  padding: 0px 24px;
  height: 30px;
  min-width: fit-content;
  border-radius: 25px ;
  background-color: gainsboro;
  text-decoration: none;
  color: rgb(22,92,145);
  letter-spacing: 1px;
  border: 0;
  cursor: pointer;
  font-family: 微软雅黑;
  font-weight:bolder;
  transition: all 0.3s ease;
}

.navigate button:hover{
  background-color: rgba(128, 128, 128, 0.5);
  color: rgb(22,92,145);
  box-shadow: 0 4px 4px rgb(22,92,145,0.1);
}

.content {
  margin: 0 auto;
  border-radius: 10px;
  width: 80%;         
  max-width: 1400px; 
  min-width: 1000px; 
  padding:20px 0px;
  border: none;
  margin-bottom: 100px;
}


.container, .voice-container{
   margin: 0 auto;
  width: 100%;
  max-width: 1400px; 
  height: 500px;
  overflow: scroll;
  margin-bottom: 50px;
}

.inContainer{
  height: 450px;
}

.content .exploreBtn{
  margin: 5px 35%;
  width: 30%;
  font-size:20px ;
  background-color: rgb(22,92,145);
  color: white;
  border-radius: 30px;
  padding: 5px;
  border: none;
  font-weight: 400;
  transition: all 0.3s ease;
}

.content .exploreBtn:hover{
  background-color: gainsboro;
  color: rgb(22,92,145);
  box-shadow: 0 4px 4px rgb(22,92,145,0.3);
}

.course , .project , .comment{
  display: inline-block;
  margin: 10px 0.5%;
  width: 23%;
  border: rgba(22, 92, 145, 0.1) 2px solid;
  border-radius: 20px;
  overflow: hidden;
}

.course{
 height: 300px;
  padding: 10px;
}

.project{
  height: 280px;
  padding: 0px;
}

.comment{
  width: 300px;
  height: 360px;
  margin: 20px 10px;
}

.course:hover{
  background-color: rgba(22, 92, 145, 0.03);
}

.icon-demo{
  display: inline-block;
  color: white;
  background-color: rgb(22,92,145);
  border-radius: 25px;
}

.icon-course{
  width: 48px;
  height: 48px;
  padding: 7px 8px;
}

.course .course-title{
  height: 30px;
  font-size: 18px;
  font-weight: 500;
}

.course .course-introduction{ 
  color: gray;
  display: inline-block;
  padding: 5px;
  padding-left: 15px;
  overflow: hidden;
  font-size: 10px;
  font-weight: 300;
  transition: height 0.5s ease;
}

.course img,.project img{
  position: relative;
  box-shadow: 0 0 10px  rgba(22, 92, 145, 0.3);
  transition:all 0.5s ease;
}
.course img{
 margin: 0 5%;
  width: 90%;
  height: 40%;
}
.project img{
  margin: 0 auto;
  width: 100%;
   height: 50%;
}

.project button.video{
  color: white;
}


.project-introduction{
   color: gray;
  display: inline-block;
  width: 100%;
  padding: 5px;
  padding-left: 20px;
  overflow: hidden;
  font-size: 10px;
  font-weight: 300;
  height: 120px;
}

.project button{
  position: relative;
justify-content:center;
display: flex;
width: 80%;
min-width: fit-content;
margin: 0 auto;
padding: 4px 24px;
background-color: rgb(22,92,145);
color: white;
font-weight: 500;
border: none;
transition: all 0.5s ease;
}

.inContainer{
  display: inline-flex;
}

.voice-comment{
  margin: 15px;
 overflow: hidden; 
 color: rgba(22, 92, 145, 0.7);
}

.voice-img{
  height: 70px;
  margin-left: 10px;
}

.voice-link{
  padding-left: 20px;
  color: gray;
  font-size: 24px;
}
.voice-link:hover{
color: rgb(22,92,145);
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