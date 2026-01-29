import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: '/', // Changed to absolute path to support client-side routing (History API)
    server: {
      host: true, // Listen on all local IPs (0.0.0.0)
    },
    define: {
      // Polyfill process.env.API_KEY so it works in the browser after build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});