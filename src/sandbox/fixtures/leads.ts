/**
 * Mock lead data.
 */

export interface MockLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'website' | 'ai-agent' | 'phone' | 'walk-in' | 'referral';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  vehicleInterest: string;
  assignedTo: string;
  notes: string;
  createdAt: string;
  lastContactAt: string;
}

export const MOCK_LEADS: MockLead[] = [
  {
    id: 'lead-001', name: 'Brandon Foster', email: 'brandon.f@email.com', phone: '(512) 555-0199',
    source: 'ai-agent', status: 'qualified', vehicleInterest: '2026 Harley-Davidson Street Glide',
    assignedTo: 'Mike Thompson', notes: 'AI Agent qualified. Budget $25-30K, wants financing.',
    createdAt: '2026-04-13T08:30:00Z', lastContactAt: '2026-04-14T10:15:00Z',
  },
  {
    id: 'lead-002', name: 'Samantha Lee', email: 'sam.lee@email.com', phone: '(843) 555-0177',
    source: 'website', status: 'new', vehicleInterest: 'Star EV Capella',
    assignedTo: '', notes: 'Submitted inquiry from VDP. Interested in 4+2 seating.',
    createdAt: '2026-04-14T16:00:00Z', lastContactAt: '2026-04-14T16:00:00Z',
  },
  {
    id: 'lead-003', name: 'Kevin Park', email: 'kevin.p@email.com', phone: '(303) 555-0145',
    source: 'phone', status: 'contacted', vehicleInterest: 'Polaris RZR XP 1000',
    assignedTo: 'Jane Rodriguez', notes: 'Called asking about RZR availability. Following up Thursday.',
    createdAt: '2026-04-12T11:00:00Z', lastContactAt: '2026-04-13T14:30:00Z',
  },
  {
    id: 'lead-004', name: 'Maria Gonzalez', email: 'maria.g@email.com', phone: '(512) 555-0133',
    source: 'ai-agent', status: 'proposal', vehicleInterest: '2026 Yamaha MT-07',
    assignedTo: 'Mike Thompson', notes: 'AI Agent set appointment. Wants test ride Saturday.',
    createdAt: '2026-04-10T09:45:00Z', lastContactAt: '2026-04-14T11:00:00Z',
  },
  {
    id: 'lead-005', name: 'Robert Davis', email: 'rob.davis@email.com', phone: '(843) 555-0122',
    source: 'referral', status: 'won', vehicleInterest: 'Club Car Onward',
    assignedTo: 'Jane Rodriguez', notes: 'Referred by existing customer. Bought CC Onward HP.',
    createdAt: '2026-03-25T10:00:00Z', lastContactAt: '2026-04-05T15:00:00Z',
  },
  {
    id: 'lead-006', name: 'Ashley Wang', email: 'ashley.w@email.com', phone: '(512) 555-0188',
    source: 'website', status: 'contacted', vehicleInterest: 'Honda Rebel 500',
    assignedTo: 'Mike Thompson', notes: 'First-time rider, wants beginner-friendly options.',
    createdAt: '2026-04-11T13:20:00Z', lastContactAt: '2026-04-12T09:30:00Z',
  },
  {
    id: 'lead-007', name: 'Chris Nelson', email: 'chris.n@email.com', phone: '(303) 555-0156',
    source: 'walk-in', status: 'lost', vehicleInterest: 'Kawasaki Teryx KRX4',
    assignedTo: 'Jane Rodriguez', notes: 'Visited showroom, liked the KRX4 but went with competitor.',
    createdAt: '2026-04-05T14:00:00Z', lastContactAt: '2026-04-09T11:00:00Z',
  },
  {
    id: 'lead-008', name: 'Emily Turner', email: 'emily.t@email.com', phone: '(843) 555-0199',
    source: 'ai-agent', status: 'new', vehicleInterest: 'Star EV Sirius',
    assignedTo: '', notes: 'AI Agent captured interest. Looking for neighborhood vehicle.',
    createdAt: '2026-04-14T18:30:00Z', lastContactAt: '2026-04-14T18:30:00Z',
  },
];
