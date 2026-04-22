/**
 * MSW handlers for all feature endpoints.
 * Returns realistic mock data matching production API response shapes.
 */

import { http, HttpResponse } from 'msw';
import {
  MOCK_ORDERS,
  MOCK_ORDER_STATS,
  MOCK_LEADS,
  MOCK_LEAD_STATS,
  MOCK_LEAD_PIPELINES,
  MOCK_PREORDERS,
  MOCK_DISCOUNTS,
  MOCK_CONVERSATIONS,
  MOCK_CONVERSATION_STATS,
  MOCK_ACCESSORIES,
  MOCK_TEAM,
} from '../data/mockEntities';

/** Wrap items in Stripe-style paginated envelope */
function paginated(items: unknown[]) {
  return {
    object: 'list' as const,
    data: items,
    hasMore: false,
    nextCursor: null,
    count: items.length,
  };
}

export const featureHandlers = [
  // --- Orders ---
  http.post('*/admin_portal/:spId/orders/search', () =>
    HttpResponse.json({ success: true, data: paginated(MOCK_ORDERS) }),
  ),
  http.get('*/admin_portal/:spId/orders/stats', () =>
    HttpResponse.json({ success: true, data: MOCK_ORDER_STATS }),
  ),
  http.get('*/admin_portal/:spId/orders/:orderId/details', ({ params }) => {
    const order = MOCK_ORDERS.find((o) => o.orderId === params.orderId);
    if (!order) return HttpResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: order });
  }),

  // --- Preorders ---
  http.post('*/admin_portal/:spId/preorders/search', () =>
    HttpResponse.json({ success: true, data: paginated(MOCK_PREORDERS) }),
  ),
  http.get('*/admin_portal/:spId/preorders/stats', () =>
    HttpResponse.json({ success: true, data: { total: MOCK_PREORDERS.length } }),
  ),

  // --- Leads ---
  http.post('*/admin_portal/:spId/leads/search', () =>
    HttpResponse.json({ success: true, data: paginated(MOCK_LEADS) }),
  ),
  http.get('*/admin_portal/:spId/leads/stats', () =>
    HttpResponse.json({ success: true, data: MOCK_LEAD_STATS }),
  ),
  http.get('*/admin_portal/:spId/leads/pipelines', () =>
    HttpResponse.json({ success: true, data: MOCK_LEAD_PIPELINES }),
  ),
  http.get('*/admin_portal/:spId/leads/:leadId', ({ params }) => {
    const lead = MOCK_LEADS.find((l) => l.id === params.leadId);
    const detail = {
      summary: {
        cartTotal: lead?.dealAmount ?? '$0',
        dateCreated: lead?.dateCreated ?? '2026-04-01',
        recentActivity: lead?.lastUpdated ?? '2026-04-15',
        pipeline: lead?.pipeline?.name ?? 'Inbound Pipeline',
        pipelineType: lead?.pipeline?.type ?? 'INBOUND_PIPELINE',
        stage: lead?.stage ? { type: lead.stage.type, name: lead.stage.name } : undefined,
        type: lead?.type ?? 'Inquiry',
      },
      contactInfo: {
        name: lead?.name ?? 'Unknown Contact',
        phone: lead?.phone ?? '',
        email: lead?.email ?? '',
        address: 'Austin, TX',
      },
      preorders: [],
      prequalifications: [],
      abandonedCarts: [],
      rejectedFinancing: [],
    };
    return HttpResponse.json({ success: true, data: detail });
  }),

  // --- Discounts ---
  http.post('*/admin_portal/:spId/discounts/search', () =>
    HttpResponse.json({ success: true, data: paginated(MOCK_DISCOUNTS) }),
  ),
  http.post('*/admin_portal/:spId/discounts/applicable-products/search', () =>
    HttpResponse.json({ success: true, data: paginated([]) }),
  ),
  http.get('*/admin_portal/:spId/discounts/applicable-products', () =>
    HttpResponse.json({ success: true, data: [] }),
  ),
  http.get('*/admin_portal/:spId/discounts/:discountId', () =>
    HttpResponse.json({ success: true, data: MOCK_DISCOUNTS[0] }),
  ),

  // --- Conversations ---
  http.post('*/admin_portal/:spId/conversations/search', () =>
    HttpResponse.json({ success: true, data: paginated(MOCK_CONVERSATIONS) }),
  ),
  http.get('*/admin_portal/:spId/conversations/stats', () =>
    HttpResponse.json({ success: true, data: MOCK_CONVERSATION_STATS }),
  ),
  http.get('*/admin_portal/:spId/conversations/:conversationId', ({ params }) => {
    const convo = MOCK_CONVERSATIONS.find((c) => c.conversationId === params.conversationId);
    return HttpResponse.json({ success: true, data: convo ?? MOCK_CONVERSATIONS[0] });
  }),
  http.get('*/admin_portal/:spId/conversations/:conversationId/messages', () =>
    HttpResponse.json({ success: true, data: paginated([]) }),
  ),

  // --- Accessories ---
  http.post('*/admin_portal/:spId/accessories/search', () =>
    HttpResponse.json({ success: true, data: paginated(MOCK_ACCESSORIES) }),
  ),
  http.get('*/admin_portal/:spId/accessories/:accessoryId', ({ params }) => {
    const acc = MOCK_ACCESSORIES.find((a) => a.id === params.accessoryId) ?? MOCK_ACCESSORIES[0];
    // Transform flat mock data into nested AccessoryDetails shape
    const detail = {
      id: acc.id,
      reference: {
        accessoryId: acc.id,
        productId: acc.productId,
        partNumber: acc.partNumber,
        name: acc.name,
      },
      accessoryStatus: {
        publishStatus: acc.publishStatus,
        images: acc.images ?? [],
        dateCreated: acc.dateCreated,
        dateUpdated: acc.dateUpdated,
      },
      partDetails: {
        name: acc.name,
        partNumber: acc.partNumber,
        productId: acc.productId,
        brand: acc.brand,
        type: acc.type,
        description: acc.description,
      },
      pricing: {
        retailPrice: acc.retailPrice,
        quantity: acc.quantity,
        outOfStockSellable: acc.outOfStockSellable,
      },
      installation: {
        installType: acc.install?.type ?? undefined,
        laborTime: acc.install?.laborTime ?? 0,
      },
      assignedVehicleListings: acc.assignedVehicleListings ?? [],
    };
    return HttpResponse.json({ success: true, data: detail });
  }),
  http.post('*/admin_portal/:spId/accessories/:accessoryId/image-upload-url', () =>
    HttpResponse.json({ success: true, data: { url: 'https://storage.example.com/mock-upload' } }),
  ),
  http.post('*/admin_portal/:spId/accessories/publish', () =>
    HttpResponse.json({ success: true, data: {} }),
  ),
  http.post('*/admin_portal/:spId/accessories/unpublish', () =>
    HttpResponse.json({ success: true, data: {} }),
  ),

  // --- Dealer Warranty Types ---
  http.get('*/admin_portal/:spId/dealer-warranty-types', () =>
    HttpResponse.json({ success: true, data: [] }),
  ),
  http.post('*/admin_portal/:spId/dealer-warranty-types', () =>
    HttpResponse.json({ success: true, data: { id: 'wt-new', title: '', description: '', createdAt: Date.now(), updatedAt: Date.now() } }),
  ),
  http.patch('*/admin_portal/:spId/dealer-warranty-types/:warrantyTypeId', () =>
    HttpResponse.json({ success: true, data: {} }),
  ),

  // --- Accessories (vehicle assignments) ---
  http.post('*/admin_portal/:spId/accessories/vehicle-assignments', () =>
    HttpResponse.json({ success: true, data: { updated: 0 } }),
  ),

  // --- Knowledge ---
  http.get('*/admin_portal/:spId/knowledge/documents', () =>
    HttpResponse.json({ success: true, data: [] }),
  ),
  http.get('*/admin_portal/:spId/knowledge/macro-info', () =>
    HttpResponse.json({ success: true, data: {} }),
  ),

  // --- Reports ---
  http.post('*/admin_portal/:spId/reports/generate', () =>
    HttpResponse.json({ success: true, data: {} }),
  ),

  // --- Plan / Credits ---
  http.get('*/admin_portal/:spId/plan/credits', () =>
    HttpResponse.json({ success: true, data: [] }),
  ),

  // --- Team ---
  http.post('*/admin_portal/:spId/configuration/team/search', () =>
    HttpResponse.json({ success: true, data: paginated(MOCK_TEAM) }),
  ),

  // --- Docs auth ---
  http.post('*/admin_portal/auth/docs-token', () =>
    HttpResponse.json({ success: true, data: { token: 'mock-docs-jwt' } }),
  ),
];
