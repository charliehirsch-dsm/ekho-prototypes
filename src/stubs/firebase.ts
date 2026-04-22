/**
 * Firebase stub: no-op replacements for firebase/app, firebase/auth,
 * firebase/firestore, and firebase/storage.
 * Prevents Firebase initialization in prototype mode.
 */

// firebase/app
export function initializeApp(): Record<string, unknown> {
  return { name: '[PROTOTYPE]', options: {} };
}
export function getApp(): Record<string, unknown> {
  return { name: '[PROTOTYPE]', options: {} };
}
export function getApps(): Record<string, unknown>[] {
  return [getApp()];
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
  multiFactor: { enrolledFactors: [{ factorId: 'phone' }] },
};

export function getAuth(): Record<string, unknown> {
  return { currentUser: mockUser, app: getApp() };
}

export function onAuthStateChanged(
  _auth: unknown,
  callback: (user: typeof mockUser | null) => void,
): () => void {
  // Immediately call with mock user
  setTimeout(() => callback(mockUser), 0);
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

// Multi-factor auth stubs
export class PhoneMultiFactorGenerator {
  static FACTOR_ID = 'phone';
  static assertion(): Record<string, unknown> {
    return {};
  }
}
export class PhoneAuthProvider {
  static PROVIDER_ID = 'phone';
  static credential(): Record<string, unknown> {
    return {};
  }
  verifyPhoneNumber(): Promise<string> {
    return Promise.resolve('mock-verification-id');
  }
}
export function multiFactor(): Record<string, unknown> {
  return {
    enrolledFactors: [],
    getSession: () => Promise.resolve({}),
    enroll: () => Promise.resolve(),
  };
}
export function getMultiFactorResolver(): Record<string, unknown> {
  return { hints: [], session: {} };
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

// firebase/auth — additional stubs
export class EmailAuthProvider {
  static PROVIDER_ID = 'password';
  static credential(): Record<string, unknown> {
    return {};
  }
}
export class RecaptchaVerifier {
  constructor() {}
  render(): Promise<number> { return Promise.resolve(0); }
  verify(): Promise<string> { return Promise.resolve('mock-recaptcha-token'); }
  clear(): void {}
}
export function signInWithCustomToken(): Promise<{ user: typeof mockUser }> {
  return Promise.resolve({ user: mockUser });
}
export function reauthenticateWithCredential(): Promise<{ user: typeof mockUser }> {
  return Promise.resolve({ user: mockUser });
}
export function updatePassword(): Promise<void> {
  return Promise.resolve();
}

// firebase/storage
export function getStorage(): Record<string, unknown> {
  return {};
}
export function ref(): Record<string, unknown> {
  return {};
}
export function uploadBytes(): Promise<Record<string, unknown>> {
  return Promise.resolve({ ref: {} });
}
export function uploadBytesResumable(): Record<string, unknown> {
  return {
    ref: {},
    snapshot: { bytesTransferred: 0, totalBytes: 0, state: 'success' },
    on: (): void => {},
    cancel: (): boolean => true,
    pause: (): boolean => true,
    resume: (): boolean => true,
  };
}
export function getDownloadURL(): Promise<string> {
  return Promise.resolve('https://mock-storage.example.com/file');
}
