import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // In local dev the API routes are served by `vercel dev`; point at it so
    // the browser talks to the same handlers that run in production.
    proxy: { '/api': 'http://localhost:3001' },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
