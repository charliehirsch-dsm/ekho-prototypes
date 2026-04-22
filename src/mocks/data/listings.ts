/**
 * Mock listing data for Carthage SRP/VDP prototyping.
 *
 * Search results use a flattened shape (as returned by the search API),
 * while individual listing fetches return the full ListingInterface shape.
 *
 * All fields are populated to satisfy VDP sub-component data needs:
 * - VehicleDetailsTitle: fullName, matching.status, vehicleCategory, fuelType, newUsed
 * - VehicleDetailsGallery: imageUrls, listing.status, pricing (for ListingTag)
 * - VehicleDetailsKeyFacts: odometerReading/Unit, inventoryOwnerAddress, canonVehicle
 * - VehicleDetailsPayment: pricing (all fields), canonVehicle.vehicleType
 * - VehicleDetailsKeySpecs: prioritizedSpecs
 * - VehicleDetailsRecalls: recalls
 * - VehicleDetailsIncludedUpgrades: includedUpgrades
 */

const PLACEHOLDER_IMAGE = 'https://placehold.co/800x600/f0f0f0/666?text=Vehicle';

/**
 * Per-vehicle data that differs between listings.
 * Keeps the search record array DRY while still supporting the full detail shape.
 */
interface VehicleData {
  id: string;
  make: string;
  model: string;
  modelYear: number;
  fullName: string;
  vehicleCategory: string;
  newUsed: 'N' | 'U';
  vin: string;
  stockNumber: string;
  fuelType: string;
  transmission: string;
  color: string;
  baseColor: string;
  engineDisplacement: number;
  odometerReading: number;
  advertisedPrice: number;
  dealerRetailPrice: number;
  description: string;
}

const VEHICLES: VehicleData[] = [
  {
    id: 'listing-001',
    make: 'Kawasaki',
    model: 'KLR 650',
    modelYear: 2025,
    fullName: '2025 Kawasaki KLR 650',
    vehicleCategory: 'motorcycle',
    newUsed: 'N',
    vin: '1KWSC65025A001234',
    stockNumber: 'KAW-2025-001',
    fuelType: 'Gas',
    transmission: '6-Speed Manual',
    color: 'Green',
    baseColor: 'Green',
    engineDisplacement: 649,
    odometerReading: 0,
    advertisedPrice: 7299,
    dealerRetailPrice: 7299,
    description: 'The KLR 650 is a versatile dual-sport motorcycle ready for any adventure.',
  },
  {
    id: 'listing-002',
    make: 'Honda',
    model: 'CRF300L',
    modelYear: 2025,
    fullName: '2025 Honda CRF300L',
    vehicleCategory: 'motorcycle',
    newUsed: 'N',
    vin: '1HNCRF30025A002345',
    stockNumber: 'HON-2025-002',
    fuelType: 'Gas',
    transmission: '6-Speed Manual',
    color: 'Red',
    baseColor: 'Red',
    engineDisplacement: 286,
    odometerReading: 0,
    advertisedPrice: 5549,
    dealerRetailPrice: 5549,
    description: 'Lightweight dual-sport with excellent fuel economy.',
  },
  {
    id: 'listing-003',
    make: 'Yamaha',
    model: 'MT-07',
    modelYear: 2024,
    fullName: '2024 Yamaha MT-07',
    vehicleCategory: 'motorcycle',
    newUsed: 'U',
    vin: '1YMMT07024A003456',
    stockNumber: 'YAM-2024-003',
    fuelType: 'Gas',
    transmission: '6-Speed Manual',
    color: 'Matte Black',
    baseColor: 'Black',
    engineDisplacement: 689,
    odometerReading: 2340,
    advertisedPrice: 6199,
    dealerRetailPrice: 7899,
    description: 'Low-mileage naked sport bike. Great commuter and weekend rider.',
  },
  {
    id: 'listing-004',
    make: 'Can-Am',
    model: 'Maverick X3 RS Turbo RR',
    modelYear: 2025,
    fullName: '2025 Can-Am Maverick X3 RS Turbo RR',
    vehicleCategory: 'utv',
    newUsed: 'N',
    vin: '2BPMAX3025A004567',
    stockNumber: 'CAM-2025-004',
    fuelType: 'Gas',
    transmission: 'Automatic CVT',
    color: 'Carbon Black / Octane Blue',
    baseColor: 'Black',
    engineDisplacement: 900,
    odometerReading: 0,
    advertisedPrice: 30999,
    dealerRetailPrice: 30999,
    description: 'The most powerful side-by-side in its class. 200 HP turbo engine.',
  },
  {
    id: 'listing-005',
    make: 'Polaris',
    model: 'Sportsman 570',
    modelYear: 2025,
    fullName: '2025 Polaris Sportsman 570',
    vehicleCategory: 'atv',
    newUsed: 'N',
    vin: '4XASPT57025A005678',
    stockNumber: 'POL-2025-005',
    fuelType: 'Gas',
    transmission: 'Automatic PVT',
    color: 'Sage Green',
    baseColor: 'Green',
    engineDisplacement: 567,
    odometerReading: 0,
    advertisedPrice: 7999,
    dealerRetailPrice: 7999,
    description: 'Best-selling ATV in its class. Legendary smooth ride and towing capacity.',
  },
  {
    id: 'listing-006',
    make: 'Suzuki',
    model: 'V-Strom 650XT',
    modelYear: 2024,
    fullName: '2024 Suzuki V-Strom 650XT',
    vehicleCategory: 'motorcycle',
    newUsed: 'U',
    vin: '1SVVS65024A006789',
    stockNumber: 'SUZ-2024-006',
    fuelType: 'Gas',
    transmission: '6-Speed Manual',
    color: 'Champion Yellow',
    baseColor: 'Yellow',
    engineDisplacement: 645,
    odometerReading: 5120,
    advertisedPrice: 7499,
    dealerRetailPrice: 9499,
    description: 'Well-maintained adventure tourer. Comes with side cases and crash bars.',
  },
];

/** Mock dealer address (used for location display and distance calc) */
const MOCK_DEALER_ADDRESS = {
  street: '1234 Thunder Rd',
  city: 'Austin',
  state: 'TX',
  zip: '78701',
  country: 'US',
};

/**
 * Search result records matching InventoryItemSearchRecord shape.
 * Used by both the SRP search endpoint and VDP's MoreFromUs section.
 */
export const MOCK_SEARCH_LISTINGS = VEHICLES.map((v) => ({
  objectID: v.id,
  id: v.id,
  ownerId: 'sp-thunder-domain-001',

  // Listing status (required by ListingTag)
  listing: {
    status: 'PUBLISHED' as const,
    lastPublished: Date.now() - 7 * 86400000,
  },
  isMarkedForOnlineSale: true,

  // Matching status
  matching: { status: 'MATCHED' as const },

  // Assignment status
  assignment: { status: 'available' as const },

  // Vehicle identity
  make: v.make,
  model: v.model,
  modelYear: v.modelYear,
  fullName: v.fullName,
  vehicleCategory: v.vehicleCategory,
  fuelType: v.fuelType,
  transmission: v.transmission,
  description: v.description,
  color: v.color,
  baseColor: v.baseColor,
  vin: v.vin,
  imageUrls: [PLACEHOLDER_IMAGE],

  // Condition and mileage
  newUsed: v.newUsed,
  odometerReading: v.odometerReading,
  odometerUnit: 'mi',

  // Pricing (must match ListingTag and VehicleListingCard expectations)
  pricing: {
    dealerRetailPrice: v.dealerRetailPrice,
    advertisedPrice: v.advertisedPrice,
    retailPrice: v.dealerRetailPrice,
    map: false,
    minMonthlyPayment: v.advertisedPrice > 10000 ? Math.round(v.advertisedPrice / 60) : undefined,
  },

  // Inventory details
  stockNumber: v.stockNumber,

  // Location
  inventoryOwnerAddress: MOCK_DEALER_ADDRESS,
  _geoloc: { lat: 30.2672, lng: -97.7431 },

  // Fulfillment
  fulfillmentOptions: ['delivery', 'pickup'] as ('delivery' | 'pickup')[],

  // Metrics (empty for prototype)
  metrics: {} as Record<string, number>,
}));

/** Facets for the search results (returned by the search API) */
export const MOCK_FACETS = {
  make: {
    Kawasaki: 1,
    Honda: 1,
    Yamaha: 1,
    'Can-Am': 1,
    Polaris: 1,
    Suzuki: 1,
  },
  vehicleCategory: {
    motorcycle: 4,
    utv: 1,
    atv: 1,
  },
  newUsed: {
    New: 4,
    Used: 2,
  },
  fuelType: {
    Gas: 6,
  },
  exteriorColor: {
    Green: 1,
    Red: 1,
    'Matte Black': 1,
    'Carbon Black / Octane Blue': 1,
    'Sage Green': 1,
    'Champion Yellow': 1,
  },
};

/**
 * Build vehicle specs record. Used both as canonVehicle.specs (full set for the
 * "View all specs" modal) and as the source for getPrioritizedSpecifications().
 * Returns a Record<string, VehicleSpec> matching the VehicleSpecs type.
 */
function buildVehicleSpecs(v: VehicleData) {
  const isMotorcycle = v.vehicleCategory === 'motorcycle';
  return {
    engineDisplacement: {
      id: 'engineDisplacement',
      title: 'Engine Displacement',
      dataType: 'NUMERICAL' as const,
      displayType: 'spec' as const,
      category: 'DRIVE_POWERTRAIN',
      value: v.engineDisplacement,
      unit: 'cc',
    },
    transmission: {
      id: 'transmission',
      title: 'Transmission',
      dataType: 'STRING' as const,
      displayType: 'spec' as const,
      category: 'DRIVE_POWERTRAIN',
      value: v.transmission,
    },
    fuelType: {
      id: 'fuelType',
      title: 'Fuel Type',
      dataType: 'STRING' as const,
      displayType: 'spec' as const,
      category: 'DRIVE_POWERTRAIN',
      value: v.fuelType,
    },
    driveTrain: {
      id: 'driveTrain',
      title: 'Drive Train',
      dataType: 'STRING' as const,
      displayType: 'spec' as const,
      category: 'DRIVE_POWERTRAIN',
      value: isMotorcycle ? 'Chain' : '4WD',
    },
    curbWeight: {
      id: 'curbWeight',
      title: 'Curb Weight',
      dataType: 'NUMERICAL' as const,
      displayType: 'spec' as const,
      category: 'DIMENSIONS',
      value: isMotorcycle ? 432 : 1650,
      unit: 'lbs',
    },
    seatHeight: {
      id: 'seatHeight',
      title: isMotorcycle ? 'Seat Height' : 'Ground Clearance',
      dataType: 'NUMERICAL' as const,
      displayType: 'spec' as const,
      category: 'DIMENSIONS',
      value: isMotorcycle ? 33.5 : 13,
      unit: 'in',
    },
  };
}

/**
 * Full listing detail (returned by GET /carthage/listings/:id).
 * Matches the ListingInterface shape expected by all VDP sub-components.
 */
export function buildMockListingDetail(listingId: string) {
  const v = VEHICLES.find((vehicle) => vehicle.id === listingId);
  if (!v) return null;

  return {
    // Core identity
    id: v.id,
    ownerId: 'sp-thunder-domain-001',

    // Listing status (required by Gallery's ListingTag)
    listing: {
      status: 'PUBLISHED',
      lastPublished: Date.now() - 7 * 86400000,
    },

    // Matching status (required by VehicleDetailsTitle for display name logic)
    matching: {
      status: 'MATCHED',
    },

    // Assignment status
    assignment: {
      status: 'available',
    },

    // Online sale flag
    isMarkedForOnlineSale: true,

    // Vehicle identity (required by VehicleDetailsTitle)
    make: v.make,
    model: v.model,
    modelYear: v.modelYear,
    fullName: v.fullName,
    vehicleCategory: v.vehicleCategory,
    fuelType: v.fuelType,
    transmission: v.transmission,

    // Condition (required by multiple components, uses enum values 'N'/'U')
    newUsed: v.newUsed,

    // VIN and stock (required by analytics tracking)
    vin: v.vin,
    stockNumber: v.stockNumber,

    // Color (required by ListingInterface)
    color: v.color,
    baseColor: v.baseColor,

    // Odometer (required by VehicleDetailsKeyFacts)
    odometerReading: v.odometerReading,
    odometerUnit: 'mi',

    // Pricing (required by VehicleDetailsPayment)
    pricing: {
      dealerRetailPrice: v.dealerRetailPrice,
      advertisedPrice: v.advertisedPrice,
      retailPrice: v.dealerRetailPrice,
      map: false,
      minMonthlyPayment: v.advertisedPrice > 10000 ? Math.round(v.advertisedPrice / 60) : undefined,
    },

    // Gallery images (required by VehicleDetailsGallery)
    imageUrls: [
      PLACEHOLDER_IMAGE,
      'https://placehold.co/800x600/e8e8e8/666?text=Side+View',
      'https://placehold.co/800x600/e0e0e0/666?text=Rear+View',
      'https://placehold.co/800x600/d8d8d8/666?text=Detail+1',
    ],

    // Geolocation (required by ListingInterface)
    _geoloc: { lat: 30.2672, lng: -97.7431 },

    // Address (required by VehicleDetailsKeyFacts for location display)
    inventoryOwnerAddress: MOCK_DEALER_ADDRESS,

    // Canon vehicle (required by VehicleDetailsPayment for tax/delivery calcs,
    // and by useFeaturesSpecs for specs display via canonVehicle.specs)
    canonVehicle: {
      vehicleType: v.vehicleCategory,
      bodyType: v.vehicleCategory,
      make: v.make,
      model: v.model,
      modelYear: v.modelYear,
      specs: buildVehicleSpecs(v),
    },

    // Prioritized specs for VDP key specs section (top 6)
    prioritizedSpecs: buildVehicleSpecs(v),

    // Full specs (superset, used by some components directly)
    specs: buildVehicleSpecs(v),

    // Fulfillment options
    fulfillmentOptions: ['delivery', 'pickup'] as ('delivery' | 'pickup')[],

    // Recalls (empty = synced with no open recalls)
    recalls: {
      campaigns: [],
      lastSyncedAt: Date.now() - 30 * 86400000,
    },

    // Included upgrades (only for the used Yamaha MT-07 to show the section)
    includedUpgrades: v.id === 'listing-003'
      ? [
          {
            id: 'upgrade-001',
            source: 'DMS' as const,
            externalId: 'LP-001',
            name: 'Fender Eliminator Kit',
            description: 'Yoshimura fender eliminator with LED turn signals',
            price: 189,
            showOnVdp: true,
            media: [],
          },
          {
            id: 'upgrade-002',
            source: 'CUSTOM' as const,
            name: 'Frame Sliders',
            description: 'T-Rex Racing frame sliders for crash protection',
            price: 0,
            showOnVdp: true,
            media: [],
          },
        ]
      : v.id === 'listing-006'
        ? [
            {
              id: 'upgrade-003',
              source: 'DMS' as const,
              externalId: 'LP-003',
              name: 'Side Cases',
              description: 'Suzuki OEM aluminum side cases (35L each)',
              price: 899,
              showOnVdp: true,
              media: [],
            },
            {
              id: 'upgrade-004',
              source: 'DMS' as const,
              externalId: 'LP-004',
              name: 'Crash Bars',
              description: 'SW-Motech engine guards',
              price: 299,
              showOnVdp: true,
              media: [],
            },
          ]
        : [],

    // Cosmetic report (only for used vehicles)
    cosmeticReport: v.newUsed === 'U'
      ? {
          conditionSummary: 'Good condition with minor cosmetic wear consistent with mileage.',
          blemishes: [],
          updatedAt: Date.now() - 14 * 86400000,
        }
      : undefined,

    // Dealer warranty (empty for prototype)
    dealerWarranty: undefined,
  };
}
