<template>
  <div class="basic-information">
    <h1>个人信息</h1>
    <form>
      <!-- 名字 -->
      <div class="form-group">
        <label for="firstName">名字</label>
        <input type="text" id="firstName" name="firstName" value="Tie">
      </div>

      <!-- 姓氏 -->
      <div class="form-group">
        <label for="lastName">姓氏</label>
        <input type="text" id="lastName" name="lastName" value="Song">
      </div>

      <!-- 头衔 -->
      <div class="form-group">
        <label for="title">头衔</label>
        <input type="text" id="title" name="title" value="软件工程师">
      </div>

      <!-- 个人简介 -->
      <div class="form-group">
        <label for="bio">个人简介</label>
        <textarea id="bio"
          name="bio">博士，软件工程师，多年软件开发和项目架构经验，受聘于中南大学计算机学院，讲授《Web应用开发技术》、《Linux程序设计环境》和《软件开发架构》课程。</textarea>
      </div>

      <!-- 语言 -->
      <div class="form-group">
        <label for="languages">使用语言</label>
        <select id="languages" name="languages" multiple>
          <option value="中文" selected>中文</option>
          <option value="英语">英语</option>
        </select>
        <p>按住Ctrl键可以多选</p>
      </div>

      <!-- 提交按钮 -->
      <div class="form-group">
        <button type="submit">保存信息</button>
      </div>
    </form>
    <!-- <h2>个人信息</h2>
    <form :model="form" labwidth="120px" ref="formRef">
      名字 
      <form-item label="名字" prop="firstName" :rules="[{ required: true, message: '请输入名字', trigger: 'blur' }]">
        <input v-model="form.firstName" placeholder="请输入您的名字"></input>
      </form-item>

       姓氏 
      <form-item label="姓氏" prop="lastName" :rules="[{ required: true, message: '请输入姓氏', trigger: 'blur' }]">
        <input v-model="form.lastName" placeholder="请输入您的姓氏"></input>
      </form-item>

       头衔 
      <form-item label="头衔" prop="title">
        <input v-model="form.title" placeholder="例如: 高级工程师、产品经理等"></input>
      </form-item>

      个人简介 
      <form-item label="个人简介" prop="bio">
        <input type="textarea" v-model="form.bio" :rows="6" placeholder="简要介绍一下你自己..." maxlength="500"
          show-word-limit></input>
      </form-item>

       语言 
      <form-item label="使用语言" prop="languages">
        <select v-model="form.languages" multiple filterable allow-create default-first-option
          placeholder="请选择或输入您使用的语言" style="width: 100%">
          <option v-for="lang in allLanguages" :key="lang" :label="lang" :value="lang"></option>
        </select>
      </form-item>

      操作按钮
      <form-item>
        <button type="primary" @click="submitForm">保存更改</button>
       
      </form-item>
    </form> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  name: 'BasicInformation',
  setup() {

    const form = reactive({
      firstName: 'tie',
      lastName: 'song',
      title: '软件工程师',
      bio: '博士，软件工程师，多年软件开发和项目架构经验，受聘于中南大学计算机学院，讲授《Web应用开发技术》、《Linux程序设计环境》和《软件开发架构》课程。',
      languages: ['中文']
    })

    // 所有语言选项
    const allLanguages = [
      '中文',
      '英语'
    ]

    // 提交表单
    const submitForm = () => {
     
    }


    return {
      form,
      allLanguages,
      submitForm
    }
  }
})
</script>

<style scoped>
.basic-information {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
h1 {
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  height: 100px;
  resize: vertical;
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