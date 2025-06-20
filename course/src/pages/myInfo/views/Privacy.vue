<template>
  <div class="privacy-container">
     <label><input type="checkbox" class="privacy-checkbox">向已登录用户显示您的个人资料</label><br>
  <label><input type="checkbox" class="privacy-checkbox">在您的个人资料页面上显示所修课程</label>
  </div>
 
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Privacy',
});
</script>

<style scoped>
.privacy-container{
  margin-left: 100px;
  width: fit-content;
}

.privacy-checkbox[type="checkbox"]{
  -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  
    width: 16px;
    height: 16px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    vertical-align: middle;
    cursor: pointer;
    margin: 10px;
}

.privacy-checkbox[type="checkbox"]:checked{
background-color: rgb(22,92,145);
position: relative;
}

.privacy-checkbox[type="checkbox"]:checked::before {
  content: "✓";
  color: white;
  position: absolute;
  left: 2px;
  top: -2px;
  font-size: 13px;
}
</style>
<!-- 
/* 清除原生样式 */
  -->