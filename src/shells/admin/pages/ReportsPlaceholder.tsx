/**
 * ReportsPlaceholder: Shows reports landing page with report cards.
 */

import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Text, Card, Button, Group } from '../../../rev';
import { PRIMARY_SP_ID } from '../../../sandbox/fixtures';

const REPORTS = [
  { id: 'orders', title: 'Orders Report', description: 'Detailed order history with filtering and export', path: 'orders' },
  { id: 'payments', title: 'Payment Reconciliation', description: 'Payment status tracking and reconciliation', path: 'payments' },
];

export function ReportsPlaceholder(): ReactNode {
  const navigate = useNavigate();

  return (
    <Stack itemsSpacing="16">
      <Text size="heading" weight="bold">Reports</Text>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {REPORTS.map(report => (
          <Card key={report.id}>
            <Stack itemsSpacing="12" padding={{ all: 20 }}>
              <Text size="body" weight="semibold">{report.title}</Text>
              <Text size="bodySmall" color="secondary">{report.description}</Text>
              <Group>
                <Button
                  size="small"
                  variant="secondary"
                  onPress={() => navigate(`/admin/${PRIMARY_SP_ID}/reports/${report.path}`)}
                >
                  View Report
                </Button>
              </Group>
            </Stack>
          </Card>
        ))}
      </div>
    </Stack>
  );
}
