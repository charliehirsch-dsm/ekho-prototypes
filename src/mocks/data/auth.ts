/**
 * Mock auth data for the prototype.
 * Used by MockAuthBootstrap to seed Jotai atoms and by MSW handlers
 * to respond to /me and batch-details endpoints.
 */

import { PRIMARY_SP_ID } from '../../sandbox/fixtures/dealers';

/**
 * Mock Firebase User object (matches the shape useAuth() expects from atoms)
 */
export const MOCK_FIREBASE_USER = {
  uid: 'mock-user-001',
  email: 'admin@mockdealer.com',
  displayName: 'Mike Thompson',
  emailVerified: true,
  getIdToken: async () => 'mock-id-token',
  getIdTokenResult: async () => ({
    token: 'mock-id-token',
    claims: { role: 'dealer_admin' },
  }),
  multiFactor: { enrolledFactors: [{ factorId: 'phone' }] },
} as never;

/**
 * Mock /me response (AdminGetMeResponse shape)
 */
export const MOCK_ME_RESPONSE = {
  uid: 'mock-user-001',
  userType: 'admin',
  email: 'admin@mockdealer.com',
  firstName: 'Mike',
  lastName: 'Thompson',
  phone: '(555) 867-5309',
  onboardingState: 'complete',
  canAccessAdminPortal: true,
  allowedServicesProviderIds: [PRIMARY_SP_ID],
  mfa: { enrolled: true, type: 'sms' },
};
