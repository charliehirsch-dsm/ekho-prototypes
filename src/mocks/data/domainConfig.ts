/**
 * Mock domain services provider data for Carthage prototyping.
 *
 * This matches the DomainServicesProviderData shape that Carthage's Jotai atoms
 * expect. It includes branding, links, support, and domain-specific config.
 */

import { PRIMARY_DEALER, PRIMARY_SP_ID } from '../../sandbox/fixtures/dealers';

/** Program owner services provider (the OEM or group that owns the website) */
export const MOCK_PROGRAM_OWNER = {
  id: PRIMARY_SP_ID,
  name: PRIMARY_DEALER.name,
  legalName: PRIMARY_DEALER.legalName,
  phone: PRIMARY_DEALER.phone,
  email: PRIMARY_DEALER.email,
  address: {
    street: PRIMARY_DEALER.address.street,
    city: PRIMARY_DEALER.address.city,
    state: PRIMARY_DEALER.address.state,
    zip: PRIMARY_DEALER.address.zip,
    country: 'US',
  },
  website: PRIMARY_DEALER.website,
  logoUrl: '',
  config: {
    program_owner: {
      supported: true,
      website: {
        domains: {
          'localhost:4100': 'sp-thunder-domain-001',
        },
      },
      checkout: {
        assignment: {},
        fulfillment: {},
        payment: {},
        paymentConfig: {
          LOAN_DOWNPAYMENT: true,
          CHECKOUT_FULL_PAYMENT: true,
          ACH_CHECKOUT_FULL_PAYMENT: true,
        },
        statesSupported: [],
        disclosures: [],
      },
      preorder: { supported: false },
    },
  },
};

/** Domain services provider (the specific dealer/rooftop shown on this domain) */
export const MOCK_DOMAIN_SP = {
  id: 'sp-thunder-domain-001',
  name: PRIMARY_DEALER.name,
  legalName: PRIMARY_DEALER.legalName,
  phone: PRIMARY_DEALER.phone,
  email: PRIMARY_DEALER.email,
  address: {
    street: PRIMARY_DEALER.address.street,
    city: PRIMARY_DEALER.address.city,
    state: PRIMARY_DEALER.address.state,
    zip: PRIMARY_DEALER.address.zip,
    country: 'US',
  },
  website: PRIMARY_DEALER.website,
  logoUrl: '',
  links: {
    aboutUs: '/about',
    locations: '/locations',
    privacyPolicy: '/privacy',
    termsOfService: '/terms',
    website: PRIMARY_DEALER.website,
    contact: '/contact',
  },
  branding: {
    logos: {
      darkFull: '',
      lightFull: '',
      darkIcon: '',
      lightIcon: '',
      favicon: '',
    },
    stylingMap: {
      brandColor: '#0d5bf2',
      brandColorLight: '#e8f0fe',
    },
  },
  support: {
    email: PRIMARY_DEALER.email,
    phone: PRIMARY_DEALER.phone,
    ekhoPhone: '(888) 555-0199',
    schedule: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
    },
  },
  physicalAddress: {
    street: PRIMARY_DEALER.address.street,
    city: PRIMARY_DEALER.address.city,
    state: PRIMARY_DEALER.address.state,
    zip: PRIMARY_DEALER.address.zip,
    country: 'US',
  },
  config: {
    domains: {
      carthage: {
        inventoryServicesProviderIds: ['sp-thunder-domain-001'],
        vehicleDetailsUrlPattern: '/listings/:id',
      },
    },
    coverage_fulfillment: {
      supported: true,
    },
    delivery: {
      supported: true,
    },
  },
};

export const MOCK_DOMAIN_SP_ID = MOCK_DOMAIN_SP.id;
