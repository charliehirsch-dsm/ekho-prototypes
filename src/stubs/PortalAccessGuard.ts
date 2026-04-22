/**
 * Stub: PortalAccessGuard
 *
 * In production, checks auth state, onboarding status, and MFA before
 * allowing portal access. In the prototype, always renders children.
 */

import type { ReactNode } from 'react';

function PortalAccessGuard({ children }: { children: ReactNode }): ReactNode {
  return children;
}

export { PortalAccessGuard };
export default PortalAccessGuard;
