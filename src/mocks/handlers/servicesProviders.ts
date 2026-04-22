/**
 * MSW handlers for services provider endpoints.
 * Intercepts /admin_portal/:spId/configuration/* and batch endpoints.
 */

import { http, HttpResponse } from 'msw';
import { MOCK_SP, MOCK_SP_LIST } from '../data/servicesProvider';

/** Reusable empty-success response */
const ok = (data: unknown = {}) =>
  HttpResponse.json({ success: true, data });

export const servicesProviderHandlers = [
  // GET /admin_portal/:spId/configuration/details
  http.get('*/admin_portal/:spId/configuration/details', ({ params }) => {
    const sp = MOCK_SP_LIST.find((s) => s.id === params.spId) ?? MOCK_SP;
    return ok(sp);
  }),

  // POST /admin_portal/configuration/batch-details
  http.post('*/admin_portal/configuration/batch-details', () =>
    ok({ servicesProviders: MOCK_SP_LIST, failedIds: [] }),
  ),

  // GET /admin_portal/me/services-providers
  http.get('*/admin_portal/me/services-providers', () => ok(MOCK_SP_LIST)),

  // ---------------------------------------------------------------
  // Configuration sub-endpoints (settings pages)
  // ---------------------------------------------------------------

  // GET /configuration — bare (some hooks hit this without /details)
  http.get('*/admin_portal/:spId/configuration', ({ params }) => {
    const sp = MOCK_SP_LIST.find((s) => s.id === params.spId) ?? MOCK_SP;
    return ok(sp);
  }),

  // Business details
  http.patch('*/admin_portal/:spId/configuration/business-details', () => ok()),

  // Banking / Bank Account
  http.get('*/admin_portal/:spId/configuration/banking/bank-accounts', () =>
    ok([
      {
        id: 'ba-001',
        bankName: 'Chase Business',
        accountName: 'Thunder Powersports Operating',
        accountType: 'checking',
        last4: '4567',
        isPrimary: true,
        status: 'verified',
        createdAt: Date.now() - 90 * 86400000,
      },
    ]),
  ),
  http.post('*/admin_portal/:spId/configuration/banking/create-link-token', () =>
    ok({ linkToken: 'mock-link-token-xxx' }),
  ),
  http.post('*/admin_portal/:spId/configuration/banking/create-bank-accounts-from-plaid-data', () =>
    ok({ created: 1 }),
  ),
  http.post('*/admin_portal/:spId/configuration/banking/set-primary-bank-account/:bankAccountId', () =>
    ok(),
  ),

  // Sale / Checkout configuration
  http.patch('*/admin_portal/:spId/configuration/sale', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/program/checkout/assignment', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/program/checkout/fulfillment', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/program/checkout/payment', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/program/checkout/states-supported', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/program/checkout/disclosures', () => ok()),

  // Preorder configuration
  http.patch('*/admin_portal/:spId/configuration/program/preorder', () => ok()),

  // Titling, registration, pickup, inspection, freight, delivery, assembly
  http.patch('*/admin_portal/:spId/configuration/titling', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/registration', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/pickup', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/inspection', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/freight', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/delivery', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/assembly', () => ok()),

  // Inventory settings
  http.get('*/admin_portal/:spId/configuration/inventory/scraper', () =>
    ok({ scrapingUrl: '', enabled: false }),
  ),
  http.post('*/admin_portal/:spId/configuration/inventory/scraper', () => ok()),
  http.get('*/admin_portal/:spId/configuration/inventory/field-group-precedence', () =>
    ok({ groups: [] }),
  ),
  http.post('*/admin_portal/:spId/configuration/inventory/field-group-precedence', () => ok()),
  http.get('*/admin_portal/:spId/configuration/inventory/dms-connection', () =>
    ok({ provider: 'lightspeed', status: 'connected' }),
  ),
  http.post('*/admin_portal/:spId/configuration/inventory/dms-connection', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/inventory/general-config', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/inventory/as-is-disclaimer', () => ok()),

  // BDC (Sales Agent) configuration
  http.patch('*/admin_portal/:spId/configuration/bdc', () => ok()),
  http.get('*/admin_portal/:spId/configuration/bdc', () =>
    ok({
      persona: 'friendly',
      greeting: 'Hi! How can I help you today?',
      scheduling: { enabled: false },
    }),
  ),

  // Website / Domains configuration
  http.patch('*/admin_portal/:spId/configuration/domains-vdp-config', () => ok()),
  http.patch('*/admin_portal/:spId/configuration/domains-cta-config', () => ok()),

  // Google Place integration
  http.post('*/admin_portal/:spId/configuration/google-place-search', () => ok([])),
  http.patch('*/admin_portal/:spId/configuration/google-place-integration', () => ok()),

  // Onboarding
  http.post('*/admin_portal/:spId/configuration/onboarding/update-page', () => ok()),

  // ---------------------------------------------------------------
  // Personal settings (auth/me endpoints)
  // ---------------------------------------------------------------
  http.get('*/admin_portal/me', () =>
    ok({
      id: 'user-001',
      email: 'mike@thunderpowersports.com',
      firstName: 'Mike',
      lastName: 'Thompson',
      phone: '(555) 867-5309',
      role: 'owner',
      createdAt: Date.now() - 365 * 86400000,
    }),
  ),
  http.patch('*/admin_portal/me', () => ok()),

  // ---------------------------------------------------------------
  // Integrations (CRM forwarding, etc.)
  // ---------------------------------------------------------------
  http.get('*/admin_portal/:spId/integrations', () => ok([])),
  http.get('*/admin_portal/:spId/crm-forwarding', () =>
    ok({ enabled: false, provider: null, config: {} }),
  ),
  http.patch('*/admin_portal/:spId/crm-forwarding', () => ok()),

  // ---------------------------------------------------------------
  // Website pages
  // ---------------------------------------------------------------
  http.get('*/admin_portal/:spId/domains', () =>
    ok([
      {
        id: 'domain-001',
        domain: 'thunderpowersports.com',
        status: 'active',
        primary: true,
      },
    ]),
  ),
  http.get('*/admin_portal/:spId/website/pages', () => ok([])),
  http.get('*/admin_portal/:spId/website/config', () =>
    ok({
      theme: 'default',
      primaryColor: '#000000',
      favicon: '',
    }),
  ),
  http.patch('*/admin_portal/:spId/website/config', () => ok()),
];
