import '@/assets/main.css'
import '@/assets/rem.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useFilterStore } from './components/filterStore'
import App from './App.vue'
const app = createApp(App)
app.use(createPinia())
app.mount('#app')


