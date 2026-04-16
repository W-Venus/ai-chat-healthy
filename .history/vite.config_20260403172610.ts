import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入node提供的内置模块path，可以获取绝对路径
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})
