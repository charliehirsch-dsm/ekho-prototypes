/**
 * MSW handlers for Carthage-specific API endpoints.
 *
 * Intercepts:
 * - POST /carthage/listings/search (SRP search)
 * - POST /carthage/listings/query-suggestions (spotlight search)
 * - GET  /carthage/listings/:id/accessories (listing accessories)
 * - GET  /carthage/listings/:id (VDP individual listing)
 * - GET  /servicesProviders/:id (services provider fetch, shared by all Carthage hooks)
 */

import { http, HttpResponse } from 'msw';

import { MOCK_SEARCH_LISTINGS, MOCK_FACETS, buildMockListingDetail } from '../data/listings';
import { MOCK_PROGRAM_OWNER, MOCK_DOMAIN_SP } from '../data/domainConfig';

/** Reusable response wrappers matching Carthage's ApiResponse<T> shape */
const ok = <T>(data: T) => HttpResponse.json({ success: true, data });

export const carthageHandlers = [
  // POST /carthage/listings/search — SRP search with pagination and facets
  http.post('*/carthage/listings/search', async ({ request }) => {
    const body = (await request.json()) as { query?: string; limit?: number; page?: number; facets?: string[] };
    const limit = body?.limit ?? 20;
    const page = body?.page ?? 0;

    // Simple text filter on query
    let filtered = MOCK_SEARCH_LISTINGS;
    if (body?.query) {
      const q = body.query.toLowerCase();
      filtered = MOCK_SEARCH_LISTINGS.filter(
        (l) =>
          l.make.toLowerCase().includes(q) ||
          l.model.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q),
      );
    }

    const start = page * limit;
    const pageData = limit === 0 ? [] : filtered.slice(start, start + limit);

    // Return PaginatedResponse<InventoryItemSearchRecord> shape
    // (useSearchListings expects { data, count, hasMore, ... }, not Algolia's { hits, nbHits })
    return ok({
      object: 'list',
      data: pageData,
      count: filtered.length,
      hasMore: start + (limit || 0) < filtered.length,
      nextCursor: null,
      facets: body?.facets ? MOCK_FACETS : undefined,
    });
  }),

  // POST /carthage/listings/query-suggestions — spotlight autocomplete
  http.post('*/carthage/listings/query-suggestions', async ({ request }) => {
    const body = (await request.json()) as { query?: string };
    const q = (body?.query ?? '').toLowerCase();

    const uniqueMakes = [...new Set(MOCK_SEARCH_LISTINGS.map((l) => l.make))];
    const uniqueModels = [...new Set(MOCK_SEARCH_LISTINGS.map((l) => `${l.make} ${l.model}`))];
    const suggestions = [...uniqueMakes, ...uniqueModels]
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 10)
      .map((query, i) => ({ query, objectID: `suggestion-${i}`, popularity: 100 - i }));

    return ok(suggestions);
  }),

  // GET /carthage/listings/:id/accessories — listing accessories for VDP
  // Must be registered BEFORE the :id handler so MSW matches the longer path first
  http.get('*/carthage/listings/:id/accessories', () => {
    return ok([]);
  }),

  // GET /carthage/listings/:id — individual listing for VDP
  http.get('*/carthage/listings/:id', ({ params }) => {
    const detail = buildMockListingDetail(params.id as string);
    if (!detail) {
      return HttpResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 },
      );
    }
    return ok(detail);
  }),

  // GET /servicesProviders/:id — used by useGetServicesProvider for both
  // program owner and domain services provider fetches.
  // Guard: skip Vite module requests (/@fs/...) that happen to contain
  // "servicesProviders" in the file path (e.g. atom files).
  http.get('*/servicesProviders/:id', ({ request, params }) => {
    const url = request.url;
    if (url.includes('/@fs/') || url.includes('/@vite/') || url.endsWith('.ts') || url.endsWith('.tsx')) {
      return;
    }
    const id = params.id as string;
    if (id === MOCK_PROGRAM_OWNER.id) return ok(MOCK_PROGRAM_OWNER);
    if (id === MOCK_DOMAIN_SP.id) return ok(MOCK_DOMAIN_SP);
    // Fallback: return the domain SP for any unknown ID
    return ok({ ...MOCK_DOMAIN_SP, id });
  }),
];
