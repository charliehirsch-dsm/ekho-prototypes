/**
 * Mock dealer / services provider data.
 */

export interface MockDealer {
  id: string;
  name: string;
  legalName: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  website: string;
  logoUrl: string;
  tier: 'starter' | 'growth' | 'enterprise';
  features: string[];
  accessoriesFeatureEnabled: boolean;
  createdAt: string;
}

export const MOCK_DEALERS: MockDealer[] = [
  {
    id: 'sp-thunder-001',
    name: 'Thunder Powersports',
    legalName: 'Thunder Powersports LLC',
    phone: '(512) 555-0142',
    email: 'info@thunderpowersports.com',
    address: {
      street: '2847 Moto Lane',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
    website: 'https://thunderpowersports.com',
    logoUrl: '',
    tier: 'growth',
    features: ['website', 'checkout', 'financing', 'ai-sales-agent', 'accessories'],
    accessoriesFeatureEnabled: true,
    createdAt: '2025-06-15T00:00:00Z',
  },
  {
    id: 'sp-coastal-002',
    name: 'Coastal Golf Carts',
    legalName: 'Coastal Cart Co. Inc.',
    phone: '(843) 555-0198',
    email: 'sales@coastalgolfcarts.com',
    address: {
      street: '1200 Beach Blvd',
      city: 'Myrtle Beach',
      state: 'SC',
      zip: '29577',
    },
    website: 'https://coastalgolfcarts.com',
    logoUrl: '',
    tier: 'enterprise',
    features: ['website', 'checkout', 'financing', 'ai-sales-agent', 'accessories', 'preorders'],
    accessoriesFeatureEnabled: true,
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'sp-summit-003',
    name: 'Summit Moto',
    legalName: 'Summit Motorcycle Sales LLC',
    phone: '(303) 555-0165',
    email: 'hello@summitmoto.com',
    address: {
      street: '445 Mountain View Dr',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
    },
    website: 'https://summitmoto.com',
    logoUrl: '',
    tier: 'starter',
    features: ['website', 'checkout'],
    accessoriesFeatureEnabled: false,
    createdAt: '2026-01-10T00:00:00Z',
  },
];

export const PRIMARY_DEALER = MOCK_DEALERS[0];
export const PRIMARY_SP_ID = PRIMARY_DEALER.id;
