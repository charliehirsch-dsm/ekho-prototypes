export type RecallStatus = 'unassigned' | 'not_applicable' | 'remedied' | 'open';

export interface Recall {
  id: string;
  nhtsaCampaignNumber: string;
  componentDescription: string;
  summary: string;
  risk: string;
  remedy: string;
  nhtsaUrl: string;
  reportDate: string;
}

export interface VehicleRecallData {
  vehicleId: string;
  year: number;
  make: string;
  model: string;
  vin: string;
  recalls: Recall[];
}

export const RECALL_STATUS_OPTIONS = [
  {
    id: 'unassigned',
    label: 'Unassigned',
    description: 'Recall has not been reviewed yet',
  },
  {
    id: 'not_applicable',
    label: 'Not applicable',
    description: 'This recall does not apply to this specific unit',
  },
  {
    id: 'remedied',
    label: 'Applicable, but remedied',
    description: 'Recall applies and the fix has been completed',
  },
  {
    id: 'open',
    label: 'Open recall',
    description: 'Recall applies and has not yet been remedied',
  },
];

// Vehicle with multiple recalls
export const VEHICLE_WITH_RECALLS: VehicleRecallData = {
  vehicleId: 'veh_001',
  year: 2024,
  make: 'Can-Am',
  model: 'Maverick R',
  vin: '3JBKPSD29RJ000142',
  recalls: [
    {
      id: 'recall_001',
      nhtsaCampaignNumber: '24V-817',
      componentDescription: 'Fuel System, Gasoline: Delivery: Fuel Pump',
      summary: 'Fuel Pump May Fail',
      risk: 'A fuel pump failure can cause the engine to stall without warning while the vehicle is in motion, increasing the risk of a crash.',
      remedy: 'Dealers will inspect the fuel pump assembly and replace it if necessary, free of charge. Owners will be notified by mail.',
      nhtsaUrl: 'https://www.nhtsa.gov/recalls',
      reportDate: '2024-11-15',
    },
    {
      id: 'recall_002',
      nhtsaCampaignNumber: '24V-652',
      componentDescription: 'Electrical System: Software',
      summary: 'Rearview Camera Image May Not Display',
      risk: 'A rearview camera that fails to properly display an image can reduce the driver\'s view behind the vehicle, increasing the risk of a crash.',
      remedy: 'Dealers will inspect and replace the rearview camera as necessary, free of charge.',
      nhtsaUrl: 'https://www.nhtsa.gov/recalls',
      reportDate: '2024-09-03',
    },
    {
      id: 'recall_003',
      nhtsaCampaignNumber: '25V-041',
      componentDescription: 'Power Train: Driveline: Half Shaft',
      summary: 'Front Half Shaft May Fracture',
      risk: 'A fractured half shaft can result in a sudden loss of drive power, which may cause the driver to lose control of the vehicle, increasing the risk of a crash.',
      remedy: 'Dealers will replace the front half shafts with redesigned components, free of charge. Parts are expected to be available starting March 2025.',
      nhtsaUrl: 'https://www.nhtsa.gov/recalls',
      reportDate: '2025-01-22',
    },
  ],
};

// Vehicle with no recalls (clean state)
export const VEHICLE_NO_RECALLS: VehicleRecallData = {
  vehicleId: 'veh_002',
  year: 2025,
  make: 'Polaris',
  model: 'RZR Pro XP',
  vin: '3NSRAS877RF123456',
  recalls: [],
};
