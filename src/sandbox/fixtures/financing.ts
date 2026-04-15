/**
 * Mock financing / lender data.
 */

export interface MockFinancingApplication {
  id: string;
  orderId: string;
  buyerName: string;
  requestedAmount: number;
  status: 'submitted' | 'under_review' | 'approved' | 'declined' | 'countered';
  lenderResponses: MockLenderResponse[];
  createdAt: string;
}

export interface MockLenderResponse {
  lenderId: string;
  lenderName: string;
  status: 'approved' | 'declined' | 'countered' | 'pending';
  apr: number | null;
  termMonths: number | null;
  monthlyPayment: number | null;
  downPaymentRequired: number | null;
  respondedAt: string | null;
}

export const MOCK_FINANCING: MockFinancingApplication[] = [
  {
    id: 'fin-001', orderId: 'ord-002', buyerName: 'Rachel Torres',
    requestedAmount: 14234, status: 'approved',
    lenderResponses: [
      { lenderId: 'lndr-01', lenderName: 'Sheffield Financial', status: 'approved', apr: 5.99, termMonths: 60, monthlyPayment: 275.42, downPaymentRequired: 1000, respondedAt: '2026-04-05T10:00:00Z' },
      { lenderId: 'lndr-02', lenderName: 'Synchrony', status: 'approved', apr: 7.49, termMonths: 48, monthlyPayment: 344.18, downPaymentRequired: 500, respondedAt: '2026-04-05T11:30:00Z' },
      { lenderId: 'lndr-03', lenderName: 'Westlake Financial', status: 'declined', apr: null, termMonths: null, monthlyPayment: null, downPaymentRequired: null, respondedAt: '2026-04-05T14:00:00Z' },
    ],
    createdAt: '2026-04-04T16:00:00Z',
  },
  {
    id: 'fin-002', orderId: 'ord-004', buyerName: 'Tyler Brooks',
    requestedAmount: 27350, status: 'under_review',
    lenderResponses: [
      { lenderId: 'lndr-01', lenderName: 'Sheffield Financial', status: 'pending', apr: null, termMonths: null, monthlyPayment: null, downPaymentRequired: null, respondedAt: null },
      { lenderId: 'lndr-02', lenderName: 'Synchrony', status: 'pending', apr: null, termMonths: null, monthlyPayment: null, downPaymentRequired: null, respondedAt: null },
    ],
    createdAt: '2026-04-11T10:00:00Z',
  },
  {
    id: 'fin-003', orderId: 'ord-005', buyerName: 'Alex Rivera',
    requestedAmount: 8234, status: 'submitted',
    lenderResponses: [],
    createdAt: '2026-04-14T09:30:00Z',
  },
];
