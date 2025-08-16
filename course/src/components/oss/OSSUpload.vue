<template>
  <div class="oss-uploader">
    <input type="file" @change="handleFileChange" ref="fileInput" accept="image/*" />

    <button @click="handleUpload" :disabled="!selectedFile || isLoading">
      {{ isLoading ? '上传中...' : '上传图片' }}
    </button>

    <p v-if="uploadStatus" class="status-message">{{ uploadStatus }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import OSS from 'ali-oss';

// --- 组件通信定义 ---

// emits: 定义一个事件，用于在上传成功后通知父组件，并传递图片URL
const emit = defineEmits(['upload-success']);

// --- 组件内部状态 ---
const selectedFile = ref(null);      // 用户选择的文件
const isLoading = ref(false);        // 是否正在上传
const uploadStatus = ref('');        // 显示给用户的状态信息
const fileInput = ref(null);         // 对 input 元素的引用

const STS_API_URL = '/api/sts'; // <--- 请将这里替换成你真实的后端接口路径

/**
 * 当用户选择了文件后触发
 * @param {Event} event - 文件选择事件
 */
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    uploadStatus.value = `已选择文件: ${file.name}`;
  }
}

/**
 * 点击上传按钮时触发
 */
async function handleUpload() {
  if (!selectedFile.value) {
    alert('请先选择一个图片文件！');
    return;
  }

  isLoading.value = true;
  uploadStatus.value = '正在获取上传凭证...';

  try {
    // 1. 从你的后端获取 STS 临时凭证
    const stsResponse = await fetch(props.stsApiUrl);
    if (!stsResponse.ok) throw new Error('获取STS凭证失败');
    
    const stsData = await stsResponse.json();
    if (stsData.code !== 200) throw new Error(stsData.message);
    const creds = stsData.data;

    // 2. 使用凭证初始化 OSS 客户端
    const client = new OSS({
      region: creds.region,
      bucket: creds.bucket,
      accessKeyId: creds.accessKeyId,
      accessKeySecret: creds.accessKeySecret,
      stsToken: creds.securityToken,
      secure: true, // 强制使用 https
    });

    uploadStatus.value = '凭证获取成功，正在上传...';

    // 3. 定义上传到 OSS 上的文件名 (Object Key)
    // 格式: 目录/年-月-日/时间戳-随机数-原始文件名
    const date = new Date();
    const timestamp = date.getTime();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}/${timestamp}-${randomSuffix}-${selectedFile.value.name}`;
    const objectKey = `user-uploads/${fileName}`;

    // 4. 执行上传
    const result = await client.put(objectKey, selectedFile.value);

    // 5. 上传成功
    isLoading.value = false;
    uploadStatus.value = '上传成功！';

    // 6. 触发 upload-success 事件，将最终的图片 URL 传递给父组件
    emit('upload-success', result.url);

    // 清空文件选择框
    if(fileInput.value) fileInput.value.value = '';
    selectedFile.value = null;

  } catch (error) {
    console.error('上传过程中发生错误:', error);
    isLoading.value = false;
    uploadStatus.value = `上传失败: ${error.message}`;
  }
}
</script>

<style scoped>
.oss-uploader {
  border: 1px dashed #ccc;
  padding: 20px;
  text-align: center;
}
.status-message {
  margin-top: 10px;
  color: #666;
}
</style>