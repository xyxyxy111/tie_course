<template>
<!--   
  <div id="desktop-bottom">
  <div :style="bottomSpaceStyle()"></div>
  
    <span id="logo" :style="bottomButtonStyle()">Course</span>
  
  <div class="bottom-link">
    <div class="bottom-heading">Community</div>
    <div class="bottom-content">Events</div>
    <div class="bottom-content">Fellows</div>
  </div>
  <div class="bottom-link">
    <div class="bottom-heading">Company</div>
    <div class="bottom-content">Feedback</div>
    <div class="bottom-content">Media inquiries</div>
    <div class="bottom-content">Contact us</div>
  </div>
  <div class="bottom-link">
    <div class="bottom-heading">Resources</div>
    <div class="bottom-content">Privacy policy</div>
    <div class="bottom-content">Terms of service</div>
  </div>
  
 
  </div>
 -->

</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'

const { width, height } = useWindowSize()


const bottomSpacewidth = (width.value - 1200) / 2000
const bottomButtonPadding = (width.value - 800) / 1700
const bottomSpaceStyle = () => ({
  width: `calc( 8vw * ${bottomSpacewidth})`
});

const bottomButtonStyle = () => ({
  paddingInline: (bottomButtonPadding > 1) ? `calc( 2vw * ${bottomButtonPadding})` : '2vw'
});

</script>


<style>

#desktop-bottom{
  position: relative;
  display: flex;
  overflow: hidden;
  margin: 0 auto;
  width: 100%;
  min-width: 1000px;
  font-size: 16px;
  box-sizing: border-box;
}

#logo{
  margin:15px 20px  ;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
  color: rgb(22,92,145);
  cursor: pointer;
  font-family: 'Times New Roman', Times, serif;
  margin-inline: 1%;
}

#desktop-bottom div{
   left: 32%;
  position: relative;
  height: 100%;
  width: 16%;
  text-align: center;
  border: none;
  color: rgb(22,92,145);
 cursor: pointer;
 min-width: fit-content;
}

#desktop-bottom .bottom-link{
  height: 200px;
  display:grid;
  grid-template-rows: repeat(4,1fr);
}

#desktop-bottom .bottom-heading{
  font-size: 22px;
  font-weight: 500;
}



button .icon {
  /* 确保图标容器不会影响布局 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

</style>