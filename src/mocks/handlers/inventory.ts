/**
 * MSW handlers for inventory endpoints.
 * Returns mock inventory data matching production InventoryItemSearchRecord
 * and IInventoryItem shapes.
 */

import { http, HttpResponse } from 'msw';
import { MOCK_VEHICLES } from '../../sandbox/fixtures/vehicles';
import { PRIMARY_SP_ID } from '../../sandbox/fixtures/dealers';

/** Map publishStatus from vehicle fixture to production InventoryListingStatus enum values */
const LISTING_STATUS_MAP: Record<string, string> = {
  published: 'PUBLISHED',
  draft: 'DRAFT',
  hidden: 'HIDDEN',
};

/**
 * Transform mock vehicle fixtures into production InventoryItemSearchRecord shape.
 * Must include ALL required fields from InventoryItemSearchRecord to avoid
 * crashes in the production InventoryTable component.
 */
function toInventoryRecord(vehicle: typeof MOCK_VEHICLES[number]) {
  const listingStatus = LISTING_STATUS_MAP[vehicle.publishStatus] ?? 'PUBLISHED';

  return {
    id: vehicle.id,
    ownerId: PRIMARY_SP_ID,

    // Listing status (production uses uppercase enum values)
    listing: {
      status: listingStatus,
      lastPublished: listingStatus === 'PUBLISHED' ? Date.now() - 86400000 : undefined,
      lastModified: Date.now() - 3600000,
    },
    isMarkedForOnlineSale: vehicle.status === 'available',

    // Matching status
    matching: {
      status: 'MATCHED',
    },

    // Vehicle information
    make: vehicle.make,
    model: vehicle.model,
    modelYear: vehicle.year,
    fullName: [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean).join(' '),
    vehicleCategory: vehicle.category,
    color: vehicle.color,
    baseColor: vehicle.color.split(' ').pop() ?? vehicle.color,
    vin: vehicle.vin,
    imageUrls: vehicle.imageUrl ? [vehicle.imageUrl] : [],
    description: vehicle.description,

    // Assignment (production uses nested object, not flat)
    assignment: {
      status: vehicle.status === 'reserved' ? 'softLocked' : 'available',
      details: {},
    },
    externalAssignment: {
      status: 'available',
      details: {},
    },

    // Condition and usage
    newUsed: vehicle.condition,
    odometerReading: vehicle.mileage,
    odometerUnit: 'mi',
    engineNumber: '',

    // Pricing (production expects nested pricing object)
    pricing: {
      dealerRetailPrice: vehicle.price,
      advertisedPrice: vehicle.price,
      retailPrice: vehicle.msrp,
      map: false,
      fees: { pdi: 0 },
    },

    // Inventory details
    stockNumber: vehicle.stockNumber,
    dateAddedToInventory: Date.now() - 30 * 86400000,

    // Required IInventoryItem fields for drawer
    productId: `prod-${vehicle.id}`,
    variantId: `var-${vehicle.id}`,
    primarySource: { type: 'DMS', provider: 'lightspeed' },
    sources: [{ type: 'DMS', provider: 'lightspeed' }],
    raw: {
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      modelYear: vehicle.year,
      type: vehicle.category,
      odometerReading: vehicle.mileage,
      odometerUnit: 'mi',
      engineNumber: '',
      color: vehicle.color,
      gvwr: 0,
      gdw: 0,
      description: vehicle.description,
    },

    // Geolocation (Algolia)
    _geoloc: { lat: 33.749, lng: -84.388 },

    // Fulfillment
    fulfillmentOptions: ['delivery', 'pickup'] as ('delivery' | 'pickup')[],

    // Metrics
    metrics: {
      LAST_24_HOURS_VIEWS: Math.floor(Math.random() * 50),
    },
  };
}

const inventoryRecords = MOCK_VEHICLES.map(toInventoryRecord);

export const inventoryHandlers = [
  // GET /admin_portal/:spId/inventory (list with pagination)
  http.get('*/admin_portal/:spId/inventory', ({ request }) => {
    const url = new URL(request.url);

    // If there's an itemId-like segment after /inventory/, skip (let detail handler catch it)
    const pathAfterInventory = url.pathname.split('/inventory/')[1];
    if (pathAfterInventory && !pathAfterInventory.includes('/')) {
      return; // pass through to more specific handler
    }

    return HttpResponse.json({
      success: true,
      data: {
        object: 'list',
        data: inventoryRecords,
        hasMore: false,
        nextCursor: null,
        count: inventoryRecords.length,
        facets: {
          make: Object.fromEntries(
            [...new Set(inventoryRecords.map((r) => r.make))].map((m) => [
              m,
              inventoryRecords.filter((r) => r.make === m).length,
            ]),
          ),
          vehicleCategory: Object.fromEntries(
            [...new Set(inventoryRecords.map((r) => r.vehicleCategory))].map((c) => [
              c,
              inventoryRecords.filter((r) => r.vehicleCategory === c).length,
            ]),
          ),
        },
      },
    });
  }),

  // GET /admin_portal/:spId/inventory/:itemId (detail)
  http.get('*/admin_portal/:spId/inventory/:itemId', ({ params }) => {
    // Skip sub-resource routes like /inventory/:itemId/reports
    if (typeof params.itemId === 'string' && ['sync', 'publishAll', 'archive', 'enableOnlineSales'].includes(params.itemId)) {
      return;
    }

    const item = inventoryRecords.find((r) => r.id === params.itemId);
    if (!item) {
      return HttpResponse.json(
        { success: false, message: 'Not found' },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      success: true,
      data: item,
    });
  }),

  // GET /admin_portal/:spId/inventory/:itemId/reports
  http.get('*/admin_portal/:spId/inventory/:itemId/reports', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.itemId,
        // All report fields are optional; empty means "no report filed yet"
      },
    });
  }),

  // GET /admin_portal/:spId/inventory/:itemId/pricing-history (also match pricingHistory)
  http.get('*/admin_portal/:spId/inventory/:itemId/pricing-history', () => {
    return HttpResponse.json({
      success: true,
      data: {
        advertisedPrice: [],
        dealerRetailPrice: [],
        retailPrice: [],
      },
    });
  }),
  http.get('*/admin_portal/:spId/inventory/:itemId/pricingHistory', () => {
    return HttpResponse.json({
      success: true,
      data: {
        advertisedPrice: [],
        dealerRetailPrice: [],
        retailPrice: [],
      },
    });
  }),

  // POST /admin_portal/:spId/inventory/:itemId/report-pdf/:type/upload-url
  http.post('*/admin_portal/:spId/inventory/:itemId/report-pdf/:type/upload-url', () => {
    return HttpResponse.json({
      success: true,
      data: {
        signedUrl: 'https://mock-storage.example.com/upload',
        publicUrl: 'https://mock-storage.example.com/public/report.pdf',
        storagePath: 'mock/reports/report.pdf',
        extensionHeaders: {},
      },
    });
  }),

  // POST /admin_portal/:spId/inventory/cosmetic-report/upload-url
  http.post('*/admin_portal/:spId/inventory/cosmetic-report/upload-url', () => {
    return HttpResponse.json({
      success: true,
      data: {
        signedUrl: 'https://mock-storage.example.com/upload',
        publicUrl: 'https://mock-storage.example.com/public/cosmetic.jpg',
        storagePath: 'mock/cosmetic/photo.jpg',
        extensionHeaders: {},
      },
    });
  }),

  // POST /admin_portal/:spId/inventory/cosmetic-report/read-url
  http.post('*/admin_portal/:spId/inventory/cosmetic-report/read-url', () => {
    return HttpResponse.json({
      success: true,
      data: {
        signedUrl: 'https://mock-storage.example.com/read/cosmetic.jpg',
      },
    });
  }),

  // POST /admin_portal/:spId/inventory/sync
  http.post('*/admin_portal/:spId/inventory/sync', () => {
    return HttpResponse.json({ success: true, data: { syncedCount: 0 } });
  }),

  // POST /admin_portal/:spId/inventory/publishAll
  http.post('*/admin_portal/:spId/inventory/publishAll', () => {
    return HttpResponse.json({ success: true, data: {} });
  }),

  // POST /admin_portal/:spId/inventory/archive
  http.post('*/admin_portal/:spId/inventory/archive', () => {
    return HttpResponse.json({ success: true, data: {} });
  }),

  // POST /admin_portal/:spId/inventory/enableOnlineSales
  http.post('*/admin_portal/:spId/inventory/enableOnlineSales', () => {
    return HttpResponse.json({ success: true, data: {} });
  }),

  // GET /admin_portal/:spId/imports (import jobs list)
  http.get('*/admin_portal/:spId/imports', () => {
    return HttpResponse.json({
      success: true,
      data: {
        object: 'list',
        data: [],
        hasMore: false,
        nextCursor: null,
        count: 0,
      },
    });
  }),

  // POST /admin_portal/:spId/imports/inventory
  http.post('*/admin_portal/:spId/imports/inventory', () => {
    return HttpResponse.json({ success: true, data: { jobId: 'mock-job-1' } });
  }),
];
