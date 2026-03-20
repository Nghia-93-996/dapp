import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Tải biến môi trường dựa trên mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  const targetUrl = env.COW_PRICE_URL || env.VITE_COW_PRICE_API || 'https://coinofworld.com/api/price?time=30d&pair=COW%2FUSD';
  
  // Trích xuất path để dùng cho rewrite vì target chỉ nhận origin
  let targetOrigin = 'https://coinofworld.com';
  let targetPath = '/api/price?time=30d&pair=COW%2FUSD';
  
  try {
    const url = new URL(targetUrl);
    targetOrigin = url.origin;
    targetPath = url.pathname + url.search;
  } catch (e) {
    console.warn('[Vite Config] Invalid targetUrl from env, using default.');
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/cow-price': {
          target: targetOrigin,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/cow-price/, targetPath),
        },
      },
    },
  };
});
