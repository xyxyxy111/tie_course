<template>

  <div class="photo-container">
    <h1>图像预览</h1>
    <h3>最低 200x200 像素，最高 6000x6000 像素 </h3>



    <img src="/src/images/userPic.png" alt="">

    <input type="file" id="avatarUpload" class="upload-btn" accept="image/*" >
   
    <button type="submit" class="submit-btn" id="submitBtn" disabled>保存头像</button>

  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Photo',
});
</script>

<style scoped>
.photo-container{
  display: block;
  max-width: 800px;
    margin: 0 auto;
    padding: 30px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

img{
  width: 100%;
  height: fit-content;
  display: block;
}

button {
  position: relative;
  left: 80%;
  width: fit-content;
  background-color: rgb(22, 92, 145);
  color: white;
  border: none;
  margin: 5px 20px;
  padding: 2px 15px;
  border-radius: 4px;
  cursor: pointer;
  height: 30px;
  font-size: 12px;
  transition: all 0.3s;
  border: 1px rgb(22, 92, 145) solid;
}

button:hover {
  background-color: rgba(22, 92, 145, 0.8);
}
</style>