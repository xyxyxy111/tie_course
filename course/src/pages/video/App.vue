<script lang="ts" setup name="App">
import { RouterView, RouterLink, useRouter } from 'vue-router';
import { toRef, ref, onMounted, computed } from 'vue';
import { defineComponent } from 'vue';
//molidis
// import PCDuan from '@/pages/video/body/PCDuan.vue';
// import MobileDuan from '@/pages/video/body/MobileDuan.vue';
import { useWindowSize } from '@/useWindowSize'
import IconSprite from '@/components/Icon/IconSprite.vue';
import { goToCart, goToIndex } from '@/components/common/header';
const { width, height } = useWindowSize()


</script>
<template>

  <IconSprite />
<!-- <PCDuan v-if="width>800"/>
<MobileDuan v-else /> -->
</template>

<!-- css -->
<style scoped>


</style>
