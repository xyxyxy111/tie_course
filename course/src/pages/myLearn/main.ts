import '@/assets/main.css'
import '@/assets/rem.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '../../router'
import { clearExpiredToken } from '@/utils/request'

// 在应用启动时清理过期的token
clearExpiredToken()

const app = createApp(App)
app.use(router)

app.mount('#app')


