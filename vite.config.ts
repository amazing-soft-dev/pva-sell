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
          target: 'http://localhost:5000',
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