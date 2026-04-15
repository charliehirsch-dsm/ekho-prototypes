/**
 * GenericPlaceholder: Fallback placeholder for pages not yet built out.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Card, Badge } from '../../../rev';

interface GenericPlaceholderProps {
  title: string;
  description?: string;
}

export function GenericPlaceholder({ title, description }: GenericPlaceholderProps): ReactNode {
  return (
    <Stack itemsSpacing="16">
      <Stack itemsSpacing="4">
        <Text size="heading" weight="bold">{title}</Text>
        {description && <Text size="bodySmall" color="secondary">{description}</Text>}
      </Stack>
      <Card>
        <Stack itemsSpacing="12" padding={{ all: 24 }}>
          <Badge appearance="neutral">Placeholder</Badge>
          <Text size="body" color="secondary">
            This page is a placeholder in the sandbox. Prototype components can be swapped in here.
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
