/**
 * Stub: @config/firebase
 *
 * Production exports `auth` and `storage` from Firebase config.
 * In the prototype, these are no-ops since MSW handles all network requests
 * and the firebase/auth module is already stubbed.
 */

import { getAuth } from 'firebase/auth';

// Our firebase/auth stub returns a mock auth object
export const auth = getAuth();

// Storage stub
export const storage = {};

export default {};
