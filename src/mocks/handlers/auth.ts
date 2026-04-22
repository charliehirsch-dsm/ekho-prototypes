/**
 * MSW handlers for auth endpoints.
 * Intercepts /admin_portal/auth/* requests.
 */

import { http, HttpResponse } from 'msw';
import { MOCK_ME_RESPONSE } from '../data/auth';

export const authHandlers = [
  // GET /admin_portal/auth/me
  http.get('*/admin_portal/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: MOCK_ME_RESPONSE,
    });
  }),

  // GET /admin_portal/auth/debug
  http.get('*/admin_portal/auth/debug', () => {
    return HttpResponse.json({
      success: true,
      data: { environment: 'prototype', authMethod: 'mock' },
    });
  }),
];
