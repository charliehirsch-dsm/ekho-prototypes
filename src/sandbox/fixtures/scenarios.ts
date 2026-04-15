/**
 * Scenario compositions: combine fixtures into coherent data states.
 */

import { MOCK_DEALERS } from './dealers';
import { MOCK_VEHICLES } from './vehicles';
import { MOCK_ORDERS } from './orders';
import { MOCK_LEADS } from './leads';
import { MOCK_CONVERSATIONS } from './conversations';
import { MOCK_PREORDERS } from './preorders';
import { MOCK_USERS_LIST } from './users';
import { MOCK_FINANCING } from './financing';
import { MOCK_ANALYTICS } from './analytics';

import type { MockDealer } from './dealers';
import type { MockVehicle } from './vehicles';
import type { MockOrder } from './orders';
import type { MockLead } from './leads';
import type { MockConversation } from './conversations';
import type { MockPreorder } from './preorders';
import type { MockTeamMember } from './users';
import type { MockFinancingApplication } from './financing';
import type { MockAnalytics } from './analytics';

export interface Scenario {
  name: string;
  description: string;
  dealer: MockDealer;
  vehicles: MockVehicle[];
  orders: MockOrder[];
  leads: MockLead[];
  conversations: MockConversation[];
  preorders: MockPreorder[];
  users: MockTeamMember[];
  financing: MockFinancingApplication[];
  analytics: MockAnalytics;
}

export const SCENARIOS: Record<string, Scenario> = {
  activeDealer: {
    name: 'Active Dealer',
    description: 'Established dealer with inventory, orders, and leads. The default scenario.',
    dealer: MOCK_DEALERS[0],
    vehicles: MOCK_VEHICLES,
    orders: MOCK_ORDERS,
    leads: MOCK_LEADS,
    conversations: MOCK_CONVERSATIONS,
    preorders: MOCK_PREORDERS,
    users: MOCK_USERS_LIST,
    financing: MOCK_FINANCING,
    analytics: MOCK_ANALYTICS,
  },
  emptyStore: {
    name: 'Empty Store',
    description: 'Brand new dealer with no inventory or orders yet.',
    dealer: MOCK_DEALERS[2],
    vehicles: [],
    orders: [],
    leads: [],
    conversations: [],
    preorders: [],
    users: [MOCK_USERS_LIST[0]],
    financing: [],
    analytics: {
      traffic: { totalVisitors: 0, uniqueVisitors: 0, pageViews: 0, avgSessionDuration: '0:00', bounceRate: 0, dailyVisitors: [] },
      conversions: { totalLeads: 0, totalOrders: 0, conversionRate: 0, avgOrderValue: 0, weeklyOrders: [] },
      inventory: { totalVehicles: 0, availableVehicles: 0, avgDaysOnLot: 0, topCategory: 'N/A' },
      revenue: { mtdRevenue: 0, lastMonthRevenue: 0, ytdRevenue: 0, monthlyRevenue: [] },
    },
  },
  highVolume: {
    name: 'High Volume',
    description: 'Enterprise dealer with large inventory and many active orders.',
    dealer: MOCK_DEALERS[1],
    vehicles: MOCK_VEHICLES,
    orders: MOCK_ORDERS,
    leads: MOCK_LEADS,
    conversations: MOCK_CONVERSATIONS,
    preorders: MOCK_PREORDERS,
    users: MOCK_USERS_LIST,
    financing: MOCK_FINANCING,
    analytics: {
      ...MOCK_ANALYTICS,
      traffic: { ...MOCK_ANALYTICS.traffic, totalVisitors: 45200, uniqueVisitors: 28400 },
      conversions: { ...MOCK_ANALYTICS.conversions, totalLeads: 310, totalOrders: 48 },
      revenue: { ...MOCK_ANALYTICS.revenue, mtdRevenue: 542000, ytdRevenue: 2840000 },
    },
  },
};

export const DEFAULT_SCENARIO = SCENARIOS.activeDealer;
