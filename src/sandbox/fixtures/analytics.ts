/**
 * Mock analytics and chart data.
 */

export interface MockChartPoint {
  date: string;
  value: number;
}

export interface MockAnalytics {
  traffic: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    avgSessionDuration: string;
    bounceRate: number;
    dailyVisitors: MockChartPoint[];
  };
  conversions: {
    totalLeads: number;
    totalOrders: number;
    conversionRate: number;
    avgOrderValue: number;
    weeklyOrders: MockChartPoint[];
  };
  inventory: {
    totalVehicles: number;
    availableVehicles: number;
    avgDaysOnLot: number;
    topCategory: string;
  };
  revenue: {
    mtdRevenue: number;
    lastMonthRevenue: number;
    ytdRevenue: number;
    monthlyRevenue: MockChartPoint[];
  };
}

export const MOCK_ANALYTICS: MockAnalytics = {
  traffic: {
    totalVisitors: 12450,
    uniqueVisitors: 8320,
    pageViews: 34200,
    avgSessionDuration: '3:42',
    bounceRate: 42.3,
    dailyVisitors: [
      { date: '2026-04-01', value: 380 }, { date: '2026-04-02', value: 415 },
      { date: '2026-04-03', value: 395 }, { date: '2026-04-04', value: 450 },
      { date: '2026-04-05', value: 520 }, { date: '2026-04-06', value: 480 },
      { date: '2026-04-07', value: 410 }, { date: '2026-04-08', value: 430 },
      { date: '2026-04-09', value: 445 }, { date: '2026-04-10', value: 460 },
      { date: '2026-04-11', value: 510 }, { date: '2026-04-12', value: 540 },
      { date: '2026-04-13', value: 495 }, { date: '2026-04-14', value: 420 },
    ],
  },
  conversions: {
    totalLeads: 87,
    totalOrders: 12,
    conversionRate: 13.8,
    avgOrderValue: 18945,
    weeklyOrders: [
      { date: 'W1 Apr', value: 3 }, { date: 'W2 Apr', value: 5 },
      { date: 'W3 Apr', value: 4 },
    ],
  },
  inventory: {
    totalVehicles: 48,
    availableVehicles: 35,
    avgDaysOnLot: 32,
    topCategory: 'Golf Carts',
  },
  revenue: {
    mtdRevenue: 147320,
    lastMonthRevenue: 198500,
    ytdRevenue: 892450,
    monthlyRevenue: [
      { date: 'Jan', value: 145200 }, { date: 'Feb', value: 168300 },
      { date: 'Mar', value: 198500 }, { date: 'Apr', value: 147320 },
    ],
  },
};
