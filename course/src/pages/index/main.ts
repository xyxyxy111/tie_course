import '@/assets/main.css'
import '@/assets/rem.css'
import { createApp } from 'vue'
import App from './App.vue'
import { clearExpiredToken, TokenManager } from '@/utils/request'

// 在应用启动时清理过期的token
clearExpiredToken()

// 启动token定期检查
TokenManager.startPeriodicCheck()

const app = createApp(App)

app.mount('#app')


