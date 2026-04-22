/**
 * MockAuthBootstrap
 *
 * Replaces AuthSessionWrapper in the prototype. Pre-populates Jotai auth atoms
 * with mock state and provides AuthContext so useAuth() and useAuthContext()
 * both work correctly with production components.
 *
 * The real apiClient is used, MSW intercepts its HTTP requests.
 */

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import type { ReactNode } from 'react';

import {
  accessTokenAtom,
  isAuthenticatedAtom,
  isAuthLoadingAtom,
  meAtom,
  userAtom,
} from '@ekhodealer/ekho-common/auth-client/atoms/authAtoms';
import { AuthContext } from '@ekhodealer/ekho-common/auth-client/providers/AuthContext';

import { apiClient } from '@config/server/apiClient';
import { queryClient } from '@config/server/queryClient';

import { MOCK_ME_RESPONSE, MOCK_FIREBASE_USER } from '../mocks/data/auth';

/**
 * Pre-populate Jotai auth atoms so useAuth() returns valid state.
 */
function AuthAtomSeeder(): null {
  const setUser = useSetAtom(userAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setMe = useSetAtom(meAtom);
  const setLoading = useSetAtom(isAuthLoadingAtom);

  useEffect(() => {
    setUser(MOCK_FIREBASE_USER);
    setAccessToken('mock-token');
    setIsAuthenticated(true);
    setMe(MOCK_ME_RESPONSE);
    setLoading(false);
  }, [setUser, setAccessToken, setIsAuthenticated, setMe, setLoading]);

  return null;
}

// Minimal mock services that satisfy the AuthContext interface
const mockAuthService = {
  onAuthStateChanged: () => () => {},
  signIn: () => Promise.reject(new Error('Sign-in disabled in prototype')),
  signInWithCustomToken: () => Promise.reject(new Error('Sign-in disabled in prototype')),
  signOut: () => Promise.resolve(),
  getCurrentUserToken: () => Promise.resolve('mock-token'),
  isMfaRequiredResponse: () => false,
} as never;

const mockMfaSmsService = {} as never;

const mockAuth = {
  currentUser: MOCK_FIREBASE_USER,
  app: { name: '[PROTOTYPE]', options: {} },
} as never;

const contextValue = {
  auth: mockAuth,
  apiClient,
  queryClient,
  queryKeys: {
    me: ['auth', 'me'],
    debug: ['auth', 'debug'],
  },
  authService: mockAuthService,
  mfaSmsService: mockMfaSmsService,
};

export function MockAuthSessionWrapper({ children }: { children: ReactNode }): ReactNode {
  return (
    <AuthContext.Provider value={contextValue}>
      <AuthAtomSeeder />
      {children}
    </AuthContext.Provider>
  );
}
