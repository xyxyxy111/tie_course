<script lang="ts" setup>
import '../course.css'
import { RouterView, RouterLink } from 'vue-router';
import { toRef, ref, onMounted, computed } from 'vue';
import { defineComponent } from 'vue'
import IconSprite from '@/components/Icon/IconSprite.vue'
import SvgIcon from '@/components/Icon/SvgIcon.vue'
import PCHeader from '@/components/common/PCHeader.vue'
import PCBottom from '@/components/common/PCBottom.vue';
import { useWindowSize } from '@/useWindowSize';
import CartPopup from '@/components/common/CartPopup.vue';
import FloatingBox from '../components/FloatingBox.vue';
import { goToCart } from '@/components/common/header.ts';
import { recommendedProducts, relatedTopics } from '../components/content';
import { useCourseDescription, useCart, otherThemes, courseCurriculums, Comments } from '../components/content';

const { width, height } = useWindowSize()
const { CourseDescriptionFlag, CourseDescription, CourseDescriptionStyle } = useCourseDescription();
const { showCart, cartTitle, addToCart, goToCheckout } = useCart();
</script>

<template>
  <!-- 保持原有template内容完全不变 -->
  <IconSprite />
  <!-- 原有所有HTML结构保持不变 -->
</template>

<style scoped>
/* 保持原有所有样式不变 */
#top-container {
  display: flex;
  background-color: rgb(4, 35, 58);
  color: rgb(200, 230, 255);
  width: 100%;
  padding: 20px 0px 20px 10px;
  font-size: 20px;
  height: 400px;
}

.content {
  margin: 0 auto;
  width: calc(30% + 680px);
  padding: 20px;
  padding-right: 340px;
}

/* 其他所有样式保持不变 */
</style>