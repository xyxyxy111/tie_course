import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 已知页面列表
const knownPages = ['cart', 'login', 'signup', 'search', 'video', 'checkout', 'learning']

// 改进的重定向插件，使用更严格的类型定义
const redirectPlugin = () => ({
  name: 'html-redirect',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      try {
        const url = req.url || ''
        if (url === '/' || url === '/index') {
          res.writeHead(302, { Location: '/index.html' })
          return res.end()
        }
        const pathParts = url.split('/').filter((part: string) => part.length > 0)
        const lastPart = pathParts[pathParts.length - 1] || ''
        if (knownPages.includes(lastPart) && !url.includes('.') && !url.endsWith('/')) {
          res.writeHead(302, { Location: `${url}.html` })
          return res.end()
        }

        if (url.startsWith('/@') || url.startsWith('/src/') || url.includes('.')) {
          return next()
        }
      } catch (error) {
        console.error('Redirect plugin error:', error)
      }

      next()
    })
  }
})

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    redirectPlugin()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'public/index.html'),
        cart: resolve(__dirname, 'public/cart.html'),
        login: resolve(__dirname, 'public/login.html'),
        search: resolve(__dirname, 'public/search.html'),
        course: resolve(__dirname, 'public/course.html'),
        video: resolve(__dirname, 'public/video.html'),
        checkout: resolve(__dirname, 'public/checkout.html'),
        learning: resolve(__dirname, 'public/learning.html'),
        myinfo: resolve(__dirname, 'public/my-info.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  appType: 'mpa'
})