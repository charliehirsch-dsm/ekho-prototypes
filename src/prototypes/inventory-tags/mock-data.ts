// ---------------------------------------------------------------------------
// Inventory Tag Types & Catalog
// ---------------------------------------------------------------------------

export type InventoryTagKey =
  | 'manager_special'
  | 'just_in'
  | 'clearance'
  | 'demo_unit'
  | 'limited_edition'
  | 'low_stock'
  | 'custom_build';

export interface InventoryTagDef {
  key: InventoryTagKey;
  label: string;
  description: string;
  icon: string; // Material Symbols icon name
  priority: number; // lower = higher priority for toolbar pill selection
}

export const INVENTORY_TAG_CATALOG: InventoryTagDef[] = [
  {
    key: 'manager_special',
    label: "Manager's Special",
    description: 'Dealer-endorsed unit with special pricing or value',
    icon: 'star',
    priority: 1,
  },
  {
    key: 'just_in',
    label: 'Just In',
    description: 'Recently arrived on the floor',
    icon: 'new_releases',
    priority: 2,
  },
  {
    key: 'clearance',
    label: 'Clearance',
    description: 'End-of-season or closeout pricing',
    icon: 'sell',
    priority: 3,
  },
  {
    key: 'demo_unit',
    label: 'Demo Unit',
    description: 'Test ride or demo model at a discount',
    icon: 'directions_bike',
    priority: 4,
  },
  {
    key: 'limited_edition',
    label: 'Limited Edition',
    description: 'Limited production run from the manufacturer',
    icon: 'diamond',
    priority: 5,
  },
  {
    key: 'low_stock',
    label: 'Low Stock',
    description: 'Only a few units remaining',
    icon: 'inventory',
    priority: 6,
  },
  {
    key: 'custom_build',
    label: 'Custom',
    description: 'Custom-built or modified unit',
    icon: 'build',
    priority: 7,
  },
];

export function getTagDef(key: InventoryTagKey): InventoryTagDef {
  return INVENTORY_TAG_CATALOG.find((t) => t.key === key)!;
}

// ---------------------------------------------------------------------------
// Applied tag on a vehicle
// ---------------------------------------------------------------------------

export interface InventoryTag {
  key: InventoryTagKey;
  appliedAt: string; // ISO date
}

// ---------------------------------------------------------------------------
// Vehicle listings for SRP demo
// ---------------------------------------------------------------------------

export interface VehicleListing {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  category: string;
  condition: 'New' | 'Used';
  mileage: number;
  location: string;
  msrp: number;
  price: number;
  savings: number;
  imageUrl: string; // placeholder color
  tags: InventoryTag[];
}

export const DEMO_VEHICLES: VehicleListing[] = [
  {
    id: 'v1',
    year: 2025,
    make: 'Honda',
    model: 'Grom',
    category: 'Motorcycle',
    condition: 'New',
    mileage: 1,
    location: 'Charlotte, NC',
    msrp: 3599,
    price: 2899,
    savings: 700,
    imageUrl: '#2d3748',
    tags: [
      { key: 'manager_special', appliedAt: '2026-03-28' },
      { key: 'low_stock', appliedAt: '2026-03-30' },
    ],
  },
  {
    id: 'v2',
    year: 2025,
    make: 'Kawasaki',
    model: 'KLX 300',
    category: 'Motorcycle',
    condition: 'New',
    mileage: 0,
    location: 'Charlotte, NC',
    msrp: 5899,
    price: 5899,
    savings: 0,
    imageUrl: '#1a365d',
    tags: [{ key: 'just_in', appliedAt: '2026-04-01' }],
  },
  {
    id: 'v3',
    year: 2024,
    make: 'Yamaha',
    model: 'MT-07',
    category: 'Motorcycle',
    condition: 'Used',
    mileage: 2340,
    location: 'Charlotte, NC',
    msrp: 8199,
    price: 6499,
    savings: 1700,
    imageUrl: '#2c5282',
    tags: [
      { key: 'clearance', appliedAt: '2026-03-15' },
      { key: 'demo_unit', appliedAt: '2026-02-10' },
    ],
  },
  {
    id: 'v4',
    year: 2025,
    make: 'Polaris',
    model: 'RZR XP 1000',
    trim: 'Ultimate',
    category: 'Side-by-Side',
    condition: 'New',
    mileage: 0,
    location: 'Charlotte, NC',
    msrp: 24999,
    price: 22999,
    savings: 2000,
    imageUrl: '#4a5568',
    tags: [{ key: 'limited_edition', appliedAt: '2026-03-20' }],
  },
  {
    id: 'v5',
    year: 2025,
    make: 'Can-Am',
    model: 'Maverick R',
    category: 'Side-by-Side',
    condition: 'New',
    mileage: 0,
    location: 'Charlotte, NC',
    msrp: 32499,
    price: 32499,
    savings: 0,
    imageUrl: '#553c9a',
    tags: [{ key: 'just_in', appliedAt: '2026-04-02' }],
  },
  {
    id: 'v6',
    year: 2023,
    make: 'Harley-Davidson',
    model: 'Street Glide',
    trim: 'Special',
    category: 'Motorcycle',
    condition: 'Used',
    mileage: 8420,
    location: 'Charlotte, NC',
    msrp: 27999,
    price: 21499,
    savings: 6500,
    imageUrl: '#1a202c',
    tags: [
      { key: 'manager_special', appliedAt: '2026-03-25' },
      { key: 'custom_build', appliedAt: '2026-03-25' },
    ],
  },
  {
    id: 'v7',
    year: 2025,
    make: 'Honda',
    model: 'CRF450R',
    category: 'Motorcycle',
    condition: 'New',
    mileage: 0,
    location: 'Charlotte, NC',
    msrp: 9599,
    price: 9599,
    savings: 0,
    imageUrl: '#c53030',
    tags: [],
  },
  {
    id: 'v8',
    year: 2024,
    make: 'Suzuki',
    model: 'GSX-R750',
    category: 'Motorcycle',
    condition: 'New',
    mileage: 12,
    location: 'Charlotte, NC',
    msrp: 12749,
    price: 10999,
    savings: 1750,
    imageUrl: '#2b6cb0',
    tags: [
      { key: 'clearance', appliedAt: '2026-03-01' },
      { key: 'low_stock', appliedAt: '2026-03-28' },
    ],
  },
];

// For the admin drawer demo: a single vehicle being edited
export const ADMIN_DEMO_VEHICLE = {
  year: 2024,
  make: 'Yamaha',
  model: 'MT-07',
  vin: '5Y4AJ26Y27A306218',
  stock: 'YAM-2407',
  condition: 'Used' as const,
  mileage: 2340,
  price: 6499,
  tags: [
    { key: 'clearance' as InventoryTagKey, appliedAt: '2026-03-15' },
    { key: 'demo_unit' as InventoryTagKey, appliedAt: '2026-02-10' },
  ],
};
