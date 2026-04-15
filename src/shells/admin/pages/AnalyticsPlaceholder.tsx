/**
 * AnalyticsPlaceholder: Shows analytics dashboard with stat cards.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Group, Card } from '../../../rev';
import { MOCK_ANALYTICS } from '../../../sandbox/fixtures';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function StatCard({ label, value, subtext }: { label: string; value: string; subtext?: string }): ReactNode {
  return (
    <Card>
      <Stack itemsSpacing="4" padding={{ all: 16 }}>
        <Text size="bodySmall" color="secondary">{label}</Text>
        <Text size="heading" weight="bold">{value}</Text>
        {subtext && <Text size="bodySmall" color="secondary">{subtext}</Text>}
      </Stack>
    </Card>
  );
}

export function AnalyticsPlaceholder(): ReactNode {
  const { traffic, conversions, revenue, inventory } = MOCK_ANALYTICS;

  return (
    <Stack itemsSpacing="24">
      <Text size="heading" weight="bold">Analytics</Text>

      {/* Revenue row */}
      <Stack itemsSpacing="8">
        <Text size="body" weight="semibold">Revenue</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <StatCard label="MTD Revenue" value={formatCurrency(revenue.mtdRevenue)} />
          <StatCard label="Last Month" value={formatCurrency(revenue.lastMonthRevenue)} />
          <StatCard label="YTD Revenue" value={formatCurrency(revenue.ytdRevenue)} />
          <StatCard label="Avg Order Value" value={formatCurrency(conversions.avgOrderValue)} />
        </div>
      </Stack>

      {/* Traffic row */}
      <Stack itemsSpacing="8">
        <Text size="body" weight="semibold">Traffic</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <StatCard label="Total Visitors" value={traffic.totalVisitors.toLocaleString()} subtext="This month" />
          <StatCard label="Unique Visitors" value={traffic.uniqueVisitors.toLocaleString()} />
          <StatCard label="Avg Session" value={traffic.avgSessionDuration} />
          <StatCard label="Bounce Rate" value={`${traffic.bounceRate}%`} />
        </div>
      </Stack>

      {/* Conversions row */}
      <Stack itemsSpacing="8">
        <Text size="body" weight="semibold">Conversions</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <StatCard label="Total Leads" value={conversions.totalLeads.toString()} />
          <StatCard label="Total Orders" value={conversions.totalOrders.toString()} />
          <StatCard label="Conversion Rate" value={`${conversions.conversionRate}%`} />
          <StatCard label="Available Inventory" value={`${inventory.availableVehicles}/${inventory.totalVehicles}`} />
        </div>
      </Stack>

      {/* Chart placeholder */}
      <Card>
        <Stack itemsSpacing="12" padding={{ all: 24 }}>
          <Text size="body" weight="semibold">Daily Visitors</Text>
          <div style={{ height: 120 }}>
            <Group itemsSpacing="4" itemsAlignY="end">
              {traffic.dailyVisitors.map(point => (
                <div
                  key={point.date}
                  style={{
                    flex: 1,
                    height: `${(point.value / 600) * 100}%`,
                    backgroundColor: 'var(--rev-color-brand)',
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                  }}
                />
              ))}
            </Group>
          </div>
        </Stack>
      </Card>
    </Stack>
  );
}
