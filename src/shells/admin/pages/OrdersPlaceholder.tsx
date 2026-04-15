/**
 * OrdersPlaceholder: Shows a realistic orders list table with mock data.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Group, Badge, Card, Tabs } from '../../../rev';
import { MOCK_ORDERS } from '../../../sandbox/fixtures';

const STATUS_APPEARANCES: Record<string, 'positive' | 'warning' | 'negative' | 'neutral' | 'information'> = {
  completed: 'positive',
  financing_approved: 'positive',
  in_progress: 'information',
  financing_review: 'warning',
  pending: 'neutral',
  canceled: 'negative',
};

const STATUS_LABELS: Record<string, string> = {
  completed: 'Completed',
  financing_approved: 'Financing Approved',
  in_progress: 'In Progress',
  financing_review: 'Financing Review',
  pending: 'Pending',
  canceled: 'Canceled',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function OrdersPlaceholder(): ReactNode {
  return (
    <Stack itemsSpacing="16">
      <Text size="heading" weight="bold">Orders</Text>

      <Tabs
        items={[
          { id: 'all', content: 'All' },
          { id: 'active', content: 'Active' },
          { id: 'completed', content: 'Completed' },
        ]}
        selectedKey="all"
        onSelect={() => {}}
      />

      <Stack itemsSpacing="8">
        {MOCK_ORDERS.map(order => (
          <Card key={order.id}>
            <Group itemsSpacing="16" itemsAlignY="center" padding={{ all: 16 }}>
              <Group.Item grow>
                <Stack itemsSpacing="4">
                  <Group itemsSpacing="8" itemsAlignY="center">
                    <Text size="body" weight="semibold">{order.orderNumber}</Text>
                    <Badge appearance={STATUS_APPEARANCES[order.status] ?? 'neutral'}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </Group>
                  <Text size="bodySmall" color="secondary">{order.vehicleSummary}</Text>
                  <Text size="bodySmall" color="secondary">{order.buyerName}</Text>
                </Stack>
              </Group.Item>
              <Stack itemsSpacing="2">
                <Text size="body" weight="semibold">{formatCurrency(order.total)}</Text>
                <Text size="bodySmall" color="secondary">{formatDate(order.createdAt)}</Text>
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
