/**
 * Mock order data in various states.
 */

export interface MockOrder {
  id: string;
  orderNumber: string;
  vehicleId: string;
  vehicleSummary: string;
  buyerName: string;
  buyerEmail: string;
  status: 'pending' | 'in_progress' | 'financing_review' | 'financing_approved' | 'completed' | 'canceled';
  total: number;
  depositAmount: number;
  paymentMethod: 'financing' | 'cash' | 'wire';
  createdAt: string;
  updatedAt: string;
}

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ord-001', orderNumber: 'ORD-10042',
    vehicleId: 'inv-001', vehicleSummary: '2026 Harley-Davidson Street Glide Special',
    buyerName: 'James Mitchell', buyerEmail: 'james.mitchell@email.com',
    status: 'completed', total: 29847.50, depositAmount: 500,
    paymentMethod: 'financing', createdAt: '2026-03-28T14:30:00Z', updatedAt: '2026-04-10T09:15:00Z',
  },
  {
    id: 'ord-002', orderNumber: 'ORD-10043',
    vehicleId: 'inv-004', vehicleSummary: '2026 Ducati Monster Plus',
    buyerName: 'Rachel Torres', buyerEmail: 'rachel.t@email.com',
    status: 'financing_approved', total: 15234.00, depositAmount: 500,
    paymentMethod: 'financing', createdAt: '2026-04-02T10:00:00Z', updatedAt: '2026-04-12T16:45:00Z',
  },
  {
    id: 'ord-003', orderNumber: 'ORD-10044',
    vehicleId: 'inv-010', vehicleSummary: '2026 Star EV Capella 4+2',
    buyerName: 'David Chen', buyerEmail: 'david.chen@email.com',
    status: 'in_progress', total: 20145.00, depositAmount: 1000,
    paymentMethod: 'cash', createdAt: '2026-04-08T11:20:00Z', updatedAt: '2026-04-14T08:30:00Z',
  },
  {
    id: 'ord-004', orderNumber: 'ORD-10045',
    vehicleId: 'inv-015', vehicleSummary: '2026 Polaris RZR XP 1000 Ultimate',
    buyerName: 'Tyler Brooks', buyerEmail: 'tyler.b@email.com',
    status: 'financing_review', total: 28350.75, depositAmount: 500,
    paymentMethod: 'financing', createdAt: '2026-04-10T15:45:00Z', updatedAt: '2026-04-13T10:00:00Z',
  },
  {
    id: 'ord-005', orderNumber: 'ORD-10046',
    vehicleId: 'inv-002', vehicleSummary: '2026 Yamaha MT-07',
    buyerName: 'Alex Rivera', buyerEmail: 'alex.r@email.com',
    status: 'pending', total: 8734.25, depositAmount: 250,
    paymentMethod: 'financing', createdAt: '2026-04-14T09:00:00Z', updatedAt: '2026-04-14T09:00:00Z',
  },
  {
    id: 'ord-006', orderNumber: 'ORD-10047',
    vehicleId: 'inv-013', vehicleSummary: '2026 Club Car Onward HP Li-Ion',
    buyerName: 'Patricia Williams', buyerEmail: 'pat.w@email.com',
    status: 'completed', total: 17845.00, depositAmount: 500,
    paymentMethod: 'wire', createdAt: '2026-03-15T13:00:00Z', updatedAt: '2026-04-01T11:30:00Z',
  },
  {
    id: 'ord-007', orderNumber: 'ORD-10048',
    vehicleId: 'inv-016', vehicleSummary: '2026 Can-Am Maverick X3 X RS Turbo RR',
    buyerName: 'Marcus Johnson', buyerEmail: 'marcus.j@email.com',
    status: 'in_progress', total: 35840.00, depositAmount: 1000,
    paymentMethod: 'financing', createdAt: '2026-04-11T16:30:00Z', updatedAt: '2026-04-14T14:00:00Z',
  },
  {
    id: 'ord-008', orderNumber: 'ORD-10039',
    vehicleId: 'inv-009', vehicleSummary: '2025 Honda FourTrax Rancher 4x4',
    buyerName: 'Linda Hoffman', buyerEmail: 'linda.h@email.com',
    status: 'canceled', total: 6120.00, depositAmount: 250,
    paymentMethod: 'financing', createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-03-25T15:45:00Z',
  },
];
