<template>
  <div class="privacy-container">
    <h1>隐私设置</h1>
    <p class="privacy-note">注意：隐私设置将保存在您的浏览器本地存储中</p>

    <div class="privacy-options">
      <label class="privacy-option">
        <input type="checkbox" class="privacy-checkbox" v-model="privacySettings.showProfileToLoggedInUsers"
          @change="handlePrivacyChange">
        <span class="option-text">向已登录用户显示您的个人资料</span>
      </label>

      <label class="privacy-option">
        <input type="checkbox" class="privacy-checkbox" v-model="privacySettings.showCoursesOnProfile"
          @change="handlePrivacyChange">
        <span class="option-text">在您的个人资料页面上显示所修课程</span>
      </label>
    </div>

    <button @click="submitForm" class="submit-btn" id="submitBtn" :disabled="isSubmitting || !hasChanges">
      {{ isSubmitting ? '保存中...' : '保存隐私设置' }}
    </button>
  </div>
</template>

<script lang="ts">
import { profileApi } from '@/api/user';
import { defineComponent, onMounted, reactive, ref, computed } from 'vue';

export default defineComponent({
  name: 'Privacy',
  setup() {
    const isSubmitting = ref(false);
    const originalSettings = ref({
      showProfileToLoggedInUsers: false,
      showCoursesOnProfile: false
    });

    const privacySettings = reactive({
      showProfileToLoggedInUsers: false,
      showCoursesOnProfile: false
    });

    // 存储完整的用户资料数据
    const userProfile = ref({
      username: '',
      firstName: '',
      lastName: '',
      major: '',
      avatarUrl: '',
      allowEmailNotify: false,
      allowSMSNotify: false
    });

    // 检查是否有更改
    const hasChanges = computed(() => {
      return privacySettings.showProfileToLoggedInUsers !== originalSettings.value.showProfileToLoggedInUsers ||
        privacySettings.showCoursesOnProfile !== originalSettings.value.showCoursesOnProfile;
    });

    // 获取个人信息
    const fetchProfile = async () => {
      try {
        const { data } = await profileApi.getProfile();
        // 类型断言处理API返回的数据
        const profileData = data as any;

        // 保存完整的用户资料
        Object.assign(userProfile.value, profileData);

        // 从本地存储获取隐私设置，如果没有则使用默认值
        const savedPrivacySettings = localStorage.getItem('privacySettings');
        if (savedPrivacySettings) {
          const saved = JSON.parse(savedPrivacySettings);
          privacySettings.showProfileToLoggedInUsers = saved.showProfileToLoggedInUsers ?? false;
          privacySettings.showCoursesOnProfile = saved.showCoursesOnProfile ?? false;
        } else {
          // 使用默认值
          privacySettings.showProfileToLoggedInUsers = false;
          privacySettings.showCoursesOnProfile = false;
        }

        // 保存原始设置用于比较
        originalSettings.value = {
          showProfileToLoggedInUsers: privacySettings.showProfileToLoggedInUsers,
          showCoursesOnProfile: privacySettings.showCoursesOnProfile
        };
      } catch (error) {
        console.error('获取用户资料失败:', error);
        // 使用默认值
        privacySettings.showProfileToLoggedInUsers = false;
        privacySettings.showCoursesOnProfile = false;
        originalSettings.value = {
          showProfileToLoggedInUsers: false,
          showCoursesOnProfile: false
        };
      }
    };

    // 处理隐私设置变更
    const handlePrivacyChange = () => {
      // 可以在这里添加额外的验证逻辑
      console.log('隐私设置已更改:', privacySettings);
    };

    // 提交表单
    const submitForm = async () => {
      if (!hasChanges.value) {
        alert('没有更改需要保存');
        return;
      }

      isSubmitting.value = true;
      try {
        // 保存隐私设置到本地存储
        const privacyData = {
          showProfileToLoggedInUsers: privacySettings.showProfileToLoggedInUsers,
          showCoursesOnProfile: privacySettings.showCoursesOnProfile
        };
        localStorage.setItem('privacySettings', JSON.stringify(privacyData));

        alert('隐私设置保存成功!');

        // 更新原始设置
        originalSettings.value = {
          showProfileToLoggedInUsers: privacySettings.showProfileToLoggedInUsers,
          showCoursesOnProfile: privacySettings.showCoursesOnProfile
        };
      } catch (error) {
        console.error('保存失败:', error);
        alert('保存失败，请重试');
      } finally {
        isSubmitting.value = false;
      }
    };

    // 组件挂载时获取数据
    onMounted(() => {
      fetchProfile();
    });

    return {
      privacySettings,
      submitForm,
      isSubmitting,
      hasChanges,
      handlePrivacyChange
    };
  }
});
</script>

<style scoped>
.privacy-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.privacy-container h1 {
  margin-bottom: 10px;
  color: #333;
  font-size: 24px;
  text-align: center;
}

.privacy-note {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
  font-style: italic;
}

.privacy-options {
  margin-bottom: 30px;
}

.privacy-option {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.privacy-option:hover {
  border-color: #215486;
  background-color: rgba(33, 84, 150, 0.05);
}

.option-text {
  margin-left: 10px;
  font-size: 16px;
  color: #333;
  flex: 1;
}

.privacy-checkbox[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.privacy-checkbox[type="checkbox"]:checked {
  background-color: #215486;
  border-color: #215486;
  position: relative;
}

.privacy-checkbox[type="checkbox"]:checked::before {
  content: "✓";
  color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: bold;
}

.privacy-checkbox[type="checkbox"]:focus {
  box-shadow: 0 0 0 2px rgba(33, 84, 150, 0.2);
}

button {
  display: block;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  background-color: #215486;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid #215486;
}

button:hover:not(:disabled) {
  background-color: rgba(33, 84, 150, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(33, 84, 150, 0.3);
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  border-color: #ccc;
  transform: none;
  box-shadow: none;
}

button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(33, 84, 150, 0.3);
}
</style>
