
import { defineConfig } from 'vite';

export default defineConfig({
  // Base debe ser el nombre exacto de la carpeta en GitHub Pages
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: true,
  }
});
