/**
 * Mock vehicle inventory data.
 * Covers motorcycles, ATVs, golf carts, and side-by-sides.
 */

export interface MockVehicle {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  category: 'motorcycle' | 'atv' | 'golf-cart' | 'side-by-side' | 'scooter';
  condition: 'new' | 'used';
  price: number;
  msrp: number;
  mileage: number;
  color: string;
  status: 'available' | 'reserved' | 'sold' | 'pending';
  imageUrl: string;
  stockNumber: string;
  description: string;
}

export const MOCK_VEHICLES: MockVehicle[] = [
  // Motorcycles
  {
    id: 'inv-001', vin: '1HD1KRM17PB612345', year: 2026, make: 'Harley-Davidson', model: 'Street Glide', trim: 'Special',
    category: 'motorcycle', condition: 'new', price: 27499, msrp: 28999, mileage: 0, color: 'Vivid Black',
    status: 'available', imageUrl: '', stockNumber: 'HD-2601', description: 'Milwaukee-Eight 114 engine, Boom! Box GTS infotainment',
  },
  {
    id: 'inv-002', vin: 'JYARN38E9PA000234', year: 2026, make: 'Yamaha', model: 'MT-07', trim: '',
    category: 'motorcycle', condition: 'new', price: 7899, msrp: 7999, mileage: 0, color: 'Team Yamaha Blue',
    status: 'available', imageUrl: '', stockNumber: 'YM-2601', description: '689cc CP2 engine, lightweight chassis',
  },
  {
    id: 'inv-003', vin: 'JKAEXMJ18PDA12345', year: 2025, make: 'Kawasaki', model: 'Ninja 400', trim: 'KRT',
    category: 'motorcycle', condition: 'used', price: 4299, msrp: 5499, mileage: 3200, color: 'Lime Green',
    status: 'available', imageUrl: '', stockNumber: 'KW-2501', description: 'Parallel twin, ABS, excellent condition',
  },
  {
    id: 'inv-004', vin: 'SMT907LMXP1012345', year: 2026, make: 'Ducati', model: 'Monster', trim: 'Plus',
    category: 'motorcycle', condition: 'new', price: 13995, msrp: 14495, mileage: 0, color: 'Ducati Red',
    status: 'reserved', imageUrl: '', stockNumber: 'DC-2601', description: '937cc Testastretta 11-degree engine',
  },
  {
    id: 'inv-005', vin: 'RFGBS2EL0PX000567', year: 2025, make: 'Honda', model: 'Rebel 500', trim: '',
    category: 'motorcycle', condition: 'used', price: 4799, msrp: 6299, mileage: 5800, color: 'Matte Jeans Blue',
    status: 'available', imageUrl: '', stockNumber: 'HN-2501', description: 'Perfect beginner cruiser, low miles',
  },
  {
    id: 'inv-006', vin: 'ZDM14BPW5PB001234', year: 2026, make: 'Indian', model: 'Scout', trim: 'Bobber',
    category: 'motorcycle', condition: 'new', price: 12499, msrp: 12999, mileage: 0, color: 'Black Metallic',
    status: 'available', imageUrl: '', stockNumber: 'IN-2601', description: 'V-twin, 1133cc, blacked-out styling',
  },

  // ATVs
  {
    id: 'inv-007', vin: '1XKAD09X0PA000789', year: 2026, make: 'Polaris', model: 'Sportsman 570', trim: 'EPS',
    category: 'atv', condition: 'new', price: 8199, msrp: 8499, mileage: 0, color: 'Sage Green',
    status: 'available', imageUrl: '', stockNumber: 'PL-2601', description: 'ProStar 570 engine, EPS, True On-Demand AWD',
  },
  {
    id: 'inv-008', vin: '5Y4AJ06Y06A012345', year: 2026, make: 'Yamaha', model: 'Grizzly 700', trim: 'EPS SE',
    category: 'atv', condition: 'new', price: 11299, msrp: 11799, mileage: 0, color: 'Tactical Black',
    status: 'available', imageUrl: '', stockNumber: 'YM-2602', description: '686cc engine, On-Command 4WD, EPS',
  },
  {
    id: 'inv-009', vin: '1HFTE3421PA567890', year: 2025, make: 'Honda', model: 'FourTrax Rancher', trim: '4x4',
    category: 'atv', condition: 'used', price: 5499, msrp: 7199, mileage: 1200, color: 'Red',
    status: 'sold', imageUrl: '', stockNumber: 'HN-2502', description: '420cc, ESP, excellent work ATV',
  },

  // Golf Carts
  {
    id: 'inv-010', vin: 'STREV26E0PA001001', year: 2026, make: 'Star EV', model: 'Capella', trim: '4+2',
    category: 'golf-cart', condition: 'new', price: 18995, msrp: 19995, mileage: 0, color: 'Pearl White',
    status: 'available', imageUrl: '', stockNumber: 'SE-2601', description: '48V lithium, 25mph, street legal',
  },
  {
    id: 'inv-011', vin: 'STREV26E0PA001002', year: 2026, make: 'Star EV', model: 'Sirius', trim: '2+2',
    category: 'golf-cart', condition: 'new', price: 14995, msrp: 15995, mileage: 0, color: 'Matte Black',
    status: 'reserved', imageUrl: '', stockNumber: 'SE-2602', description: '48V lithium, custom wheels, LED package',
  },
  {
    id: 'inv-012', vin: 'EZCL26E00PA012345', year: 2025, make: 'E-Z-GO', model: 'Liberty', trim: '',
    category: 'golf-cart', condition: 'used', price: 9499, msrp: 13999, mileage: 800, color: 'Almond',
    status: 'available', imageUrl: '', stockNumber: 'EZ-2501', description: 'ELiTE lithium, folding windshield',
  },
  {
    id: 'inv-013', vin: 'CLUB26E00PA001234', year: 2026, make: 'Club Car', model: 'Onward', trim: 'HP Li-Ion',
    category: 'golf-cart', condition: 'new', price: 16499, msrp: 17299, mileage: 0, color: 'Forest Green',
    status: 'available', imageUrl: '', stockNumber: 'CC-2601', description: 'Samsung lithium, 25mph, premium seats',
  },
  {
    id: 'inv-014', vin: 'ICON26E00PA005678', year: 2026, make: 'Icon', model: 'i40L', trim: '',
    category: 'golf-cart', condition: 'new', price: 11995, msrp: 12495, mileage: 0, color: 'Orange',
    status: 'available', imageUrl: '', stockNumber: 'IC-2601', description: 'Lifted, 10" wheels, Bluetooth stereo',
  },

  // Side-by-sides
  {
    id: 'inv-015', vin: '3NSRJA870PR000111', year: 2026, make: 'Polaris', model: 'RZR XP 1000', trim: 'Ultimate',
    category: 'side-by-side', condition: 'new', price: 25999, msrp: 27499, mileage: 0, color: 'Orange Rust',
    status: 'available', imageUrl: '', stockNumber: 'PL-2602', description: '999cc ProStar, Walker Evans shocks, 72" width',
  },
  {
    id: 'inv-016', vin: '3NSVJB560PA000222', year: 2026, make: 'Can-Am', model: 'Maverick X3', trim: 'X RS Turbo RR',
    category: 'side-by-side', condition: 'new', price: 32999, msrp: 34499, mileage: 0, color: 'Carbon Black / Magma Red',
    status: 'available', imageUrl: '', stockNumber: 'CA-2601', description: '200hp Rotax ACE turbo, Smart-Shox',
  },
  {
    id: 'inv-017', vin: '5UX1C3C17PA003456', year: 2025, make: 'Honda', model: 'Talon 1000X', trim: 'FOX Live Valve',
    category: 'side-by-side', condition: 'used', price: 17999, msrp: 22799, mileage: 2500, color: 'Red',
    status: 'available', imageUrl: '', stockNumber: 'HN-2503', description: '999cc twin, DCT, FOX Live Valve suspension',
  },
  {
    id: 'inv-018', vin: '4UF1YMD22PA012345', year: 2026, make: 'Kawasaki', model: 'Teryx KRX4 1000', trim: 'SE',
    category: 'side-by-side', condition: 'new', price: 24499, msrp: 25999, mileage: 0, color: 'Fragment Camo Gray',
    status: 'pending', imageUrl: '', stockNumber: 'KW-2601', description: '999cc parallel twin, 4-seater, FOX shocks',
  },

  // Scooters
  {
    id: 'inv-019', vin: 'RFGBS2EL0PX000890', year: 2026, make: 'Honda', model: 'PCX', trim: '',
    category: 'scooter', condition: 'new', price: 4099, msrp: 4299, mileage: 0, color: 'Pearl White',
    status: 'available', imageUrl: '', stockNumber: 'HN-2604', description: '157cc eSP+ engine, Honda Selectable Torque Control',
  },
  {
    id: 'inv-020', vin: 'ZAPM6730PA000456', year: 2026, make: 'Vespa', model: 'Primavera', trim: '150',
    category: 'scooter', condition: 'new', price: 6499, msrp: 6799, mileage: 0, color: 'Azzurro 70s',
    status: 'available', imageUrl: '', stockNumber: 'VS-2601', description: 'i-get 155cc engine, full LED lighting, TFT display',
  },
];
