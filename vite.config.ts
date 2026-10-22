import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});