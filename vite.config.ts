
import { defineConfig } from 'vite';

export default defineConfig({
  // El 'base' debe coincidir con el nombre de tu repositorio en GitHub
  base: '/Web-de-Vetas-f-sicas/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: true,
  }
});
