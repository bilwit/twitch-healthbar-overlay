import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  server: {
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:' + process.env.PORT,
        changeOrigin: true,
        secure: false,
      },
      '/wss': {
        target: 'wss://localhost:' + (Number(process.env.PORT) + 1),
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
