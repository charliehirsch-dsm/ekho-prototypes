/**
 * InventoryPlaceholder: Shows a vehicle inventory grid/list with mock data.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Group, Badge, Card, SearchInput } from '../../../rev';
import { MOCK_VEHICLES } from '../../../sandbox/fixtures';

const STATUS_APPEARANCES: Record<string, 'positive' | 'warning' | 'neutral' | 'information'> = {
  available: 'positive',
  reserved: 'warning',
  sold: 'neutral',
  pending: 'information',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function InventoryPlaceholder(): ReactNode {
  return (
    <Stack itemsSpacing="16">
      <Group itemsSpacing="12" itemsAlignY="center">
        <Group.Item grow>
          <Text size="heading" weight="bold">Inventory</Text>
        </Group.Item>
        <SearchInput
          placeholder="Search vehicles..."
          value=""
          onChange={() => {}}
          ariaLabel="Search inventory"
        />
      </Group>

      <Group itemsSpacing="8">
        <Badge appearance="neutral">{MOCK_VEHICLES.length} vehicles</Badge>
        <Badge appearance="positive">{MOCK_VEHICLES.filter(v => v.status === 'available').length} available</Badge>
      </Group>

      <Stack itemsSpacing="8">
        {MOCK_VEHICLES.slice(0, 12).map(vehicle => (
          <Card key={vehicle.id}>
            <Group itemsSpacing="16" itemsAlignY="center" padding={{ all: 16 }}>
              <div style={{ width: 80, height: 56, borderRadius: 8, backgroundColor: 'var(--rev-color-backgroundSecondary)', flexShrink: 0 }} />
              <Group.Item grow>
                <Stack itemsSpacing="4">
                  <Group itemsSpacing="8" itemsAlignY="center">
                    <Text size="body" weight="semibold">
                      {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                    </Text>
                    <Badge appearance={STATUS_APPEARANCES[vehicle.status] ?? 'neutral'}>
                      {vehicle.status}
                    </Badge>
                  </Group>
                  <Text size="bodySmall" color="secondary">
                    Stock #{vehicle.stockNumber} | VIN: {vehicle.vin.slice(-6)} | {vehicle.color}
                  </Text>
                </Stack>
              </Group.Item>
              <Stack itemsSpacing="2">
                <Text size="body" weight="semibold">{formatCurrency(vehicle.price)}</Text>
                {vehicle.condition === 'used' && (
                  <Text size="bodySmall" color="secondary">{vehicle.mileage.toLocaleString()} mi</Text>
                )}
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
