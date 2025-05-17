<template>

  <div id="desktop2-bottom">
    <hr>
    <div :style="headerSpaceStyle()"></div>

    <span id="logo" :style="headerButtonStyle()">Course</span>
    <hr>
    <div class="bottom-link">
      <div class="bottom-heading">Community</div>
      <div class="bottom-content">Events</div>
      <div class="bottom-content">Fellows</div>
    </div>
    <hr>
    <div class="bottom-link">
      <div class="bottom-heading">Company</div>
      <div class="bottom-content">Feedback</div>
      <div class="bottom-content">Media inquiries</div>
      <div class="bottom-content">Contact us</div>
    </div>
    <hr>
    <div class="bottom-link">
      <div class="bottom-heading">Resources</div>
      <div class="bottom-content">Privacy policy</div>
      <div class="bottom-content">Terms of service</div>
    </div>
    <hr>

  </div>


</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'

const { width, height } = useWindowSize()
const headerSpaceStyle = () => ({
  width: width.value > 4500 ? '8%' :
  width.value>3000?'6%':
    width.value > 2200 ? '4%' :
    width.value>2000?'2%':'0%'
});

const headerButtonStyle = () => ({
  padding:width.value>960?'2%':'1%'
});

</script>


<style>

#desktop2-bottom{
  display: grid;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  min-width: 400px;
  width: 100%;
  font-size: 20px;
  margin-top: 10px;
  box-sizing: border-box;
}

#desktop2-bottom div{
  position: relative;
  left: 1%;
 margin: 5px;
  height: 100%;
  width: 16%;
  text-align: center;
  border: none;
  color: rgb(22,92,145);
 cursor: pointer;
 min-width: fit-content;
}

#desktop2-bottom .bottom-link{
 height: fit-content;
  display:grid;
}

#desktop2-bottom .bottom-heading{
  font-size: 28px;
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

hr{
  border: none;      /* 移除默认边框 */
  border-top: 1px solid rgb(22,92,145);
}

</style>