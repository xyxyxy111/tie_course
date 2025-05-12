import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  build: {
    rollupOptions: {
      input: {
        // 匹配所有位于项目根目录的 .html 文件作为入口
        index: resolve(__dirname, 'public/index.html'),
        cart: resolve(__dirname, 'public/cart.html'),
        login: resolve(__dirname, 'public/login.html'),
        signup: resolve(__dirname, 'public/signup.html'),
        search: resolve(__dirname, 'public/search.html'),
        video: resolve(__dirname, 'public/video.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }
})


