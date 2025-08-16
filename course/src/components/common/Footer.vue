<template>
  <div class="bottom">
    <div class="footer-left">
      <div id="logo">
        <img src="/src/images/iclass_dark.png" alt="">
      </div>
      <span id="copyright">
        <span class="copyright-symbol">©</span>
        <span class="copyright-text">2025 Iclass, Inc.</span>
      </span>
    </div>
    <div class="footer-center">
      Cookie 设置
    </div>
    <div class="footer-right">
      <svg width="40" height="40" viewBox="0 0 16 16" fill="#35495e" class="lang-icon">
        <use href="#mdi--web" />
      </svg>
      <span class="lang-text">中文(简体)</span>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'
import { ref, computed } from 'vue'
const { width, height } = useWindowSize()

</script>

<style scoped>
.bottom {
  width: 100vw;
  min-width: 1400px;
  height: 60px;
  background-color: #101010;
  color: white;
  z-index: 2000;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-sizing: border-box;
}

.bottom .footer-left #logo img {
  height: 30px;
}

.footer-left,
.footer-center,
.footer-right {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.footer-left #i {
  font-size: 4rem;
  color: #215496;
  font-family: 'HarmonyOS_Sans_Condensed-black';
  margin-right: 4px;
}

#copyright {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  color: #fff;
}

.copyright-symbol {
  font-size: 2rem;
  margin-right: 6px;
}

.footer-center {
  flex: 1;
  justify-content: center;
  color: #fff;
  font-size: 1.8rem;
}

.footer-right {
  color: #fff;
  font-size: 1.8rem;
  font-weight: bold;
}

.lang-icon {
  margin-top: 10px;
}

.lang-text {
  font-size: 1.6rem;
}
</style>