import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pixi.js', 'pixi-live2d-display/cubism4'],
  },
  resolve: {
    dedupe: ['pixi.js'],
  },
  server: {
    allowedHosts: ['.lhr.life', '.loca.lt'],
  },
})
