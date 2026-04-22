/**
 * Combined MSW request handlers.
 * Order matters: more specific handlers should come before catch-alls.
 */

import { authHandlers } from './auth';
import { servicesProviderHandlers } from './servicesProviders';
import { inventoryHandlers } from './inventory';
import { featureHandlers } from './features';
import { carthageHandlers } from './carthage';
import { catchAllHandlers } from './catchAll';

export const handlers = [
  ...authHandlers,
  ...servicesProviderHandlers,
  ...inventoryHandlers,
  ...featureHandlers,
  ...carthageHandlers,
  // Catch-all must be last to only match unhandled requests
  ...catchAllHandlers,
];
