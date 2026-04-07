// ---------------------------------------------------------------------------
// Mock data for Prop 65 Warning prototype
// Matches production Carthage VDP data structures
// ---------------------------------------------------------------------------

export interface DealerInfo {
  name: string;
  state: string;
  city: string;
  isCA: boolean;
  phone: string;
  hours: string;
}

export interface VehicleSpec {
  label: string;
  value: string;
}

export interface FeatureCategory {
  name: string;
  features: string[];
}

export interface RecallCampaign {
  campaignNumber: string;
  component: string;
  summary: string;
  remedy: string;
}

export interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  trim: string;
  condition: 'new' | 'used';
  advertisedPrice: number;
  dealerRetailPrice: number;
  mileage?: number;
  vin: string;
  stockNumber: string;
  fuelType: string;
  useType: string;
  vehicleCategory: string;
  imageCount: number;
  specs: VehicleSpec[];
  features: FeatureCategory[];
  recalls: RecallCampaign[];
  deliveryEstimate: string;
  deliveryPrice: string;
  distance: string;
  financing?: {
    monthlyPayment: number;
    downPayment: number;
    apr: number;
    term: number;
  };
}

export interface DemoScenario {
  label: string;
  dealer: DealerInfo;
  vehicle: VehicleInfo;
}

// ---------------------------------------------------------------------------
// Prop 65 warning text (27 CCR §25607.17 safe harbor)
// ---------------------------------------------------------------------------
export const PROP_65_WARNING_TEXT =
  'Operating, servicing and maintaining a passenger vehicle or off-highway motor vehicle can expose you to chemicals including engine exhaust, carbon monoxide, phthalates, and lead, which are known to the State of California to cause cancer and birth defects or other reproductive harm. To minimize exposure, avoid breathing exhaust, do not idle the engine except as necessary, service your vehicle in a well-ventilated area and wear gloves or wash your hands frequently when servicing your vehicle.';

export const PROP_65_URL = 'https://www.P65Warnings.ca.gov/passenger-vehicle';

// ---------------------------------------------------------------------------
// Demo scenarios
// ---------------------------------------------------------------------------
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    label: 'CA Dealer',
    dealer: {
      name: 'SoCal Motorcycles',
      state: 'CA',
      city: 'San Diego',
      isCA: true,
      phone: '(619) 555-0142',
      hours: 'Mon-Fri 9am-6pm, Sat 9am-5pm',
    },
    vehicle: {
      year: 2025,
      make: 'Honda',
      model: 'CRF450R',
      trim: '',
      condition: 'used',
      advertisedPrice: 8499,
      dealerRetailPrice: 9299,
      mileage: 1247,
      vin: '1HFRE0401F0008291',
      stockNumber: 'SC-4821',
      fuelType: 'Gasoline',
      useType: 'Off-road',
      vehicleCategory: 'Dirt Bike',
      imageCount: 14,
      specs: [
        { label: 'Engine', value: '449cc single-cylinder' },
        { label: 'Horsepower', value: '55.4 hp' },
        { label: 'Torque', value: '34.4 lb-ft' },
        { label: 'Weight', value: '245 lbs (wet)' },
        { label: 'Seat Height', value: '37.8 in' },
        { label: 'Fuel Capacity', value: '1.6 gal' },
        { label: 'Transmission', value: '5-Speed' },
        { label: 'Cooling', value: 'Liquid-cooled' },
      ],
      features: [
        {
          name: 'Performance',
          features: ['Titanium Unicam engine', 'Dual-mode map switch', 'Honda Selectable Torque Control (HSTC)'],
        },
        {
          name: 'Technology',
          features: ['Launch control system', 'Engine mode select button', 'HRC-developed ECU'],
        },
        {
          name: 'Comfort & Convenience',
          features: ['49mm Showa coil-spring fork', 'Pro-Link rear suspension', 'Twin-spar aluminum frame'],
        },
      ],
      recalls: [
        {
          campaignNumber: '24V-847',
          component: 'Fuel System',
          summary: 'Fuel line may develop a crack near the connection point, potentially causing a fuel leak.',
          remedy: 'Dealers will replace the fuel line assembly at no cost to the owner.',
        },
      ],
      deliveryEstimate: '5-8 business days',
      deliveryPrice: '$349',
      distance: '12 mi',
      financing: {
        monthlyPayment: 189,
        downPayment: 850,
        apr: 7.99,
        term: 48,
      },
    },
  },
  {
    label: 'Non-CA Dealer',
    dealer: {
      name: 'Ride Atlanta Powersports',
      state: 'GA',
      city: 'Atlanta',
      isCA: false,
      phone: '(404) 555-0287',
      hours: 'Mon-Sat 9am-7pm, Sun 11am-5pm',
    },
    vehicle: {
      year: 2024,
      make: 'Yamaha',
      model: 'MT-07',
      trim: '',
      condition: 'used',
      advertisedPrice: 6299,
      dealerRetailPrice: 6299,
      mileage: 3842,
      vin: 'JYARM33E4PA004017',
      stockNumber: 'RA-1193',
      fuelType: 'Gasoline',
      useType: 'Street',
      vehicleCategory: 'Motorcycle',
      imageCount: 22,
      specs: [
        { label: 'Engine', value: '689cc parallel-twin' },
        { label: 'Horsepower', value: '72.4 hp' },
        { label: 'Torque', value: '50.0 lb-ft' },
        { label: 'Weight', value: '403 lbs (wet)' },
        { label: 'Seat Height', value: '31.7 in' },
        { label: 'Fuel Capacity', value: '3.7 gal' },
        { label: 'Transmission', value: '6-Speed' },
        { label: 'Cooling', value: 'Liquid-cooled' },
      ],
      features: [
        {
          name: 'Performance',
          features: ['Crossplane concept CP2 engine', 'Assist & slipper clutch', '6-speed transmission'],
        },
        {
          name: 'Technology',
          features: ['Full LCD dashboard', 'LED headlight and taillight', 'Bluetooth connectivity'],
        },
        {
          name: 'Safety',
          features: ['ABS standard', 'Traction control system', 'Radial-mount front brake calipers'],
        },
      ],
      recalls: [],
      deliveryEstimate: '3-5 business days',
      deliveryPrice: '$279',
      distance: '8 mi',
      financing: {
        monthlyPayment: 142,
        downPayment: 630,
        apr: 6.49,
        term: 48,
      },
    },
  },
  {
    label: 'CA New Vehicle',
    dealer: {
      name: 'SoCal Motorcycles',
      state: 'CA',
      city: 'San Diego',
      isCA: true,
      phone: '(619) 555-0142',
      hours: 'Mon-Fri 9am-6pm, Sat 9am-5pm',
    },
    vehicle: {
      year: 2026,
      make: 'Kawasaki',
      model: 'Ninja 400',
      trim: 'ABS',
      condition: 'new',
      advertisedPrice: 5599,
      dealerRetailPrice: 5599,
      vin: 'JKAEXKD17RDA07102',
      stockNumber: 'SC-5033',
      fuelType: 'Gasoline',
      useType: 'Street',
      vehicleCategory: 'Motorcycle',
      imageCount: 8,
      specs: [
        { label: 'Engine', value: '399cc parallel-twin' },
        { label: 'Horsepower', value: '44.8 hp' },
        { label: 'Torque', value: '27.5 lb-ft' },
        { label: 'Weight', value: '366 lbs (wet)' },
        { label: 'Seat Height', value: '30.9 in' },
        { label: 'Fuel Capacity', value: '3.7 gal' },
        { label: 'Transmission', value: '6-Speed' },
        { label: 'Cooling', value: 'Liquid-cooled' },
      ],
      features: [
        {
          name: 'Performance',
          features: ['Dual 310mm front petal disc brakes', 'Slipper & assist clutch', 'Lightweight trellis frame'],
        },
        {
          name: 'Technology',
          features: ['Full-digital TFT instrumentation', 'LED lighting system', 'Smartphone connectivity via Rideology'],
        },
        {
          name: 'Safety',
          features: ['ABS (Anti-lock Braking System)', 'Positive neutral finder', 'Gear position indicator'],
        },
      ],
      recalls: [],
      deliveryEstimate: '3-7 business days',
      deliveryPrice: '$349',
      distance: '12 mi',
      financing: {
        monthlyPayment: 124,
        downPayment: 560,
        apr: 5.99,
        term: 48,
      },
    },
  },
];
