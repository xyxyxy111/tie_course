<template>
  <div class="basic-information">
    <h1>个人信息</h1>
    <form>
      <!-- 名字 -->
      <div class="form-group">
        <label for="firstName">名字</label>
        <input type="text" id="firstName" name="firstName" v-model="form.firstName">
      </div>

      <!-- 姓氏 -->
      <div class="form-group">
        <label for="lastName">姓氏</label>
        <input type="text" id="lastName" name="lastName" v-model="form.lastName">
      </div>

      <!-- 头衔 -->
      <div class="form-group">
        <label for="title">头衔</label>
        <input type="text" id="title" name="title" v-model="form.title">
      </div>

      <!-- 个人简介 -->
      <div class="form-group">
        <label for="bio">个人简介</label>
        <textarea id="bio" name="bio" v-model="form.bio"></textarea>
      </div>


      <!-- 提交按钮 -->
      <div class="form-group">
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '保存信息' }}
        </button>
      </div>
    </form>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { profileApi, userApi } from '@/api/user'
export default defineComponent({
  name: 'BasicInformation',
  setup() {
    const isSubmitting = ref(false);
    const form = reactive({
      username:'123',
      firstName: 'tie',
      lastName: 'song',
      title: '软件工程师',
      bio: '博士，软件工程师，多年软件开发和项目架构经验，受聘于中南大学计算机学院，讲授《Web应用开发技术》、《Linux程序设计环境》和《软件开发架构》课程。',
    })
    // 获取个人信息
    const fetchProfile = async () => {
      try {
        const { data } = await profileApi.getProfile()
        Object.assign(form, data)
      } catch (error) {
        console.error('获取个人信息失败:', error)
      }
    }

    // 提交表单
    const submitForm = async () => {
      isSubmitting.value = true
      try {
        await profileApi.updateProfile(form)
        alert('个人信息保存成功!')
      } catch (error) {
        console.error('保存失败:', error)
        alert('保存失败，请重试')
      } finally {
        isSubmitting.value = false
      }
    }

    // 组件挂载时获取数据
    onMounted(() => {
      fetchProfile()
    })

    return {
      form,
      submitForm,
      isSubmitting
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
  margin: 5px;
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