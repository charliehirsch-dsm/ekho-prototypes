/**
 * PlanDetailsPlaceholder: Shows subscription plan details.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Card, Group, Badge, Divider } from '../../../rev';
import { PRIMARY_DEALER } from '../../../sandbox/fixtures';

export function PlanDetailsPlaceholder(): ReactNode {
  return (
    <Stack itemsSpacing="16">
      <Text size="heading" weight="bold">Plan Details</Text>

      <Card>
        <Stack itemsSpacing="16" padding={{ all: 24 }}>
          <Group itemsSpacing="12" itemsAlignY="center">
            <Text size="body" weight="bold">{PRIMARY_DEALER.name}</Text>
            <Badge appearance="positive">{PRIMARY_DEALER.tier}</Badge>
          </Group>

          <Divider />

          <Stack itemsSpacing="12">
            <Text size="body" weight="semibold">Active Products</Text>
            <Group itemsSpacing="8">
              {PRIMARY_DEALER.features.map(feature => (
                <Badge key={feature} appearance="neutral">{feature}</Badge>
              ))}
            </Group>
          </Stack>

          <Divider />

          <Stack itemsSpacing="8">
            <Group itemsSpacing="16">
              <Stack itemsSpacing="2">
                <Text size="bodySmall" color="secondary">Plan</Text>
                <Text size="body" weight="semibold">Growth</Text>
              </Stack>
              <Stack itemsSpacing="2">
                <Text size="bodySmall" color="secondary">Billing Cycle</Text>
                <Text size="body" weight="semibold">Monthly</Text>
              </Stack>
              <Stack itemsSpacing="2">
                <Text size="bodySmall" color="secondary">Next Invoice</Text>
                <Text size="body" weight="semibold">May 1, 2026</Text>
              </Stack>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
