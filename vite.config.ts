import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          
        },
      },
    },
    chunkSizeWarningLimit: 300,
  },
});