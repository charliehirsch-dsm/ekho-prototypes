/**
 * AdminShell: Renders production Admin Portal components with MSW mocking.
 *
 * Uses the production AppLayout, AppSideNav, and AppTopBar directly.
 * Auth/guards are stubbed via Vite alias overrides. API calls are
 * intercepted by MSW.
 *
 * The prototype's BrowserRouter (in main.tsx) is incompatible with
 * createBrowserRouter (used in production AppRouter), so we create a
 * Routes-based router that imports production page components directly.
 */

import { Provider as JotaiProvider } from 'jotai';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { ReactNode } from 'react';

import { queryClient } from '@config/server/queryClient';
import { MockAuthSessionWrapper } from '../../stubs/MockAuthBootstrap';
import { AdminRouter } from './AdminRouter';

import './AdminShell.scss';

export function AdminShell(): ReactNode {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <MockAuthSessionWrapper>
          <AdminRouter />
        </MockAuthSessionWrapper>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </JotaiProvider>
  );
}
