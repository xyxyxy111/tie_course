<script lang="ts" setup>
import '../index.css';
import { toRef, ref, onMounted, defineComponent, computed } from 'vue';
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

const FontSize = computed(() => {
  const calculatedValue = (width.value - 200) / 50;
  return Math.min(16, Math.max(0, calculatedValue));
});

const titleStyle = () => ({
  fontSize: `calc(12px + 2px * ${FontSize.value})`,
  transition: 'none'
})


const navigaterBtnStyle = (activeFlag: boolean, hoverFlag: boolean) => ({
  backgroundColor: (activeFlag && hoverFlag) ? 'rgba(22,92,145,0.7)' :
    (hoverFlag ? 'rgba(22,92,145,0.3)' : (activeFlag ? 'rgb(22,92,145)' : 'gainsboro')),
  color: activeFlag ? 'gainsboro' : 'rgb(22,92,145)',
  fontSize: `calc(8px + 0.8px * ${FontSize.value})`,
  height: `calc(24px + 0.8px * ${FontSize.value})`,
  paddingInline: `calc(8px + 1.2px * ${FontSize.value})`,
  transition: 'background-color 0.3s'
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
  top: (flag) ? '-65%' : '20%'
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
    {{ FontSize }}+
    <MoblieHeader />
    <div>


      <div class="title" :style="titleStyle()">Software Engineering Courses</div>
      <div class="navigate .container-scroll-x">
        <button v-for="(title, index) in courseTitles" :key="index" @click="changeCourseTheme(title)"
          @mouseenter="title.mouseEnter()" @mouseleave="title.mouseLeave()"
          :style="navigaterBtnStyle(title.activeFlag, title.hoverFlag)">
          {{ title.text }}</button>
      </div>
      <div class="container container-scroll-x">
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
      <div class="navigate  container-scroll-x">
        <button v-for="(title, index) in projectTitles" :key="index" @click="changeProjectTheme(title)"
          @mouseenter="title.mouseEnter()" @mouseleave="title.mouseLeave()"
          :style="navigaterBtnStyle(title.activeFlag, title.hoverFlag)">
          {{ title.text }}</button>
      </div>
      <div class="container container-scroll-x">
        <div class="content">
          <div v-for="(projectQuickView, index) in projectQuickViews" @click="toProject()" class="project"
            @mouseenter="projectQuickView.mouseEnter()" @mouseleave="projectQuickView.mouseLeave()">
            <img :src="projectQuickView.imgpath" 
            alt="" 
            :style="projectImgStyle(projectQuickView.hoverFlag)">
            <div class="project-title">
              {{ projectQuickView.title }}
            </div>
            <div class="project-introduction container-scroll-y">
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
      <div class="voice-container container-scroll-x">
        <div class="inContainer">

          <div v-for="(communityVoice, index) in CommunityVoices" @click="toComment()" class="comment"
            :style="voiceStyle(index)">
            <div>
              <svg width="70" height="35" viewBox="0 -10 48 48" fill="#35495e">
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
  overflow: hidden;
  min-width: 400px;
  width: 100%;
}

.navigate {
  width: 100%;
  min-width: 400px;
  height: 50px;
  margin-top: 30px;
}

.navigate button,
.project button {
  margin: 0px 0.6rem;
  height: 32px;
}

.project button {
  margin: 8px auto;
}


.content {
  width: 2000px;
  height: 300px;
  display: inline-flex;
  overflow: scroll;
  grid-gap: 0.6rem;
  padding-inline: 1%;
}

.course,
.project,
.comment {
  height: 280px;
  padding: 10px;
  width: 240px;
  margin-left: 10px;
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

.project .project-introduction{
  height: 100px;
}

.inContainer {
  display: inline-flex;
  overflow: scroll;
}
</style>
