import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入node提供的内置模块path，可以获取绝对路径
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // src文件夹配置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://159.75.169.224:1235',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // 移除/api前缀
      }
    }
  }
})
