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
import { request } from '@/utils/request';
import { profileApi } from '@/api/user';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import OSS from 'ali-oss';

interface StsCredentials {
  endpoint: string;
  bucketName: string;
  AccessKeyId: string;
  AccessKeySecret: string;
  securityToken: string;
  fileName: string;
}

export default defineComponent({
  name: 'Photo',
  setup() {
    const isSubmitting = ref(false);
    const selectedFile = ref<File | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);

    // 新增用于本地预览的URL和状态信息
    const previewUrl = ref('');
    const statusMessage = ref('');

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
      // 优化文件选择和预览逻辑

      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          statusMessage.value = '请选择图片文件';
          return;
        }

        // 验证文件大小 (限制为 5MB)
        if (file.size > 5 * 1024 * 1024) {
          statusMessage.value = '文件大小不能超过 5MB';
          return;
        }

        selectedFile.value = file;
        statusMessage.value = `已选择文件: ${file.name}`;

        // 使用FileReader创建本地预览URL，并赋值给新的ref
        const reader = new FileReader();
        reader.onload = (e) => {
          previewUrl.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }

    const submitForm = async () => {
      // 重写提交流程,改为STS直传OSS
      if (!selectedFile.value) {
        alert('请先选择图片文件');
        return;
      }

      isSubmitting.value = true;
      statusMessage.value = '正在处理.请稍候';
      try {
        // 1.获取sts凭证
        statusMessage.value = '正在获取上传凭证';
        // 调用后端sts接口
        const stsApiResponse = await request<StsCredentials>({
          url: '/sts', // 你的 STS 接口地址
          method: 'GET'
        });

        const creds = stsApiResponse.data;

        // 2. 初始化OSS客户端
        const client = new OSS({
          endpoint: creds.endpoint,
          bucket: creds.bucketName,
          accessKeyId: creds.AccessKeyId,
          accessKeySecret: creds.AccessKeySecret,
          stsToken: creds.securityToken,
          secure: true,
        });

        // 3. 从后端获取文件名并上传到OSS
        statusMessage.value = '正在上传头像...';

        const fileName = selectedFile.value.name;
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
          console.log('无效的文件，缺少后缀名');
        }
        const fileExt = fileName.substring(lastDotIndex + 1).toLowerCase();

        const objectKey = `avatars/${creds.fileName}.${fileExt}`;
        const uploadResult = await client.put(objectKey, selectedFile.value);

        // 4. 上传成功后，使用返回的URL更新form
        statusMessage.value = '上传成功，正在保存资料...';
        form.avatarUrl = uploadResult.url; // 将OSS返回的URL赋值给form

        // 5. 调用原有的更新资料接口，将包含新avatarUrl的form提交
        await profileApi.updateProfile(form);

        alert('保存头像成功!');
        statusMessage.value = '头像已更新！';
        selectedFile.value = null; // 重置状态
        previewUrl.value = ''; // 清空预览，显示最新的form.avatarUrl
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
      fileInput,
      previewUrl,  // 将状态返回给模板
      statusMessage
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
  border-color: #215496;
}

button {
  position: relative;
  left: 80%;
  width: fit-content;
  background-color: #215496;
  color: white;
  border: none;
  margin: 5px 20px;
  padding: 2px 15px;
  border-radius: 4px;
  cursor: pointer;
  height: 30px;
  font-size: 1.2rem;
  transition: all 0.3s;
  border: 1px #215496 solid;
}

button:hover:not(:disabled) {
  background-color: rgba(33, 84, 150, 0.8);
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  border-color: #ccc;
}

.status-message {
  margin-top: 10px;
  color: #666;
}
</style>