/**
 * Mock ServicesProvider data matching the production API response shape.
 * Used by MSW handlers for /admin_portal/:spId/configuration/details
 * and /admin_portal/configuration/batch-details.
 */

import { PRIMARY_DEALER, PRIMARY_SP_ID, MOCK_DEALERS } from '../../sandbox/fixtures/dealers';

/**
 * Builds a production-shaped ServicesProvider from our mock dealer data.
 * Includes the minimum fields that production components actually read.
 */
function buildMockServicesProvider(dealer: typeof PRIMARY_DEALER) {
  const hasSalesAgent = dealer.features.includes('ai-sales-agent');

  return {
    id: dealer.id,
    name: dealer.name,
    legalName: dealer.legalName,
    phone: dealer.phone,
    email: dealer.email,
    address: {
      street: dealer.address.street,
      city: dealer.address.city,
      state: dealer.address.state,
      zip: dealer.address.zip,
      country: 'US',
    },
    website: dealer.website,
    logoUrl: dealer.logoUrl || '',
    accessoriesFeatureEnabled: dealer.accessoriesFeatureEnabled,
    hasBdcStripeSubscription: hasSalesAgent,
    // serviceAccess controls navigation visibility (inventory, etc.)
    serviceAccess: {
      template: 'DEALER_SOLO_ROOFTOP',
      required: [
        'INVENTORY_DMS',
        'INVENTORY_SCRAPING',
        'INVENTORY_FIELD_PRECEDENCE',
        'INVENTORY_ADMIN_PORTAL',
        'INVENTORY_GENERAL',
      ],
      optional: [],
    },
    // Agents array (used by SaleServiceForm to find primary contract signer)
    agents: [
      {
        firstName: 'Mike',
        middleName: null,
        lastName: 'Thompson',
        email: 'mike@thunderpowersports.com',
        capacity: 'ADMIN',
      },
    ],
    // Config object for service-level feature checks
    // Keys must match Services enum values (lowercase): 'inventory', 'sale', etc.
    config: {
      inventory: {
        dmsConnectionConfig: {
          provider: 'lightspeed',
          status: 'connected',
        },
      },
      sale: {
        supported: true,
        licenseNumber: 'DLR-2024-001',
        pricing: [{ model: 'FLAT_FEE', modelDetails: { flatFee: 499 } }],
      },
      delivery: { supported: true, pricing: [] },
      pickup: { supported: true, pricing: [] },
      assembly: { supported: true, pricing: [] },
      inspection: { supported: true, pricing: [] },
      titling: { supported: true, pricing: [] },
      registration: { supported: true, pricing: [] },
      freight: { supported: true, pricing: [] },
      program_owner: {
        supported: true,
        checkout: {
          assignment: {},
          fulfillment: {},
          payment: {},
          statesSupported: [],
          disclosures: [],
        },
        preorder: { supported: false },
      },
      // BDC (Sales Agent) config
      ...(hasSalesAgent ? {
        bdc: {
          supported: true,
          knowledgeEnabled: true,
        },
      } : {}),
    },
    // Navigation visibility flags
    bdcEnabled: hasSalesAgent,
    preordersEnabled: dealer.features.includes('preorders'),
    // Subscription/plan info
    tier: dealer.tier,
    createdAt: dealer.createdAt,
  };
}

export const MOCK_SP = buildMockServicesProvider(PRIMARY_DEALER);

export const MOCK_SP_LIST = MOCK_DEALERS.map(buildMockServicesProvider);

export { PRIMARY_SP_ID };
