<template>
  <div class="header" :style="headerStyle">
    <button id="sideMenu" @click="showSidebar = true">
      <div class="icon">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="#35495e">
          <use href="#fluent--list-16-filled" />
        </svg>
      </div>
    </button>
    <div id="header-space"></div>

    <div id="logo" @click="goToIndex()"><img src="/src/images/iclass.png" alt=""></div>

    <button @click="searchFlag = !searchFlag">
      <div class="icon">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--search" />
        </svg>
      </div>
    </button>
    <button @click="goToCart()">
      <div class="icon">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="#35495e">
          <use href="#mdi--cart-outline" />
        </svg>

      </div>
    </button>
  </div>

  <div id="header-search" :style="headerSearchStyle()">

    <input v-model="searchQuery" type="text" placeholder="Find your course by skill,topic,or instructor"
      @keyup.enter="Search">
    <button>
      <div class="icon" @click="Search">
        <svg width="30" height="30" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--search" />
        </svg>
      </div>
    </button>


  </div>

  <!-- 侧边栏 -->
  <SideBar v-model:isOpen="showSidebar" position="left" :width="260" :userId="userId || undefined">
  </SideBar>
</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'
import './header.css'
import { searchQuery, Search, goToCart, goToIndex, goToLogin } from './header.ts';
import SideBar from '@/components/common/SideBar.vue'
import { ref, computed } from 'vue'

const showSidebar = ref(false)
const { width, height } = useWindowSize()

let searchFlag = ref(false)

const headerStyle = computed(() => ({
  padding: width.value < 300 ? '5px' : '10px',
  height: width.value < 240 ? '50px' : '40px'
}))

const headerSearchStyle = () => ({
  top: (searchFlag.value) ? '-27px' : '-77px'
})

defineProps<{
  userId?: string | null
}>()

</script>

<style scoped>
.header {
  min-width: 400px;
  font-size: 24px;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

#header-search {
  z-index: 50;
  display: flex;
  margin: 0 auto;
  width: 100%;
  height: 50px;
  padding: 15px 0px;
  align-items: center;
  background-color: white;
  position: relative;
  transition: all 0.5s ease;
}

#header-search input {
  height: 36px;
  width: 60%;
  margin-left: 10%;
}

#header-search button {
  background-color: transparent;
  padding: 0px 0px;
  border: none;
  border-radius: 20px;
}

#header-search button:hover {
  color: rgb(22, 92, 145);
  background-color: rgba(22, 92, 145, 0.1);
}

.icon {
  color: rgb(22, 92, 145);
  background-color: transparent;
  border-radius: 25px;
}

#logo {
  font-size: 20px;
}

button {
  height: 40px;
  font-weight: 500;
  width: 20%;
}

#logo,
#header-space {
  flex: 1;
  text-align: center;
}


/* 侧边栏菜单项样式 */
.menu-section {
  padding: 15px;
}

.menu-section h4 {
  margin-bottom: 10px;
  color: #333;
}

.menu-section ul {
  list-style: none;
  padding: 0;
}

.menu-section li {
  padding: 8px 0;
  cursor: pointer;
}

.menu-section li:hover {
  color: rgb(22, 92, 145);
}
</style>