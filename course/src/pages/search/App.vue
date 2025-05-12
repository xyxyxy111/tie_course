<script lang="ts" setup name="App">
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted } from 'vue';
import { defineComponent } from 'vue'
import PCduan from './body/PCDuan.vue';
import MobileDuan from './body/MobileDuan.vue';
import { useWindowSize } from '@/useWindowSize'

const { width, height } = useWindowSize()
</script>

<!-- html -->
<template>
  <main>

    <div v-if="width > 1000" class="app">
      <!-- PC -->
      <PCduan />
    </div>

    <div v-if="width <= 1000" class="app">
      <!-- phone -->
      <MobileDuan />
    </div>
  </main>

</template>

<!-- css -->
<style scoped>
.app {
  width: 100%;
  border: none;
  padding: 0 0;
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