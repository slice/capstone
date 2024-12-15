import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    outDir: 'build',
    assetsDir: '',
    rollupOptions: {
      input: './index.tsx',
      output: {
        entryFileNames: 'capstone.js',
      },
    },
  },
});
