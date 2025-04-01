import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', 'regenerator-runtime/runtime', "@ffmpeg/utisl"],  // Ensures FFmpeg is loaded properly
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Allows FFmpeg to work with Vite's ES modules
    },
  },
});
