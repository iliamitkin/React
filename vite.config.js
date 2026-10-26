import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    ...(process.env.ANALYZE === 'true' ? [visualizer({ filename: 'dist/bundle-report.html', open: false, gzipSize: true, brotliSize: true })] : []),
  ],
  build: { chunkSizeWarningLimit: 500 },
});
