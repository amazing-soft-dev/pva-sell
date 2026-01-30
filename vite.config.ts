import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: '/pva-sell/',
    server: {
      host: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000', // Use 127.0.0.1 instead of localhost for Node 17+ compatibility
          changeOrigin: true,
          secure: false,
        }
      }
    },
    define: {
      // API Keys are now handled in backend, but keeping this if needed for other env vars
      'process.env.API_KEY': JSON.stringify(env.API_KEY) 
    }
  };
});