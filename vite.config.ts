import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const REV_SOURCE = path.resolve(__dirname, '../../Repos/ekho/packages/ekho-common/src/rev');

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@rev-source': REV_SOURCE,
      // Force all imports (including those from @rev-source) to use
      // the prototype's single copy of React and react-aria
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-aria-components': path.resolve(__dirname, 'node_modules/react-aria-components'),
      'react-aria': path.resolve(__dirname, 'node_modules/react-aria'),
      'react-stately': path.resolve(__dirname, 'node_modules/react-stately'),
      '@react-aria/utils': path.resolve(__dirname, 'node_modules/@react-aria/utils'),
      '@react-stately/toast': path.resolve(__dirname, 'node_modules/@react-stately/toast'),
      '@react-aria/toast': path.resolve(__dirname, 'node_modules/@react-aria/toast'),
    },
    dedupe: ['react', 'react-dom', 'react-aria-components', 'react-aria', 'react-stately'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'legacy',
        includePaths: [
          path.resolve(REV_SOURCE, '_constants'),
        ],
      },
    },
  },
});
