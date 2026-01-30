import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
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
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Explicitly define VITE_API_URL to ensure it's available in the client build
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    }
  };
});