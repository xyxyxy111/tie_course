<template>
  <div id="desktop-header" >

    <div :style="headerSpaceStyle()"></div>
    <a href="/index.html">
      <div id="logo" :style="headerButtonStyle()">Course</div>
    </a>
    <input v-model="searchQuery" type="text" placeholder="Find your course by skill,topic,or instructor"
      :style="headerSearchInputStyle()" @keyup.enter="Search">
    <button style="margin: 0; padding-inline: 0;">
      <div class="icon" @click="Search">
        <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
          <use href="#material-symbols--search" />
        </svg>
      </div>
    </button>
    <button :style="headerButtonStyle()">Business</button>
    <button :style="headerButtonStyle()">Teach on Here</button>
    <button @click="Search()">
        <a href="/cart.html">
      <div class="icon">
      
          <svg width="36" height="36" viewBox="0 0 16 16" fill="#35495e">
            <use href="#mdi--cart-outline" />
          </svg>
      
      </div>  </a>
    </button>

   <button :style="headerButtonStyle()"> <a href="/login.html">Login</a></button>
    <button :style="headerButtonStyle()"><a href="/signup.html">Sign up</a></button>
    <button style="padding-inline:0% ;">
      <div class="icon">
        <svg width="50" height="50" viewBox="-1.3 -1 8 8" fill="#35495e">
          <use href="#mdi--web" />
        </svg>
      </div>
    </button>

  </div>


</template>

<script setup lang="ts">
import { useWindowSize } from '@/useWindowSize'
import { ref } from 'vue'

let searchQuery = ref('')

const { width, height } = useWindowSize()

const headerStyle = () => ({
  fontSize: width.value > 2200 ? '4%' :
        width.value > 2000 ? '2%' :
          width.value >1600?'1%':'0%'
})

const headerSpaceStyle = () => ({
  width: width.value > 4500 ? '8%' :
    width.value > 3000 ? '6%' :
      width.value > 2200 ? '4%' :
        width.value > 2000 ? '2%' :
          width.value >1600?'1%':'0%'
});

const headerSearchInputStyle = () => ({
  width: width.value > 900 ? '40%' : '30%'
});



const headerButtonStyle = () => ({
  padding: width.value > 960 ? '2%' : '0.5%'

});

function Search() {
  if (searchQuery.value.trim()) {
    console.log("搜索词:", searchQuery);
    window.location.href = `/search.html?q=${encodeURIComponent(searchQuery.value)}`;
  }
}

</script>


<style>
#desktop-header {
  display: flex;
  overflow: hidden;
  margin: 0 auto;
  margin-bottom: 30px;
  height: 80px;
  width: 100%;
  min-width: 1000px;
  padding: 15px 0px 15px 20px;
  box-shadow: 0 2px 8px gray;
  font-size: 28px;
  box-sizing: border-box;
  align-items: center;
}

#logo {
  align-items: center;
  font-size: 32px;
  font-weight: 700;
  color: rgb(22, 92, 145);
  cursor: pointer;
  font-family: 'Times New Roman', Times, serif;
  margin-inline: 1%;
}

#desktop-header input {
  position: relative;
  top: -3%;
  display: inline-block;
  height: 50px;
  border-radius: 25px;
  padding-left: 1%;
  text-align: left;
  margin-left: 1%;
  overflow: hidden;
  border: 1px solid;
}

#desktop-header input:hover,
#desktop-header input:focus {
  border: 1.5px rgb(22, 92, 145) solid;
  background-color: aliceblue;
  color: black;
  outline: none;
}


#desktop-header button,a {
  display: flex;
  position: relative;
  height: 100%;
  width: 4%;
  min-width:fit-content;
  white-space: nowrap;
  text-align: center;
  border: none;
  color: black;
  background-color: rgba(22, 92, 145, 0);
  margin-left: 1.5%;
  font-weight: 500;
  border-radius: 5px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
}


#desktop-header button:hover {
  color: rgb(22, 92, 145);
  background-color: rgba(22, 92, 145, 0.1);

}

#desktop-header a:hover {
  color: rgb(22, 92, 145);

}

button .icon {
  /* 确保图标容器不会影响布局 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>