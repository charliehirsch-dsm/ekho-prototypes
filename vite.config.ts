import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const MONOREPO = path.resolve(__dirname, '../../Repos/ekho');
const REV_SOURCE = path.resolve(MONOREPO, 'packages/ekho-common/src/rev');
const COMMON_SRC = path.resolve(MONOREPO, 'packages/ekho-common/src');

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      // Rev design system source
      '@rev-source': REV_SOURCE,

      // Monorepo app sources (for future direct imports)
      '@admin': path.resolve(MONOREPO, 'apps/admin-portal/src'),
      '@carthage': path.resolve(MONOREPO, 'apps/carthage/src'),
      '@grader': path.resolve(MONOREPO, 'apps/grader/src'),
      '@ops': path.resolve(MONOREPO, 'apps/ops-portal/src'),

      // Shared package aliases
      '@ekhodealer/ekho-common/rev': path.resolve(COMMON_SRC, 'rev'),
      '@ekhodealer/ekho-common/utils': path.resolve(COMMON_SRC, 'utils'),
      '@ekhodealer/ekho-common/auth-client': path.resolve(COMMON_SRC, 'auth-client'),
      '@ekhodealer/ekho-common': COMMON_SRC,
      '@common': COMMON_SRC,

      // External SDK stubs (no-op replacements)
      '@sentry/react': path.resolve(__dirname, 'src/stubs/sentry.ts'),
      'firebase/app': path.resolve(__dirname, 'src/stubs/firebase.ts'),
      'firebase/auth': path.resolve(__dirname, 'src/stubs/firebase.ts'),
      'firebase/firestore': path.resolve(__dirname, 'src/stubs/firebase.ts'),
      '@sardine-ai/web-sdk': path.resolve(__dirname, 'src/stubs/sardine.ts'),
      '@hotjar/browser': path.resolve(__dirname, 'src/stubs/hotjar.ts'),
      'refiner-js': path.resolve(__dirname, 'src/stubs/refiner.ts'),

      // Force single copies of React and react-aria
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
