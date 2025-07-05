<template>
  <div class="bottom">
    <div class="footer-left">
      <span id="i">i</span>
      <span id="class">Class</span>
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
  height: 60px;
  background-color: #101010;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  box-sizing: border-box;
}

.footer-left,
.footer-center,
.footer-right {
  display: flex;
  align-items: center;
}

.footer-left #i {
  font-size: 40px;
  color: rgb(22, 92, 145);
  font-family: 'HarmonyOS_Sans_Condensed-black';
  margin-right: 4px;
}

.footer-left #class {
  font-size: 36px;
  color: #f2f2f2;
  font-family: HarmonyOS_Sans_Condensed-black;
  margin-right: 24px;
}

#copyright {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #fff;
}

.copyright-symbol {
  font-size: 20px;
  margin-right: 6px;
}

.footer-center {
  flex: 1;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

.footer-right {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.lang-icon {
  margin-top: 10px;
}

.lang-text {
  font-size: 16px;
}
</style>