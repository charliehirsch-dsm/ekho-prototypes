/**
 * SettingsPlaceholder: Shows settings landing page with category cards.
 */

import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Text, Card, Group } from '../../../rev';
import { PRIMARY_SP_ID } from '../../../sandbox/fixtures';

const SETTINGS_SECTIONS = [
  { id: 'personal', title: 'Personal Settings', description: 'Profile, notifications, preferences', path: 'personal/details' },
  { id: 'account', title: 'Account Settings', description: 'Business details, bank account, team', path: 'account/business-details' },
  { id: 'products', title: 'Product Settings', description: 'Sales config, website, AI Sales Agent', path: 'products/website' },
  { id: 'resource', title: 'Resource Settings', description: 'Integrations, inventory settings, knowledge', path: 'resource/integrations' },
];

export function SettingsPlaceholder(): ReactNode {
  const navigate = useNavigate();

  return (
    <Stack itemsSpacing="16">
      <Text size="heading" weight="bold">Settings</Text>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {SETTINGS_SECTIONS.map(section => (
          <Card key={section.id}>
            <div
              style={{ cursor: 'pointer', padding: 20 }}
              onClick={() => navigate(`/admin/${PRIMARY_SP_ID}/settings/${section.path}`)}
            >
              <Stack itemsSpacing="8">
                <Text size="body" weight="semibold">{section.title}</Text>
                <Text size="bodySmall" color="secondary">{section.description}</Text>
              </Stack>
            </div>
          </Card>
        ))}
      </div>
    </Stack>
  );
}
