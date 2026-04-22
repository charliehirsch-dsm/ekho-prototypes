/**
 * CarthageShell: Renders production Carthage components with MSW mocking.
 *
 * Mirrors AdminShell's pattern: JotaiProvider + QueryClientProvider + bootstrap.
 * Instead of auth bootstrapping (admin), this uses domain bootstrapping
 * (seeding program owner and domain services provider atoms).
 *
 * The real apiClient is used. MSW intercepts its HTTP requests.
 */

import { Suspense } from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { ReactNode } from 'react';

import { queryClient } from '@carthage/config/server/queryClient';
import { MockDomainBootstrap } from './MockDomainBootstrap';
import { CarthageRouter } from './CarthageRouter';

import './CarthageShell.scss';

export function CarthageShell(): ReactNode {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div className="carthage-loading">Loading...</div>}>
          <MockDomainBootstrap>
            <CarthageRouter />
          </MockDomainBootstrap>
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </JotaiProvider>
  );
}
