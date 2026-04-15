/**
 * MockAuthProvider: Provides fake auth state to any shell.
 * Wraps children with the same context shape that AuthSessionWrapper provides in production.
 */

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'dealer_admin' | 'dealer_user' | 'buyer' | 'ops_admin' | 'superadmin';
}

export const MOCK_USERS: Record<string, MockUser> = {
  dealer_admin: {
    uid: 'mock-dealer-001',
    email: 'admin@mockdealer.com',
    displayName: 'Mike Thompson',
    role: 'dealer_admin',
  },
  dealer_user: {
    uid: 'mock-dealer-002',
    email: 'sales@mockdealer.com',
    displayName: 'Jane Rodriguez',
    role: 'dealer_user',
  },
  buyer: {
    uid: 'mock-buyer-001',
    email: 'sarah@example.com',
    displayName: 'Sarah Johnson',
    role: 'buyer',
  },
  ops_admin: {
    uid: 'mock-ops-001',
    email: 'ops@ekho.com',
    displayName: 'Ops User',
    role: 'ops_admin',
  },
  superadmin: {
    uid: 'mock-super-001',
    email: 'super@ekho.com',
    displayName: 'Super Admin',
    role: 'superadmin',
  },
};

interface AuthContextValue {
  user: MockUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  setRole: () => {},
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

interface MockAuthProviderProps {
  children: ReactNode;
  initialRole?: string;
}

export function MockAuthProvider({ children, initialRole = 'dealer_admin' }: MockAuthProviderProps): ReactNode {
  const [role, setRole] = useState(initialRole);
  const user = MOCK_USERS[role] ?? MOCK_USERS.dealer_admin;

  const value: AuthContextValue = {
    user,
    isLoading: false,
    isAuthenticated: true,
    setRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
