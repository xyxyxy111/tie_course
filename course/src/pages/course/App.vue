<script lang="ts" setup name="App">
import { RouterView, RouterLink} from 'vue-router';
import { toRef,ref,onMounted } from 'vue';
import { defineComponent } from 'vue'
import PCduan from './body/PCDuan.vue';
import MobileDuan from './body/MobileDuan.vue';
import { useWindowSize } from '@/useWindowSize'

const { width, height } = useWindowSize()
</script>

<!-- html -->
<template>
<main>
 <PCduan/>
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
