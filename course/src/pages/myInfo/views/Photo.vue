<template>
  <div class="photo-container">
    <h1>图像预览</h1>
    <h3>最低 200x200 像素，最高 6000x6000 像素 </h3>
    <img :src="form.avatarUrl" alt="头像预览" v-if="form.avatarUrl">

    <input type="file" id="avatarUpload" class="upload-btn" accept="image/*" @change="handleFileSelect" ref="fileInput">

    <button @click="submitForm" class="submit-btn" id="submitBtn" :disabled="isSubmitting || !selectedFile">
      {{ isSubmitting ? '保存中...' : '保存头像' }}
    </button>

  </div>
</template>

<script lang="ts">
import { profileApi } from '@/api/user';
import { defineComponent, onMounted, reactive, ref } from 'vue';

export default defineComponent({
  name: 'Photo',
  setup() {
    const isSubmitting = ref(false);
    const selectedFile = ref<File | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);

    const form = reactive({
      username: '',
      firstName: '',
      lastName: '',
      major: '',
      avatarUrl: '',
      allowEmailNotify: false,
      allowSMSNotify: false
    })

    const fetchProfile = async () => {
      try {
        const { data } = await profileApi.getProfile()
        Object.assign(form, data)
        console.log(form)
      } catch (error) {
        console.error('获取失败:', error)
      }
    }

    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          alert('请选择图片文件');
          return;
        }

        // 验证文件大小 (限制为 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('文件大小不能超过 5MB');
          return;
        }

        selectedFile.value = file;

        // 预览图片（仅用于预览，不保存到form中）
        const reader = new FileReader();
        reader.onload = (e) => {
          // 创建一个临时的预览URL，不保存到form.avatarUrl
          const previewUrl = e.target?.result as string;
          // 更新预览图片
          const imgElement = document.querySelector('img');
          if (imgElement) {
            imgElement.src = previewUrl;
          }
        };
        reader.readAsDataURL(file);
      }
    }

    const submitForm = async () => {
      if (!selectedFile.value) {
        alert('请先选择图片文件');
        return;
      }

      isSubmitting.value = true;
      try {
        // 创建FormData对象来上传文件
        const formData = new FormData();
        formData.append('avatar', selectedFile.value);

        // 调用上传头像的API
        const uploadResponse = await profileApi.uploadAvatar(formData);

        // 使用返回的avatarUrl
        form.avatarUrl = uploadResponse.data.avatarUrl;

        // 更新用户资料
        await profileApi.updateProfile(form);
        alert('保存头像成功!');
        selectedFile.value = null;
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      } catch (error) {
        console.error('保存失败:', error);
        alert('保存失败，请重试');
      } finally {
        isSubmitting.value = false;
      }
    }

    // 组件挂载时获取数据
    onMounted(() => {
      fetchProfile();
    });

    return {
      form,
      submitForm,
      isSubmitting,
      selectedFile,
      handleFileSelect,
      fileInput
    }
  }
})
</script>

<style scoped>
.photo-container {
  display: block;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin: 20px 0;
  border: 2px solid #eee;
}

.upload-btn {
  display: block;
  margin: 20px 0;
  padding: 10px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
}

.upload-btn:hover {
  border-color: rgb(22, 92, 145);
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

button:hover:not(:disabled) {
  background-color: rgba(22, 92, 145, 0.8);
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  border-color: #ccc;
}
</style>