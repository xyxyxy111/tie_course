<template>
  <div class="logs-container">
    <div class="logs-header">
      <h1>用户操作日志</h1>
      <div class="header-actions">
        <div class="log-count-selector">
          <label for="logCount">显示条数：</label>
          <select id="logCount" v-model="logCount" @change="fetchLogs">
            <option value="10">10条</option>
            <option value="20">20条</option>
            <option value="50">50条</option>
            <option value="100">100条</option>
          </select>
        </div>
        <button @click="clearLogs" :disabled="isClearing || logs.length === 0" class="clear-btn">
          {{ isClearing ? '清空中...' : '清空日志' }}
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>正在加载日志...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchLogs" class="retry-btn">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="logs.length === 0" class="empty">
      <p>暂无操作日志</p>
    </div>

    <!-- 日志列表 -->
    <div v-else class="logs-list">
      <div class="log-item" v-for="(log, index) in logs" :key="index">
        <div class="log-header">
          <div class="log-time">{{ formatTime(log.time) }}</div>
          <div class="log-action">{{ log.action }}</div>
        </div>
        <div class="log-details">
          <div class="log-info">
            <span class="label">用户名：</span>
            <span class="value">{{ log.username }}</span>
          </div>
          <div class="log-info">
            <span class="label">IP地址：</span>
            <span class="value">{{ log.IP }}</span>
          </div>
          <div class="log-info">
            <span class="label">位置：</span>
            <span class="value">{{ log.location }}</span>
          </div>
          <div class="log-info">
            <span class="label">IP地址：</span>
            <span class="value">{{ log.action }}</span>
          </div>
          <div class="log-info">
            <span class="label">位置：</span>
            <span class="value">{{ log.time }}</span>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { logApi } from '@/api/user';
import type { UserLogVO } from '@/api/user';


export default defineComponent({
  name: 'Archived',
  setup() {
    const logs = ref<UserLogVO[]>([]);
    const logCount = ref(20);
    const isLoading = ref(false);
    const isClearing = ref(false);
    const error = ref('');

    // 获取用户日志
    const fetchLogs = async () => {
      isLoading.value = true;
      error.value = '';

      try {
        const response = await logApi.getUserLogs(logCount.value);
        if (response.data) {
          logs.value = response.data as UserLogVO[];
        }
        console.log(response)
      } catch (err) {
        console.error('获取日志失败:', err);
        error.value = '获取日志失败，请重试';
      } finally {
        isLoading.value = false;
      }
    };

    // 清空日志
    const clearLogs = async () => {
      if (!confirm('确定要清空所有日志吗？此操作不可恢复。')) {
        return;
      }

      isClearing.value = true;
      try {
        await logApi.clearUserLogs();
        alert('日志清空成功');
        logs.value = [];
      } catch (err) {
        console.error('清空日志失败:', err);
        alert('清空日志失败，请重试');
      } finally {
        isClearing.value = false;
      }
    };

    // 格式化时间
    const formatTime = (timeStr: string) => {
      try {
        const date = new Date(timeStr);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch {
        return timeStr;
      }
    };

    // 组件挂载时获取日志
    onMounted(() => {
      fetchLogs();
    });

    return {
      logs,
      logCount,
      isLoading,
      isClearing,
      error,
      fetchLogs,
      clearLogs,
      formatTime
    };
  }
});
</script>

<style scoped>
.logs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.logs-header h1 {
  color: #333;
  margin: 0;
  font-size: 24px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.log-count-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-count-selector label {
  font-weight: 600;
  color: #666;
}

.log-count-selector select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.clear-btn {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.clear-btn:hover:not(:disabled) {
  background: #c82333;
}

.clear-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 40px 20px;
  color: #dc3545;
}

.retry-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  font-size: 16px;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
}

.log-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f8f9fa;
}

.log-time {
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
}

.log-action {
  background: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.log-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.log-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-info .label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
  min-width: 60px;
}

.log-info .value {
  color: #333;
  font-size: 14px;
}

.refresh-section {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.refresh-btn {
  padding: 12px 24px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background: #218838;
}

.refresh-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logs-container {
    padding: 16px;
  }

  .logs-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .log-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .log-details {
    grid-template-columns: 1fr;
  }

  .log-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .log-info .label {
    min-width: auto;
  }
}

button {
  white-space: nowrap;
  width: fit-content;
}
</style>