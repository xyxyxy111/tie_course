<script lang="ts" setup name="App">
import { RouterView, RouterLink, useRouter } from 'vue-router';
import { toRef, ref, onMounted, computed } from 'vue';
import { defineComponent } from 'vue';
import PCDuan from '@/pages/order/body/PCDuan.vue';
import MobileDuan from '@/pages/order/body/MobileDuan.vue';
import { useWindowSize } from '@/useWindowSize'
import IconSprite from '@/components/Icon/IconSprite.vue';

import { goToCart, goToIndex } from '@/components/common/header';
const { width, height } = useWindowSize()

const headerSpaceWidth = computed(() => Math.max(0, (width.value - 1200) / 2000));
const headerSpaceStyle = computed(() => ({
  width: `calc(4vw * ${headerSpaceWidth.value})`,
  transition: 'none'
}));
</script>
<template>

  <IconSprite />

  <div class="order-header">

    <div id="logo" @click="goToIndex()">
      <img src="/src/images/iclass.png" alt="">
    </div>
    <div :style="headerSpaceStyle"></div>
    <button class="close-order-btn" @click="goToCart">
      <div class="icon">
        <svg width="28" height="28" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--close" />
        </svg>
      </div>
    </button>
  </div>

  <div class="app">
    <PCDuan v-if="width > 800" />
    <MobileDuan v-else />
  </div>

</template>

<!-- css -->order-
<style scoped>
.order-header {
  overflow: hidden;
  margin-bottom: 30px;
  height: 80px;
  min-width: 800px;
  display: flex;
  margin: 0 auto;
  width: 100%;
  padding: 15px 0px;
  box-shadow: 0 2px 8px gray;
  box-sizing: border-box;
  align-items: center;
}

#logo {
  font-size: 2.8rem;
  font-weight: 700;
  color: #215496;
  cursor: pointer;
  font-family: 'Times New Roman', Times, serif;
  margin-inline: 20px;
  align-items: center;
}

#logo img {
  height: 50px;
  width: fit-content;
}

.icon {
  color: #215496;
  background-color: transparent;
  border-radius: 25px;
}

.close-order-btn {
  border: none;
  margin-left: auto;
  background-color: white;
  padding-top: 8px;
  margin-right: 20px;
  border-radius: 8px;
}

.close-order-btn:hover {
  background-color: rgb(22, 92, 145, 0.1);
}
</style>
