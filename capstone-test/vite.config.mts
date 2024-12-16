import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    outDir: 'build',
    assetsDir: '',
    minify: false,
    rollupOptions: {
      input: './index.tsx',
      output: {
        entryFileNames: 'capstone.js',
      },
    },
  },
});
