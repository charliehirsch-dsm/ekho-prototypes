/**
 * Firebase stub: no-op replacements for firebase/app, firebase/auth, firebase/firestore.
 * Prevents Firebase initialization in sandbox mode.
 */

// firebase/app
export function initializeApp(): Record<string, unknown> {
  return { name: '[SANDBOX]', options: {} };
}
export function getApp(): Record<string, unknown> {
  return { name: '[SANDBOX]', options: {} };
}

// firebase/auth
const mockUser = {
  uid: 'mock-user-001',
  email: 'admin@mockdealer.com',
  displayName: 'Mike Thompson',
  emailVerified: true,
  getIdToken: async () => 'mock-id-token',
  getIdTokenResult: async () => ({
    token: 'mock-id-token',
    claims: { role: 'dealer_admin' },
  }),
};

export function getAuth(): Record<string, unknown> {
  return { currentUser: mockUser, app: getApp() };
}

export function onAuthStateChanged(
  _auth: unknown,
  callback: (user: typeof mockUser | null) => void,
): () => void {
  callback(mockUser);
  return () => {};
}

export function signInWithEmailAndPassword(): Promise<{ user: typeof mockUser }> {
  return Promise.resolve({ user: mockUser });
}
export function signOut(): Promise<void> {
  return Promise.resolve();
}
export function sendPasswordResetEmail(): Promise<void> {
  return Promise.resolve();
}
export function confirmPasswordReset(): Promise<void> {
  return Promise.resolve();
}
export function applyActionCode(): Promise<void> {
  return Promise.resolve();
}
export function verifyPasswordResetCode(): Promise<string> {
  return Promise.resolve('mock@email.com');
}

// firebase/firestore
export function getFirestore(): Record<string, unknown> {
  return {};
}
export function collection(): Record<string, unknown> {
  return {};
}
export function doc(): Record<string, unknown> {
  return {};
}
export function onSnapshot(): () => void {
  return () => {};
}
