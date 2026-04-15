/**
 * DiscountsPlaceholder: Shows discount codes list.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Group, Badge, Card, Button, Tabs } from '../../../rev';

const MOCK_DISCOUNTS = [
  { id: 'disc-001', code: 'SPRING2026', type: 'percentage' as const, value: 10, status: 'active', usageCount: 23, maxUses: 100 },
  { id: 'disc-002', code: 'WELCOME500', type: 'fixed' as const, value: 500, status: 'active', usageCount: 8, maxUses: 50 },
  { id: 'disc-003', code: 'MILITARY15', type: 'percentage' as const, value: 15, status: 'active', usageCount: 5, maxUses: null },
  { id: 'disc-004', code: 'BOGO2025', type: 'percentage' as const, value: 20, status: 'expired', usageCount: 42, maxUses: 50 },
];

export function DiscountsPlaceholder(): ReactNode {
  return (
    <Stack itemsSpacing="16">
      <Group itemsSpacing="12" itemsAlignY="center">
        <Group.Item grow>
          <Text size="heading" weight="bold">Discounts</Text>
        </Group.Item>
        <Button size="small">Create Discount</Button>
      </Group>

      <Tabs
        items={[
          { id: 'all', content: 'All' },
          { id: 'active', content: 'Active' },
          { id: 'expired', content: 'Expired' },
        ]}
        selectedKey="all"
        onSelect={() => {}}
      />

      <Stack itemsSpacing="8">
        {MOCK_DISCOUNTS.map(d => (
          <Card key={d.id}>
            <Group itemsSpacing="16" itemsAlignY="center" padding={{ all: 16 }}>
              <Group.Item grow>
                <Stack itemsSpacing="4">
                  <Group itemsSpacing="8" itemsAlignY="center">
                    <Text size="body" weight="semibold">{d.code}</Text>
                    <Badge appearance={d.status === 'active' ? 'positive' : 'neutral'}>{d.status}</Badge>
                  </Group>
                  <Text size="bodySmall" color="secondary">
                    {d.type === 'percentage' ? `${d.value}% off` : `$${d.value} off`}
                    {d.maxUses ? ` | ${d.usageCount}/${d.maxUses} used` : ` | ${d.usageCount} used`}
                  </Text>
                </Stack>
              </Group.Item>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
