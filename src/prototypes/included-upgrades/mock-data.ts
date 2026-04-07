// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FieldSource = 'DMS' | 'EKHO';

export interface FieldSourceInfo {
  source: FieldSource;
  originalValue?: string | number;
}

export interface ModificationEntry {
  id: string;
  source: 'dms' | 'ekho';
  title: string;
  description: string;
  price: number;
  images: string[];
  brand?: string;
  partNumber?: string;
  // Per-field source tracking (for DMS-synced entries that have been overridden)
  fieldSources: {
    title: FieldSourceInfo;
    description: FieldSourceInfo;
    price: FieldSourceInfo;
    brand: FieldSourceInfo;
    partNumber: FieldSourceInfo;
    images: FieldSourceInfo;
  };
}

export interface VehicleModificationsData {
  vehicleId: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  vin: string;
  stock: string;
  condition: 'new' | 'used';
  modifications: ModificationEntry[];
  // Pricing
  dealerRetailPrice: number;
  advertisedPrice: number;
  retailPrice: number;
}

// ---------------------------------------------------------------------------
// Mock data: Vehicle with modifications (mix of DMS + manual)
// ---------------------------------------------------------------------------
export const VEHICLE_WITH_MODS: VehicleModificationsData = {
  vehicleId: 'inv-001',
  year: 2024,
  make: 'Yamaha',
  model: 'MT-07',
  trim: 'SP',
  vin: 'JYARN33E4PA012847',
  stock: 'YAM-2847',
  condition: 'used',
  modifications: [
    {
      id: 'mod-001',
      source: 'dms',
      title: 'Alpha T Full Exhaust System',
      brand: 'Yoshimura',
      description: 'Stainless steel full exhaust with carbon fiber end cap. Significant weight reduction and performance improvement.',
      price: 849.99,
      images: [],
      fieldSources: {
        title: { source: 'DMS', originalValue: 'Alpha T Full Exhaust System' },
        description: { source: 'EKHO', originalValue: 'Yoshimura exhaust system' },
        price: { source: 'DMS', originalValue: 849.99 },
        brand: { source: 'DMS', originalValue: 'Yoshimura' },
        partNumber: { source: 'DMS' },
        images: { source: 'EKHO' },
      },
    },
    {
      id: 'mod-002',
      source: 'dms',
      title: 'STX 36 Rear Shock',
      brand: 'Ohlins',
      description: 'Fully adjustable rear shock absorber. 36mm piston with progressive damping.',
      price: 599.00,
      images: [],
      fieldSources: {
        title: { source: 'DMS', originalValue: 'STX 36 Rear Shock' },
        description: { source: 'DMS', originalValue: 'Fully adjustable rear shock absorber. 36mm piston with progressive damping.' },
        price: { source: 'DMS', originalValue: 599.00 },
        brand: { source: 'DMS', originalValue: 'Ohlins' },
        partNumber: { source: 'DMS' },
        images: { source: 'DMS' },
      },
    },
    {
      id: 'mod-003',
      source: 'dms',
      title: 'D3 Rear Sprocket 48T',
      brand: 'Driven Racing',
      description: 'Lightweight aluminum rear sprocket for improved acceleration.',
      price: 0,
      images: [],
      partNumber: 'DRV-D3-48T',
      fieldSources: {
        title: { source: 'DMS', originalValue: 'D3 Rear Sprocket 48T' },
        description: { source: 'DMS', originalValue: 'Lightweight aluminum rear sprocket for improved acceleration.' },
        price: { source: 'DMS', originalValue: 0 },
        brand: { source: 'DMS', originalValue: 'Driven Racing' },
        partNumber: { source: 'DMS', originalValue: 'DRV-D3-48T' },
        images: { source: 'DMS' },
      },
    },
    {
      id: 'mod-004',
      source: 'ekho',
      title: 'Custom LED Tail Light',
      description: 'Integrated LED tail light with sequential turn signals. Plug-and-play installation.',
      price: 189.99,
      images: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=200&h=200&fit=crop',
      ],
      partNumber: 'LED-TL-MT07-24',
      fieldSources: {
        title: { source: 'EKHO' },
        description: { source: 'EKHO' },
        price: { source: 'EKHO' },
        brand: { source: 'EKHO' },
        partNumber: { source: 'EKHO' },
        images: { source: 'EKHO' },
      },
    },
    {
      id: 'mod-005',
      source: 'ekho',
      title: 'Frame Sliders',
      brand: 'Shogun',
      description: 'CNC machined frame sliders with replaceable pucks. Protects engine cases and bodywork in a slide.',
      price: 0,
      images: [],
      fieldSources: {
        title: { source: 'EKHO' },
        description: { source: 'EKHO' },
        price: { source: 'EKHO' },
        brand: { source: 'EKHO' },
        partNumber: { source: 'EKHO' },
        images: { source: 'EKHO' },
      },
    },
  ],
  dealerRetailPrice: 8999,
  advertisedPrice: 8499,
  retailPrice: 8499,
};

// ---------------------------------------------------------------------------
// Mock data: Vehicle with no modifications (empty state)
// ---------------------------------------------------------------------------
export const VEHICLE_NO_MODS: VehicleModificationsData = {
  vehicleId: 'inv-002',
  year: 2025,
  make: 'Honda',
  model: 'CRF300L',
  trim: '',
  vin: 'JH2MC52E6PK300192',
  stock: 'HON-0192',
  condition: 'new',
  modifications: [],
  dealerRetailPrice: 5499,
  advertisedPrice: 5199,
  retailPrice: 5199,
};

// ---------------------------------------------------------------------------
// Mock data: Vehicle with only DMS entries
// ---------------------------------------------------------------------------
export const VEHICLE_DMS_ONLY: VehicleModificationsData = {
  vehicleId: 'inv-003',
  year: 2024,
  make: 'Kawasaki',
  model: 'Z900',
  trim: 'SE',
  vin: 'JKBZXJC19PA045678',
  stock: 'KAW-5678',
  condition: 'used',
  modifications: [
    {
      id: 'mod-010',
      source: 'dms',
      title: 'Slip-On Exhaust',
      brand: 'Akrapovic',
      description: 'Titanium slip-on muffler. ECE approved with removable DB killer.',
      price: 649.99,
      images: [],
      partNumber: 'S-K9SO7-ASZT',
      fieldSources: {
        title: { source: 'DMS', originalValue: 'Slip-On Exhaust' },
        description: { source: 'DMS', originalValue: 'Titanium slip-on muffler. ECE approved with removable DB killer.' },
        price: { source: 'DMS', originalValue: 649.99 },
        brand: { source: 'DMS' },
        partNumber: { source: 'DMS', originalValue: 'S-K9SO7-ASZT' },
        images: { source: 'DMS' },
      },
    },
  ],
  dealerRetailPrice: 10499,
  advertisedPrice: 9999,
  retailPrice: 9999,
};
