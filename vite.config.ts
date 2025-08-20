import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(() => {
  return {
    base: '',
    server: {
      port: 3000,
      host: '127.0.0.1',
    },
    build: {
      assetsInlineLimit: 0,
      outDir: 'dist',
    },
    resolve: {
      alias: {
        $: path.resolve(__dirname, './src'),
      },
    },
  };
});
