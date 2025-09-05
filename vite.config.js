// vite.config.js
import { defineConfig } from 'vite';
// If you use @vitejs/plugin-react, uncomment the next two lines:
// import react from '@vitejs/plugin-react';
// const plugins = [react()];

export default defineConfig({
  // Critical for Electron: use relative paths so dist/index.html can load assets
  base: './',
  // plugins,
  build: { outDir: 'dist', sourcemap: false },
});
