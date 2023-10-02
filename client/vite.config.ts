import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  server: {
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:888',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:888',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  build: {
    outDir: './dist',
    emptyOutDir: true
  }
})
