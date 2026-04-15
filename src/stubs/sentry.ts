/**
 * Sentry stub: no-op replacements for @sentry/react.
 * All apps init Sentry on startup; this prevents errors in sandbox mode.
 */

import type { ComponentType, ReactNode } from 'react';

export function init(): void {}
export function captureException(): void {}
export function captureMessage(): void {}
export function setUser(): void {}
export function setTag(): void {}
export function setExtra(): void {}
export function addBreadcrumb(): void {}
export function withScope(callback: (scope: unknown) => void): void {
  callback({});
}

// Passthrough wrapper for createBrowserRouter
export function wrapCreateBrowserRouterV7<T>(fn: T): T {
  return fn;
}

// ErrorBoundary passthrough
export function ErrorBoundary({ children }: { children: ReactNode; fallback?: ReactNode }): ReactNode {
  return children;
}

export function withSentryReactRouterV7Routing<T extends ComponentType>(component: T): T {
  return component;
}
