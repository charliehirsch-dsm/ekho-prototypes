import fs from 'fs';
import path from 'path';
import { transformSync } from 'esbuild';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const MONOREPO = path.resolve(__dirname, '../../Repos/ekho');
const ADMIN_SRC = path.resolve(MONOREPO, 'apps/admin-portal/src');
const CARTHAGE_SRC = path.resolve(MONOREPO, 'apps/carthage/src');
const REV_SOURCE = path.resolve(MONOREPO, 'packages/ekho-common/src/rev');
const COMMON_SRC = path.resolve(MONOREPO, 'packages/ekho-common/src');

/**
 * App-scoped alias targets. Each app uses the same alias names (@config,
 * @features, etc.) but they point to different source directories.
 *
 * In Vite 8/Rolldown, resolve.alias runs before enforce:'pre' plugins,
 * so ALL app-internal aliases must be handled by this plugin, not by
 * resolve.alias. Admin portal is the default fallback for files that
 * don't belong to any specific app (e.g., prototype shell files that
 * import @config/...).
 *
 * Order within each app's aliases matters: more specific paths must come
 * before less specific ones (e.g., '@config/environments' before '@config').
 */
const APP_SCOPED_ALIASES: Record<string, Record<string, string>> = {
  [CARTHAGE_SRC]: {
    // Stub overrides: paths need /carthage prefix, environments need mock program owner
    '@config/paths': path.resolve(__dirname, 'src/stubs/carthage/paths.ts'),
    '@config/environments': path.resolve(__dirname, 'src/stubs/carthage/environments.ts'),
    '@config': path.resolve(CARTHAGE_SRC, 'config'),
    '@features': path.resolve(CARTHAGE_SRC, 'features'),
    '@pages': path.resolve(CARTHAGE_SRC, 'pages'),
    '@app': path.resolve(CARTHAGE_SRC, 'app'),
    '@common': path.resolve(CARTHAGE_SRC, 'common'),
    '@assets': path.resolve(MONOREPO, 'apps/carthage/public/assets'),
  },
};

/** Default aliases for files not in any app (admin portal as fallback) */
const DEFAULT_APP_ALIASES: Record<string, string> = {
  // Stub overrides (admin portal specific)
  '@app/components/AuthSessionWrapper': path.resolve(__dirname, 'src/stubs/AuthSessionWrapper.ts'),
  '@app/components/DocumentTitleUpdater': path.resolve(__dirname, 'src/stubs/DocumentTitleUpdater.ts'),
  '@pages/guards/PortalAccessGuard': path.resolve(__dirname, 'src/stubs/PortalAccessGuard.ts'),
  '@pages/guards/SessionDataGuard': path.resolve(__dirname, 'src/stubs/SessionDataGuard.ts'),
  '@pages/routes/settings/layouts/useSettingsLayout': path.resolve(__dirname, 'src/stubs/useSettingsLayout.ts'),
  '@config/firebase': path.resolve(__dirname, 'src/stubs/firebase-config.ts'),
  // Admin portal internal aliases (mirrors tsconfig.path.json)
  '@config': path.resolve(ADMIN_SRC, 'config'),
  '@features': path.resolve(ADMIN_SRC, 'features'),
  '@pages': path.resolve(ADMIN_SRC, 'pages'),
  '@app': path.resolve(ADMIN_SRC, 'app'),
  '@assets': path.resolve(ADMIN_SRC, 'assets'),
  '@common': path.resolve(ADMIN_SRC, 'common'),
};

/**
 * Try to resolve a source import against an alias map.
 * Returns the resolved file path or null if no match found.
 */
function resolveAlias(source: string, aliases: Record<string, string>): string | null {
  for (const [alias, target] of Object.entries(aliases)) {
    if (source !== alias && !source.startsWith(alias + '/')) continue;
    const rest = source.slice(alias.length);
    const resolved = rest ? path.resolve(target, rest.slice(1)) : target;
    // Try extensions and index files
    for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx', '']) {
      const candidate = resolved + ext;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }
  return null;
}

/**
 * Map production file paths -> prototype stub paths.
 * Catches relative imports that bypass alias resolution (which only
 * matches import specifier strings, not resolved file paths).
 */
const STUB_FILE_REDIRECTS: Record<string, string> = {
  [path.resolve(ADMIN_SRC, 'pages/routes/settings/layouts/useSettingsLayout.ts')]:
    path.resolve(__dirname, 'src/stubs/useSettingsLayout.ts'),
};

export default defineConfig({
  plugins: [
    // Resolve @config, @features, @pages, @app, @common, @assets based on
    // which app the importer belongs to. This plugin handles ALL app-internal
    // alias resolution because Vite 8/Rolldown's resolve.alias runs before
    // enforce:'pre' plugins, making it impossible to override from a plugin.
    {
      name: 'app-scoped-aliases',
      enforce: 'pre',
      resolveId(source, importer) {
        if (!importer) return;
        // Skip non-alias imports
        if (!source.startsWith('@')) return;
        // Skip package imports that aren't app aliases
        if (source.startsWith('@tanstack/') || source.startsWith('@ekhodealer/') ||
            source.startsWith('@sentry/') || source.startsWith('@sardine-ai/') ||
            source.startsWith('@hotjar/') || source.startsWith('@react-aria/') ||
            source.startsWith('@react-stately/') || source.startsWith('@vitejs/') ||
            source.startsWith('@rev-source')) return;
        // Skip the explicit cross-app prefixed aliases (@carthage/, @admin/, etc.)
        if (source.startsWith('@carthage/') || source.startsWith('@admin/') ||
            source.startsWith('@grader/') || source.startsWith('@ops/')) return;

        // Check app-scoped aliases first (Carthage files get Carthage targets)
        for (const [appSrc, aliases] of Object.entries(APP_SCOPED_ALIASES)) {
          if (!importer.startsWith(appSrc)) continue;
          const result = resolveAlias(source, aliases);
          if (result) return result;
        }

        // Default: admin portal aliases (for prototype files, admin files, etc.)
        return resolveAlias(source, DEFAULT_APP_ALIASES);
      },
    },
    // Redirect relative imports from production code to prototype stubs.
    // This handles cases where production files do `import { x } from './foo'`
    // which alias resolution can't intercept (it only matches specifier strings).
    {
      name: 'stub-file-redirects',
      enforce: 'pre',
      resolveId(source, importer) {
        if (!importer || !source.startsWith('.')) return;
        const resolved = path.resolve(path.dirname(importer), source);
        // Try with .ts and .tsx extensions
        for (const ext of ['', '.ts', '.tsx']) {
          const candidate = resolved + ext;
          if (STUB_FILE_REDIRECTS[candidate]) {
            return STUB_FILE_REDIRECTS[candidate];
          }
        }
      },
    },
    // Legacy .js files in ekho-common contain JSX but Vite 8/Rolldown's native
    // transform only enables JSX parsing for .jsx/.tsx extensions. We pre-compile
    // these files with esbuild in the load hook so Rolldown receives plain JS.
    {
      name: 'jsx-in-legacy-js',
      enforce: 'pre',
      load(id) {
        if (id.endsWith('.js') && id.includes('ekho-common/src')) {
          // Prefer .ts source over stale .js compiled output
          const tsPath = id.replace(/\.js$/, '.ts');
          if (fs.existsSync(tsPath)) return null; // let Vite resolve .ts instead
          const code = fs.readFileSync(id, 'utf-8');
          if (!code.includes('<')) return code;
          try {
            const result = transformSync(code, {
              loader: 'jsx',
              jsx: 'automatic',
              jsxImportSource: 'react',
              sourcefile: id,
            });
            return result.code;
          } catch {
            return code;
          }
        }
      },
      resolveId(source, importer) {
        if (!importer?.includes('ekho-common/src')) return;
        // ekho-common's internal @/ alias maps to its own src/
        if (source.startsWith('@/')) {
          const resolved = path.resolve(COMMON_SRC, source.slice(2));
          // Try with .ts/.tsx extensions first (most common case)
          if (fs.existsSync(resolved + '.ts')) return resolved + '.ts';
          if (fs.existsSync(resolved + '.tsx')) return resolved + '.tsx';
          // Try as directory with index
          if (fs.existsSync(path.join(resolved, 'index.ts'))) return path.join(resolved, 'index.ts');
          if (fs.existsSync(path.join(resolved, 'index.tsx'))) return path.join(resolved, 'index.tsx');
          // Exact file path (e.g. already has extension)
          if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved;
        }
        // When a .js import has a .ts counterpart, resolve to .ts
        if (source.endsWith('.js')) {
          const resolved = path.resolve(path.dirname(importer), source);
          const tsPath = resolved.replace(/\.js$/, '.ts');
          if (fs.existsSync(tsPath)) return tsPath;
        }
        // Extensionless relative imports: prefer .ts over .js when both exist
        if (source.startsWith('.') && !path.extname(source)) {
          const base = path.resolve(path.dirname(importer), source);
          const tsPath = base + '.ts';
          const tsxPath = base + '.tsx';
          if (fs.existsSync(tsPath)) return tsPath;
          if (fs.existsSync(tsxPath)) return tsxPath;
        }
      },
    },
    // Replace async Jotai atoms with synchronous versions for the prototype.
    // Async atoms use React.use() which throws "async Client Component" errors
    // when there's no React Server Components infrastructure. The atoms still
    // return null (their early-exit value) — we just remove the async wrapper.
    {
      name: 'sync-async-atoms',
      transform(code, id) {
        if (!id.includes('vehicleDetailsAtoms')) return;
        return code.replace(
          /export const userDistanceAtom = atom\(async[\s\S]*?\}\);/,
          'export const userDistanceAtom = atom(() => null);',
        );
      },
    },
    // Prefix hardcoded internal URLs in Carthage's navigation config so they
    // stay within the /carthage/* route scope. The paths stub handles the
    // programmatic paths config, but the nav config has its own hardcoded URLs.
    {
      name: 'carthage-nav-url-prefix',
      transform(code, id) {
        if (!id.includes('appNavigationConfig')) return;
        // Vite may transform quotes from single to double, so match both
        return code
          .replace(/url: ['"]\/['"]/g, 'url: "/carthage/"')
          .replace(/url: ['"]\/login['"]/g, 'url: "/carthage/login"');
      },
    },
    // Prototype: sticky CTA show/hide/show-again behavior.
    // Production only shows the sticky bottom bar AFTER scrolling past payment.
    // This transform adds IntersectionObserver-based visibility tracking so the
    // bar shows immediately on entry, hides when inline CTAs are in view,
    // reappears after scrolling past.
    //
    // Logic: show when (!paymentCtasVisible || hasScrolledPastPayment)
    //   - On entry: CTAs below fold -> !false || false = true -> SHOW
    //   - Scroll to CTAs: !true || false = false -> HIDE
    //   - Scroll past: !false || true = true -> SHOW (hasScrolledPast takes over)
    {
      name: 'sticky-cta-show-hide',
      transform(code, id) {
        if (!id.includes('vehicle-details') || !id.includes('index.tsx')) return;
        if (!id.includes('carthage')) return;
        // Only match the page file, not sub-components
        if (!id.includes('pages/routes') && !id.includes('pages%2Froutes')) return;

        let result = code;

        // 1. Inline the visibility hook. Checks if the CTA buttons area
        //    (bottom ~200px of the payment section) is in the viewport.
        //    Uses scroll events + getBoundingClientRect for precision.
        const inlineHook = `
function useIsPaymentCtasVisible() {
  const [isVis, setIsVis] = useState(false);
  const elRef = useRef(null);
  const checkVis = useCallback(() => {
    if (!elRef.current) return;
    const rect = elRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const ctaTop = rect.bottom - 200;
    setIsVis(ctaTop < vh && rect.bottom > 0);
  }, []);
  useEffect(() => {
    window.addEventListener('scroll', checkVis, { passive: true });
    window.addEventListener('resize', checkVis, { passive: true });
    checkVis();
    return () => { window.removeEventListener('scroll', checkVis); window.removeEventListener('resize', checkVis); };
  }, [checkVis]);
  const refCb = useCallback((node) => { elRef.current = node; checkVis(); }, [checkVis]);
  return [refCb, isVis];
}`;
        // Insert the hook function right before the VehicleDetailsPageContent function
        result = result.replace(
          'function VehicleDetailsPageContent()',
          inlineHook + '\nfunction VehicleDetailsPageContent()',
        );

        // 2. Add hook call after useHasScrolledPast
        const hookCallTarget = 'const [paymentScrollPastRef, hasScrolledPastPayment] = useHasScrolledPast({ threshold: 0 });';
        if (result.includes(hookCallTarget)) {
          result = result.replace(
            hookCallTarget,
            hookCallTarget + '\n\tconst [paymentCtasRef, isPaymentCtasVisible] = useIsPaymentCtasVisible();',
          );
        }

        // 3. Add paymentCtasRef to combinedPaymentRef callback
        if (result.includes('paymentScrollPastRef(node);') && !result.includes('paymentCtasRef(node);')) {
          result = result.replace(
            'paymentScrollPastRef(node);',
            'paymentScrollPastRef(node);\n\t\t\tpaymentCtasRef(node);',
          );
          result = result.replace(
            '[paymentScrollPastRef],',
            '[paymentScrollPastRef, paymentCtasRef],',
          );
        }

        // 4. Change sticky bottom bar visibility condition.
        //    Match both raw TSX and post-JSX-transform patterns.
        result = result.replace(
          'isCompact && hasScrolledPastPayment && (',
          'isCompact && (!isPaymentCtasVisible || hasScrolledPastPayment) && (',
        );
        result = result.replace(
          /isCompact && hasScrolledPastPayment && (\/\*|_jsxDEV)/,
          'isCompact && (!isPaymentCtasVisible || hasScrolledPastPayment) && $1',
        );

        return result;
      },
    },
    react(),
  ],
  base: './',
  resolve: {
    alias: {
      // Rev design system source
      '@rev-source': REV_SOURCE,

      // Monorepo app sources (for cross-app imports like @carthage/...)
      '@admin': ADMIN_SRC,
      '@carthage': path.resolve(MONOREPO, 'apps/carthage/src'),
      '@grader': path.resolve(MONOREPO, 'apps/grader/src'),
      '@ops': path.resolve(MONOREPO, 'apps/ops-portal/src'),

      // Shared package aliases
      '@ekhodealer/ekho-common/rev': path.resolve(COMMON_SRC, 'rev'),
      '@ekhodealer/ekho-common/utils': path.resolve(COMMON_SRC, 'utils'),
      '@ekhodealer/ekho-common/auth-client': path.resolve(COMMON_SRC, 'auth-client'),
      '@ekhodealer/ekho-common/server': path.resolve(COMMON_SRC, 'server'),
      '@ekhodealer/ekho-common/components': path.resolve(COMMON_SRC, 'components'),
      '@ekhodealer/ekho-common': COMMON_SRC,

      // --- External SDK stubs (no-op replacements) ---
      '@sentry/react': path.resolve(__dirname, 'src/stubs/sentry.ts'),
      'firebase/app': path.resolve(__dirname, 'src/stubs/firebase.ts'),
      'firebase/auth': path.resolve(__dirname, 'src/stubs/firebase.ts'),
      'firebase/firestore': path.resolve(__dirname, 'src/stubs/firebase.ts'),
      'firebase/storage': path.resolve(__dirname, 'src/stubs/firebase.ts'),
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
          // Admin-portal's local SCSS partials (e.g. @use 'rev-utils')
          path.resolve(ADMIN_SRC, 'styles'),
          // Carthage's local SCSS partials
          path.resolve(CARTHAGE_SRC, 'styles'),
          // ekho-common compiled SCSS (used by some production SCSS files)
          path.resolve(COMMON_SRC, '../lib/scss'),
          // App roots so 'node_modules/@ekhodealer/...' SCSS imports resolve
          // (pnpm symlinks @ekhodealer/ekho-common in each app's node_modules)
          path.resolve(MONOREPO, 'apps/admin-portal'),
          path.resolve(MONOREPO, 'apps/carthage'),
        ],
        // Also set loadPaths for modern SASS API compatibility
        loadPaths: [
          path.resolve(REV_SOURCE, '_constants'),
          path.resolve(ADMIN_SRC, 'styles'),
          path.resolve(CARTHAGE_SRC, 'styles'),
          path.resolve(COMMON_SRC, '../lib/scss'),
          path.resolve(MONOREPO, 'apps/admin-portal'),
          path.resolve(MONOREPO, 'apps/carthage'),
        ],
      },
    },
  },
  // MSW needs a VITE_CURR_ENV variable for the apiClient baseURL logic
  define: {
    'import.meta.env.VITE_CURR_ENV': JSON.stringify('prototype'),
  },
});
