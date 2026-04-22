/**
 * MSW browser worker setup.
 * Intercepts HTTP requests in the browser and returns mock data,
 * allowing production React Query hooks and API services to work as-is.
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
