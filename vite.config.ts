import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/cow-price': {
        target: 'https://coinofworld.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api\/cow-price/, '/api/price?time=30d&pair=COW%2FUSD'),
      },
    },
  },
})
