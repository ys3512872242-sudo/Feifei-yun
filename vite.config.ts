import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 部署到 GitHub Pages (https://<user>.github.io/Feifei-yun/) 时必须设置 base
  base: '/Feifei-yun/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
