<template>
  <IconSprite />
  <div class="header">
    <div :style="headerSpaceStyle"></div>
    <div id="logo" :style="headerButtonStyle" @click="goToIndex()">Course</div>
    <div :style="headerSpaceStyle"></div>
    <div class="explore">
      <button @mouseenter="exploreHoverFlag = true" @mouseleave="exploreHoverFlag = false"
        class="explore-button">Explore</button>
      <HoverPopup v-model="exploreHoverFlag" width="270px" height="340px" transition="slide" :show-delay="200"
        position="bottom" :hide-delay="300" class="custom-popup-bottom">
        <template #trigger>
          <div class="popup-trigger-area">
          </div>
        </template>
        <template #content>
          kkkkkkkkk
        </template>
      </HoverPopup>
    </div>

    <input v-model="searchQuery" type="text" placeholder="Find your course by skill,topic,or instructor"
      :style="headerSearchInputStyle" @keyup.enter="Search">
    <button style="margin-inline: 0;">
      <div class="icon" @click="Search">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--search" />
        </svg>
      </div>
    </button>

    <button v-if="userId" :style="headerButtonStyle" @click="goToLearning">
      我的学习
    </button>
    <button v-if="userId" @click="goToWishlist">

      <div class="icon">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#line-md--heart-filled" />
        </svg>
      </div>


    </button>

    <div :style="headerSpaceStyle" v-if="!userId"></div>
    <button @click="goToCart(userId)">
      <div class="icon">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#mdi--cart-outline" />
        </svg>
      </div>
    </button>
    <button v-if="userId">
      <div class="icon">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#mdi--bell-outline" />
        </svg>
      </div>
    </button>


    <button v-if="!userId" :style="headerButtonStyle" @click="goToLogin">Login</button>

    <div v-if="userId" :style="headerButtonStyle">
      <img src="/src/images/userPic.png" alt="" @click="goToMyInfo(userId)">
    </div>

    <button style="padding-inline:0% ;" v-if="!userId">
      <div class="icon">
        <svg width="50" height="50" viewBox="-1.3 -1 8 8" fill="#35495e">
          <use href="#mdi--web" />
        </svg>
      </div>
    </button>

  </div>

</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'
import { ref, computed } from 'vue'
import IconSprite from '../Icon/IconSprite.vue';
import HoverPopup from './HoverPopup.vue';
import './header.css'
import { searchQuery, Search, goToCart, goToIndex, goToMyInfo, goToLogin, goToLearning, goToCourse } from './header.ts';

const exploreHoverFlag = ref(false)
const { width, height } = useWindowSize()
const headerSpaceWidth = computed(() => Math.max(0, (width.value - 200) / 2800));
const headerSearchInputWidth = computed(() => Math.max(0, (width.value - 1200) / 300));
const headerButtonPadding = computed(() => {
  const calculatedValue = (width.value - 800) / 1700;
  return Math.min(3, Math.max(1, calculatedValue));
});
const headerSpaceStyle = computed(() => ({
  width: `calc(3vw * ${headerSpaceWidth.value})`,
  transition: 'none'
}));

const headerSearchInputStyle = computed(() => ({
  width: `clamp(30vw, calc(40vw + 10vw * ${headerSearchInputWidth.value}), 50vw)`,
  transition: 'none'
}));

const headerButtonStyle = computed(() => ({
  paddingInline: `calc(3vw * ${headerButtonPadding.value})`,
  transition: 'none'
}));

const goToWishlist = () => {
  window.location.href = "/learning.html#/learning/wishlist";
};

defineProps<{
  userId: string | null
}>()

</script>


<style>
.header {
  overflow: visible;
  margin-bottom: 30px;
  height: 80px;
  min-width: 1000px;
}

#logo {
  font-size: 32px;
  width: 100px;
}

input {
  position: relative;
  top: -3%;
  height: 50px;
  margin-left: 1%;
}

button {
  height: 50px;
  font-size: 16px;
  width: 4%;
  font-weight: 600;
}


button .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.explore {
  height: 50px;
  display: block;
  justify-items: center;
  width: 155px;
  line-height: 0px;
}

.explore-button {
  position: relative;
  top: 0%;
  display: block;
  width: 105px;
}

img {
  height: 50px;
  cursor: pointer;
}
</style>