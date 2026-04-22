/**
 * Catch-all MSW handler for unhandled admin_portal API requests.
 * Returns empty success responses instead of letting requests hit the network
 * and cause crashes via throwOnError in production React Query hooks.
 */

import { http, HttpResponse } from 'msw';

/** Skip Vite module requests that happen to match API path patterns */
function isViteModuleRequest(url: string): boolean {
  return url.includes('/@fs/') || url.includes('/@vite/') || url.includes('/node_modules/');
}

export const catchAllHandlers = [
  // Catch any GET to admin_portal that wasn't handled by specific handlers
  http.get('*/admin_portal/*', ({ request }) => {
    if (isViteModuleRequest(request.url)) return;
    console.warn('[MSW catch-all] Unhandled GET:', request.url);
    return HttpResponse.json({ success: true, data: {} });
  }),

  // Catch any POST to admin_portal that wasn't handled by specific handlers
  http.post('*/admin_portal/*', ({ request }) => {
    if (isViteModuleRequest(request.url)) return;
    console.warn('[MSW catch-all] Unhandled POST:', request.url);
    return HttpResponse.json({
      success: true,
      data: { object: 'list', data: [], hasMore: false, nextCursor: null, count: 0 },
    });
  }),

  // Catch any PATCH/PUT/DELETE to admin_portal
  http.patch('*/admin_portal/*', ({ request }) => {
    if (isViteModuleRequest(request.url)) return;
    console.warn('[MSW catch-all] Unhandled PATCH:', request.url);
    return HttpResponse.json({ success: true, data: {} });
  }),
  http.put('*/admin_portal/*', ({ request }) => {
    if (isViteModuleRequest(request.url)) return;
    console.warn('[MSW catch-all] Unhandled PUT:', request.url);
    return HttpResponse.json({ success: true, data: {} });
  }),
  http.delete('*/admin_portal/*', ({ request }) => {
    if (isViteModuleRequest(request.url)) return;
    console.warn('[MSW catch-all] Unhandled DELETE:', request.url);
    return HttpResponse.json({ success: true, data: {} });
  }),
];
