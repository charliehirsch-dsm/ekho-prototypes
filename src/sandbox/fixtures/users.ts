/**
 * Mock team member / user data.
 */

export interface MockTeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales' | 'finance' | 'viewer';
  avatarUrl: string;
  isActive: boolean;
  lastLoginAt: string;
}

export const MOCK_USERS_LIST: MockTeamMember[] = [
  {
    id: 'user-001', name: 'Mike Thompson', email: 'mike@thunderpowersports.com',
    role: 'admin', avatarUrl: '', isActive: true, lastLoginAt: '2026-04-15T08:00:00Z',
  },
  {
    id: 'user-002', name: 'Jane Rodriguez', email: 'jane@thunderpowersports.com',
    role: 'sales', avatarUrl: '', isActive: true, lastLoginAt: '2026-04-15T07:45:00Z',
  },
  {
    id: 'user-003', name: 'Tom Baker', email: 'tom@thunderpowersports.com',
    role: 'finance', avatarUrl: '', isActive: true, lastLoginAt: '2026-04-14T16:30:00Z',
  },
  {
    id: 'user-004', name: 'Sarah Kim', email: 'sarah@thunderpowersports.com',
    role: 'sales', avatarUrl: '', isActive: true, lastLoginAt: '2026-04-14T15:00:00Z',
  },
  {
    id: 'user-005', name: 'Dave Martinez', email: 'dave@thunderpowersports.com',
    role: 'manager', avatarUrl: '', isActive: false, lastLoginAt: '2026-03-20T10:00:00Z',
  },
];
