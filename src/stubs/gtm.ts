/**
 * Google Tag Manager stub.
 * Ensures window.dataLayer exists as a no-op array.
 */

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).dataLayer = (window as unknown as Record<string, unknown>).dataLayer || [];
}

export {};
