/**
 * LeadsPlaceholder: Shows a leads list with mock data.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Group, Badge, Card, Tabs } from '../../../rev';
import { MOCK_LEADS } from '../../../sandbox/fixtures';

const STATUS_APPEARANCES: Record<string, 'positive' | 'warning' | 'negative' | 'neutral' | 'information'> = {
  new: 'information',
  contacted: 'neutral',
  qualified: 'warning',
  proposal: 'warning',
  won: 'positive',
  lost: 'negative',
};

const SOURCE_LABELS: Record<string, string> = {
  'ai-agent': 'AI Agent',
  website: 'Website',
  phone: 'Phone',
  'walk-in': 'Walk-In',
  referral: 'Referral',
};

export function LeadsPlaceholder(): ReactNode {
  return (
    <Stack itemsSpacing="16">
      <Text size="heading" weight="bold">CRM</Text>

      <Tabs
        items={[
          { id: 'all', content: 'All' },
          { id: 'new', content: 'New' },
          { id: 'qualified', content: 'Qualified' },
          { id: 'won', content: 'Won' },
        ]}
        selectedKey="all"
        onSelect={() => {}}
      />

      <Stack itemsSpacing="8">
        {MOCK_LEADS.map(lead => (
          <Card key={lead.id}>
            <Group itemsSpacing="16" itemsAlignY="center" padding={{ all: 16 }}>
              <Group.Item grow>
                <Stack itemsSpacing="4">
                  <Group itemsSpacing="8" itemsAlignY="center">
                    <Text size="body" weight="semibold">{lead.name}</Text>
                    <Badge appearance={STATUS_APPEARANCES[lead.status] ?? 'neutral'}>
                      {lead.status}
                    </Badge>
                    <Badge appearance="neutral">{SOURCE_LABELS[lead.source] ?? lead.source}</Badge>
                  </Group>
                  <Text size="bodySmall" color="secondary">{lead.vehicleInterest}</Text>
                  {lead.assignedTo && (
                    <Text size="bodySmall" color="secondary">Assigned to {lead.assignedTo}</Text>
                  )}
                </Stack>
              </Group.Item>
              <Text size="bodySmall" color="secondary">{lead.email}</Text>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
