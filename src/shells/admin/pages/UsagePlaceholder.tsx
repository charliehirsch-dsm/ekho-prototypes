/**
 * UsagePlaceholder: Shows product usage metrics.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Card, Group } from '../../../rev';

const USAGE_ITEMS = [
  { product: 'Website', metric: 'Page views', value: '34,200', period: 'This month' },
  { product: 'Checkout', metric: 'Started checkouts', value: '87', period: 'This month' },
  { product: 'Checkout', metric: 'Completed orders', value: '12', period: 'This month' },
  { product: 'AI Sales Agent', metric: 'Conversations', value: '156', period: 'This month' },
  { product: 'AI Sales Agent', metric: 'Leads generated', value: '23', period: 'This month' },
  { product: 'Financing', metric: 'Applications submitted', value: '18', period: 'This month' },
];

export function UsagePlaceholder(): ReactNode {
  return (
    <Stack itemsSpacing="16">
      <Text size="heading" weight="bold">Usage</Text>
      <Stack itemsSpacing="8">
        {USAGE_ITEMS.map((item, idx) => (
          <Card key={idx}>
            <Group itemsSpacing="16" itemsAlignY="center" padding={{ all: 16 }}>
              <Group.Item grow>
                <Stack itemsSpacing="2">
                  <Text size="body" weight="semibold">{item.metric}</Text>
                  <Text size="bodySmall" color="secondary">{item.product}</Text>
                </Stack>
              </Group.Item>
              <Stack itemsSpacing="2">
                <Text size="heading" weight="bold">{item.value}</Text>
                <Text size="bodySmall" color="secondary">{item.period}</Text>
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
