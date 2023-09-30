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

// channel_name: "billywhitmore"
// ​
// id: 1
// ​
// is_connected: true
// ​
// listener_auth_code: "5i1akgtdrhz1yxjg7r2bl4586c6rmf"
// ​
// listener_client_id: "5khyyw9vci7wvvs7wcj5g3ptw5hax3"
// ​
// listener_secret: "7sxyc4gaqslf9qnwy0dl8jruretf46"
// ​
// listener_user_name: "HealthBarListener"