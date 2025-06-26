<script lang="ts" setup name="App">
import { ref, onMounted, computed } from 'vue';
import PCDuan from './body/PCDuan.vue';
import MobileDuan from './body/MobileDuan.vue';
import { useWindowSize } from '@/useWindowSize'
import IconSprite from '@/components/Icon/IconSprite.vue';
import { goToCart, goToIndex } from '@/components/common/header';
const { width, height } = useWindowSize()

const userId = ref<string | null>(null)

</script>
<template>

  <IconSprite />
  <div>
    <!-- PC -->
    <PCDuan v-if="width > 800" class="app" />
    <MobileDuan v-else class="app" />
  </div>

</template>


<style scoped></style>
