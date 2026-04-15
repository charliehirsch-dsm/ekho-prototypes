/**
 * PrototypesIndex: List of all standalone feature prototypes.
 */

import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { Stack, Text, Card, Button, Group } from '../rev';

const PROTOTYPES = [
  { id: 'fees', name: 'Fees', description: 'Fee configuration and management UI', path: '/prototypes/fees' },
  { id: 'included-upgrades', name: 'Included Upgrades', description: 'VDP modifications / included upgrades section', path: '/prototypes/included-upgrades' },
  { id: 'inventory-tags', name: 'Inventory Tags', description: 'Tag system for inventory items and SRP', path: '/prototypes/inventory-tags' },
  { id: 'prop65', name: 'Prop 65', description: 'California Proposition 65 warning display', path: '/prototypes/prop65' },
  { id: 'recalls', name: 'Recalls', description: 'Vehicle recall notification cards', path: '/prototypes/recalls' },
];

export function PrototypesIndex(): ReactNode {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
      <Stack itemsSpacing="24">
        <Stack itemsSpacing="8">
          <Group itemsSpacing="12" itemsAlignY="center">
            <Button size="small" variant="secondary" onPress={() => navigate('/')}>Back</Button>
            <Text size="headingLarge" weight="bold">Standalone Prototypes</Text>
          </Group>
          <Text size="body" color="secondary">
            Feature prototypes running outside of any app shell.
          </Text>
        </Stack>

        {PROTOTYPES.map(proto => (
          <Card key={proto.id}>
            <Group itemsSpacing="16" itemsAlignY="center" padding={{ all: 16 }}>
              <Group.Item grow>
                <Stack itemsSpacing="4">
                  <Text size="body" weight="semibold">{proto.name}</Text>
                  <Text size="bodySmall" color="secondary">{proto.description}</Text>
                </Stack>
              </Group.Item>
              <Button size="small" onPress={() => navigate(proto.path)}>Open</Button>
            </Group>
          </Card>
        ))}
      </Stack>
    </div>
  );
}
