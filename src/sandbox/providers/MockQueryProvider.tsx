/**
 * MockQueryProvider: Pre-populates a TanStack QueryClient with fixture data.
 * Components that use useQuery get data without network fetches.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { MOCK_DEALERS } from '../fixtures/dealers';
import { MOCK_VEHICLES } from '../fixtures/vehicles';
import { MOCK_ORDERS } from '../fixtures/orders';
import { MOCK_LEADS } from '../fixtures/leads';
import { MOCK_USERS_LIST } from '../fixtures/users';

function createSeededQueryClient(): QueryClient {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  const primaryDealer = MOCK_DEALERS[0];
  const spId = primaryDealer.id;

  // Pre-seed common query keys
  queryClient.setQueryData(['servicesProvider', spId], primaryDealer);
  queryClient.setQueryData(['servicesProviders'], MOCK_DEALERS);
  queryClient.setQueryData(['inventory', spId], MOCK_VEHICLES);
  queryClient.setQueryData(['orders', spId], MOCK_ORDERS);
  queryClient.setQueryData(['leads', spId], MOCK_LEADS);
  queryClient.setQueryData(['team', spId], MOCK_USERS_LIST);

  return queryClient;
}

interface MockQueryProviderProps {
  children: ReactNode;
}

export function MockQueryProvider({ children }: MockQueryProviderProps): ReactNode {
  const queryClient = useMemo(() => createSeededQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
