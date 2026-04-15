/**
 * Mock preorder data.
 */

export interface MockPreorder {
  id: string;
  preorderNumber: string;
  vehicleSummary: string;
  buyerName: string;
  buyerEmail: string;
  status: 'pending_deposit' | 'deposit_received' | 'in_production' | 'ready_for_pickup' | 'converted' | 'canceled';
  depositAmount: number;
  depositPaid: boolean;
  estimatedArrival: string;
  createdAt: string;
}

export const MOCK_PREORDERS: MockPreorder[] = [
  {
    id: 'pre-001', preorderNumber: 'PRE-5001',
    vehicleSummary: '2026 Harley-Davidson Road Glide CVO',
    buyerName: 'Mark Sullivan', buyerEmail: 'mark.s@email.com',
    status: 'in_production', depositAmount: 1000, depositPaid: true,
    estimatedArrival: '2026-06-15', createdAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'pre-002', preorderNumber: 'PRE-5002',
    vehicleSummary: '2026 Star EV Capella 6-Seater',
    buyerName: 'Jennifer Adams', buyerEmail: 'jen.a@email.com',
    status: 'deposit_received', depositAmount: 500, depositPaid: true,
    estimatedArrival: '2026-05-20', createdAt: '2026-03-15T14:30:00Z',
  },
  {
    id: 'pre-003', preorderNumber: 'PRE-5003',
    vehicleSummary: '2026 Can-Am Maverick R',
    buyerName: 'Jason Wright', buyerEmail: 'jason.w@email.com',
    status: 'pending_deposit', depositAmount: 500, depositPaid: false,
    estimatedArrival: '2026-07-01', createdAt: '2026-04-10T09:00:00Z',
  },
  {
    id: 'pre-004', preorderNumber: 'PRE-5004',
    vehicleSummary: '2026 Indian Pursuit Limited',
    buyerName: 'Lisa Thompson', buyerEmail: 'lisa.t@email.com',
    status: 'ready_for_pickup', depositAmount: 1000, depositPaid: true,
    estimatedArrival: '2026-04-12', createdAt: '2026-01-20T11:00:00Z',
  },
];
