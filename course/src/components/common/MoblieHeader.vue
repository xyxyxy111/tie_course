<template>
  <!-- 移动端头部 -->
  <div id="mobile-header" :style="headerStyle">
    <button id="sideMenu" @click="showSidebar = true">
      <div class="icon">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="#35495e">
          <use href="#fluent--list-16-filled" />
        </svg>
      </div>
    </button>
    <div id="header-space"></div>
    <a href="/index.html">
      <div id="logo">Course</div>
    </a>
    <button @click="searchFlag= !searchFlag">
      <div class="icon">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--search" />
        </svg>
      </div>
    </button>
    <button>
      <div class="icon">
        <a href="/cart.html">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="#35495e">
            <use href="#mdi--cart-outline" />
          </svg>
        </a>
      </div>
    </button>
  </div>

  <div id="header-search" :style="headerSearchStyle()">

    <input v-model="searchQuery" type="text" placeholder="Find your course by skill,topic,or instructor"
       @keyup.enter="Search">
    <button style="margin: 0; padding-inline: 0;">
      <div class="icon" @click="Search">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--search" />
        </svg>
      </div>
    </button>


  </div>

  <!-- 侧边栏 -->
  <SideBar v-model:isOpen="showSidebar" position="left" :width="260" title="Course">
  </SideBar>
</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'
import SideBar from '@/components/common/SideBar.vue'
import { ref, computed } from 'vue'

const showSidebar = ref(false)
const { width, height } = useWindowSize()

let searchQuery = ref('')
let searchFlag=ref(false)

const headerStyle = computed(() => ({
  padding: width.value < 300 ? '5px' : '10px',
  height: width.value < 240 ? '50px' : '40px'
}))

const headerSearchStyle = () => ({
  top: (searchFlag.value) ? '0px' :'-45px'
})


function Search() {
  if (searchQuery.value.trim()) {
    console.log("搜索词:", searchQuery);
    window.location.href = `/search.html?q=${encodeURIComponent(searchQuery.value)}`;
  }
}

</script>

<style scoped>
#mobile-header {
  display: flex;
  margin: 0 auto;
  width: 100%;
  padding: 15px 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 24px;
  box-sizing: border-box;
  align-items: center;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

#header-search{
  z-index: 50;
  display: flex;
  margin: 0 auto;
  width: 100%;
  height: 50px;
  padding: 15px 0px;
  align-items: center;
  background-color: white;
  position: relative;
  top: 0px;
  transition: all 0.5s ease;
}

#header-search input{
    display: inline-block;
    height: 40px;
    width: 60%;
    border-radius: 25px;
    padding-left: 2%;
    text-align: left;
    margin-left: 10%;
    overflow: hidden;
    border: 1px solid;
}

#header-search input:hover,
#header-search input:focus
{
  border: 1.5px rgb(22, 92, 145) solid;
    background-color: aliceblue;
    color: black;
    outline: none;
}

.icon {
  color: rgb(22, 92, 145);
  background-color: transparent;
  border-radius: 25px;
}

#mobile-header #logo {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: rgb(22, 92, 145);
  cursor: pointer;
  font-family: 'Times New Roman', Times, serif;
  margin-inline: 2%;
}

button {
  position: relative;
  height: 40px;
  text-align: center;
  border: none;
  background-color: transparent;
  margin-inline: 1%;
  font-weight: 500;
  border-radius: 5px;
  cursor: pointer;
  min-width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center; 
  width: 20%;
}

#mobile-header #logo,
#mobile-header #header-space {
  flex: 1;
  text-align: center;
}

a {
  color: rgb(22, 92, 145);
}

button:hover {
  color: rgb(22, 92, 145);
  background-color: rgba(22, 92, 145, 0.1);
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