/**
 * Stub for Carthage @config/paths.
 *
 * In production, Carthage runs at the domain root so paths like '/listings/:id'
 * resolve correctly. In the prototype, Carthage is mounted under '/carthage/*'
 * so all paths need the '/carthage' prefix to stay within the Carthage shell.
 *
 * This covers both React Router navigate() and window.location.href assignments
 * (VehicleListingCard uses the latter for carousel clicks).
 */

const BASE = '/carthage';

export const paths = {
  externalRedirect: {
    path: `${BASE}/external`,
    getHref: (sourceUrl: string) => `${BASE}/external?sourceUrl=${encodeURIComponent(sourceUrl)}`,
  },

  externalInventoryIdRedirect: {
    path: `${BASE}/external/:externalId`,
    getHref: (externalId: string) => `${BASE}/external/${externalId}`,
  },

  searchResults: {
    path: `${BASE}/`,
    getHref: () => `${BASE}/`,
  },

  vehicleDetails: {
    path: `${BASE}/listings/:id`,
    getHref: (id: string) => `${BASE}/listings/${id}`,
  },

  checkout: {
    path: `${BASE}/checkout`,
    getHref: () => `${BASE}/checkout`,
  },

  account: {
    path: `${BASE}/account`,
    getHref: () => `${BASE}/account`,
  },

  notFound: {
    path: '*',
    getHref: () => `${BASE}/404`,
  },
} as const;
