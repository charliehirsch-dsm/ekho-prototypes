/**
 * Mock conversation / message thread data.
 */

export interface MockMessage {
  id: string;
  sender: 'buyer' | 'agent' | 'dealer';
  senderName: string;
  content: string;
  timestamp: string;
}

export interface MockConversation {
  id: string;
  leadId: string;
  buyerName: string;
  subject: string;
  channel: 'ai-agent' | 'email' | 'sms';
  status: 'active' | 'resolved' | 'snoozed';
  messages: MockMessage[];
  createdAt: string;
  lastMessageAt: string;
}

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: 'conv-001', leadId: 'lead-001', buyerName: 'Brandon Foster',
    subject: 'Interest in 2026 Street Glide Special',
    channel: 'ai-agent', status: 'active',
    messages: [
      { id: 'msg-001', sender: 'buyer', senderName: 'Brandon Foster', content: 'Hey, I saw the 2026 Street Glide Special on your website. Is it still available?', timestamp: '2026-04-13T08:30:00Z' },
      { id: 'msg-002', sender: 'agent', senderName: 'AI Sales Agent', content: 'Hi Brandon! Yes, the 2026 Harley-Davidson Street Glide Special in Vivid Black is available. It features the Milwaukee-Eight 114 engine and the Boom! Box GTS infotainment system. Would you like to schedule a test ride or discuss financing options?', timestamp: '2026-04-13T08:30:15Z' },
      { id: 'msg-003', sender: 'buyer', senderName: 'Brandon Foster', content: 'What kind of financing can I get? Budget is around $25-30K', timestamp: '2026-04-13T08:32:00Z' },
      { id: 'msg-004', sender: 'agent', senderName: 'AI Sales Agent', content: 'Great news, the Street Glide Special is priced at $27,499 which fits right in your budget. We offer financing through multiple lenders with rates starting as low as 4.99% APR for qualified buyers. I can connect you with our finance team for a quick pre-qualification. Would that work for you?', timestamp: '2026-04-13T08:32:20Z' },
      { id: 'msg-005', sender: 'buyer', senderName: 'Brandon Foster', content: "Yeah let's do that. Can I also come in Saturday for a test ride?", timestamp: '2026-04-13T08:35:00Z' },
    ],
    createdAt: '2026-04-13T08:30:00Z', lastMessageAt: '2026-04-13T08:35:00Z',
  },
  {
    id: 'conv-002', leadId: 'lead-004', buyerName: 'Maria Gonzalez',
    subject: 'Yamaha MT-07 test ride request',
    channel: 'ai-agent', status: 'active',
    messages: [
      { id: 'msg-010', sender: 'buyer', senderName: 'Maria Gonzalez', content: "I'm interested in the MT-07. Do you have it in stock?", timestamp: '2026-04-10T09:45:00Z' },
      { id: 'msg-011', sender: 'agent', senderName: 'AI Sales Agent', content: 'Hi Maria! Yes, we have the 2026 Yamaha MT-07 in Team Yamaha Blue in stock. It is an incredible ride with the 689cc CP2 engine. Would you like to come in for a test ride?', timestamp: '2026-04-10T09:45:12Z' },
      { id: 'msg-012', sender: 'buyer', senderName: 'Maria Gonzalez', content: 'Yes! Can I come Saturday morning?', timestamp: '2026-04-10T09:47:00Z' },
    ],
    createdAt: '2026-04-10T09:45:00Z', lastMessageAt: '2026-04-10T09:47:00Z',
  },
  {
    id: 'conv-003', leadId: 'lead-008', buyerName: 'Emily Turner',
    subject: 'Neighborhood vehicle options',
    channel: 'ai-agent', status: 'active',
    messages: [
      { id: 'msg-020', sender: 'buyer', senderName: 'Emily Turner', content: "Looking for a golf cart for getting around our neighborhood. What do you recommend?", timestamp: '2026-04-14T18:30:00Z' },
      { id: 'msg-021', sender: 'agent', senderName: 'AI Sales Agent', content: "Hi Emily! For neighborhood use, I'd recommend the Star EV Sirius 2+2. It's a great option with seating for 4, a 48V lithium battery system, and street-legal speed of 25mph. We have one in Matte Black available now. Would you like more details on pricing?", timestamp: '2026-04-14T18:30:18Z' },
    ],
    createdAt: '2026-04-14T18:30:00Z', lastMessageAt: '2026-04-14T18:30:18Z',
  },
];
