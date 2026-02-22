import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react(), tailwindcss()],
    base: '/pva-sell/',
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-utils': ['uuid', 'jspdf', 'jspdf-autotable'],
            'vendor-ai': ['@google/genai'],
          },
        },
      },
    },
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
      // Define a global constant for the API URL to avoid process.env access issues in browser
      '__API_URL__': JSON.stringify(env.VITE_API_URL || '') 
    }
  };
});