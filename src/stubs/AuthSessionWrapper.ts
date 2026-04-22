/**
 * Stub: AuthSessionWrapper
 *
 * In production, this wraps children with AuthSessionProvider (Firebase auth
 * listener + /me endpoint). In the prototype, we skip Firebase entirely and
 * let MSW handle the /me response. The auth atoms are pre-populated by
 * MockAuthBootstrap so useAuth() returns mock state immediately.
 *
 * This is a pass-through: it renders children without any auth provider.
 * The Jotai atoms and AuthContext are set up in MockAuthBootstrap instead.
 */

export { MockAuthSessionWrapper as AuthSessionWrapper } from './MockAuthBootstrap';
