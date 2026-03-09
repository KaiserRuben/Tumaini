import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: false
  },
  css: {
    preprocessorOptions: {
      sass: {
        silenceDeprecations: ['legacy-js-api']
      },
      scss: {
        silenceDeprecations: ['legacy-js-api']
      }
    }
  }
})
