import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 部署到 GitHub Pages (https://<user>.github.io/Feifei-yun/) 时必须设置 base
  base: '/Feifei-yun/',
  // 构建产物输出到 docs/ 目录，直接提交到 main 分支供 GitHub Pages 使用
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
