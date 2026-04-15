/**
 * PreordersPlaceholder: Shows preorder list with mock data.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Group, Badge, Card, Tabs } from '../../../rev';
import { MOCK_PREORDERS } from '../../../sandbox/fixtures';

const STATUS_APPEARANCES: Record<string, 'positive' | 'warning' | 'neutral' | 'information'> = {
  pending_deposit: 'neutral',
  deposit_received: 'information',
  in_production: 'warning',
  ready_for_pickup: 'positive',
  converted: 'positive',
  canceled: 'neutral',
};

const STATUS_LABELS: Record<string, string> = {
  pending_deposit: 'Pending Deposit',
  deposit_received: 'Deposit Received',
  in_production: 'In Production',
  ready_for_pickup: 'Ready for Pickup',
  converted: 'Converted',
  canceled: 'Canceled',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function PreordersPlaceholder(): ReactNode {
  return (
    <Stack itemsSpacing="16">
      <Text size="heading" weight="bold">Preorders</Text>
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
        {MOCK_PREORDERS.map(po => (
          <Card key={po.id}>
            <Group itemsSpacing="16" itemsAlignY="center" padding={{ all: 16 }}>
              <Group.Item grow>
                <Stack itemsSpacing="4">
                  <Group itemsSpacing="8" itemsAlignY="center">
                    <Text size="body" weight="semibold">{po.preorderNumber}</Text>
                    <Badge appearance={STATUS_APPEARANCES[po.status] ?? 'neutral'}>
                      {STATUS_LABELS[po.status] ?? po.status}
                    </Badge>
                  </Group>
                  <Text size="bodySmall" color="secondary">{po.vehicleSummary}</Text>
                  <Text size="bodySmall" color="secondary">{po.buyerName}</Text>
                </Stack>
              </Group.Item>
              <Stack itemsSpacing="2">
                <Text size="body" weight="semibold">{formatCurrency(po.depositAmount)} deposit</Text>
                <Text size="bodySmall" color="secondary">ETA: {po.estimatedArrival}</Text>
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
