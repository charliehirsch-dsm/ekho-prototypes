/**
 * SandboxProviders: Combines all mock providers into a single wrapper.
 * Each shell wraps its content with this to get auth and data context.
 * Note: BrowserRouter is provided by main.tsx, not here.
 */

import type { ReactNode } from 'react';

import { MockAuthProvider } from './MockAuthProvider';
import { MockQueryProvider } from './MockQueryProvider';

interface SandboxProvidersProps {
  children: ReactNode;
  initialRole?: string;
}

export function SandboxProviders({ children, initialRole }: SandboxProvidersProps): ReactNode {
  return (
    <MockAuthProvider initialRole={initialRole}>
      <MockQueryProvider>
        {children}
      </MockQueryProvider>
    </MockAuthProvider>
  );
}
