/**
 * Stub: SessionDataGuard
 *
 * In production, blocks rendering until SP data is fetched.
 * In the prototype, MSW returns SP data immediately so this is a pass-through.
 */

import type { ReactNode } from 'react';

function SessionDataGuard({ children }: { children: ReactNode }): ReactNode {
  return children;
}

export { SessionDataGuard };
export default SessionDataGuard;
