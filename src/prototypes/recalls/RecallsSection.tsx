import { useState } from 'react';
import { Stack, Group, Text, Button, AccordionSection, Badge, toast } from '../../rev';
import { RecallCard } from './RecallCard';
import type { VehicleRecallData, RecallStatus } from './mock-data';

interface RecallsSectionProps {
  vehicle: VehicleRecallData;
}

export function RecallsSection({ vehicle }: RecallsSectionProps) {
  const [statuses, setStatuses] = useState<Record<string, RecallStatus>>(() => {
    const initial: Record<string, RecallStatus> = {};
    vehicle.recalls.forEach((r) => {
      initial[r.id] = 'unassigned';
    });
    return initial;
  });

  const [savedStatuses, setSavedStatuses] = useState<Record<string, RecallStatus>>({ ...statuses });

  const hasChanges = JSON.stringify(statuses) !== JSON.stringify(savedStatuses);

  const openCount = Object.values(statuses).filter((s) => s === 'open').length;
  const unassignedCount = Object.values(statuses).filter((s) => s === 'unassigned').length;
  const hasRecalls = vehicle.recalls.length > 0;

  function handleStatusChange(recallId: string, newStatus: RecallStatus) {
    setStatuses((prev) => ({ ...prev, [recallId]: newStatus }));
  }

  function handleSave() {
    setSavedStatuses({ ...statuses });
    toast.success('Recall statuses saved successfully');
  }

  function handleDiscard() {
    setStatuses({ ...savedStatuses });
  }

  // Summary badge for the accordion header
  const summaryBadge = hasRecalls && unassignedCount > 0 ? (
    <Badge variant="neutral">{unassignedCount} unassigned</Badge>
  ) : null;

  return (
    <AccordionSection
      title="Recalls"
      defaultExpanded={true}
      rightAccessory={summaryBadge}
    >
      <Stack itemsSpacing="16">
        {/* No recalls state */}
        {!hasRecalls && (
          <Text size="bodySmall" color="secondary">
            No recalls detected on this model.
          </Text>
        )}

        {/* Has recalls */}
        {hasRecalls && (
          <Stack itemsSpacing="20">
            <Text size="bodySmall" color="secondary">
              Recall{vehicle.recalls.length > 1 ? 's' : ''} detected on this model. Each recall must be assigned a status to enable digital retail.
            </Text>

            {/* Recall cards */}
            {vehicle.recalls.map((recall) => (
              <RecallCard
                key={recall.id}
                recall={recall}
                status={statuses[recall.id]}
                onStatusChange={handleStatusChange}
              />
            ))}

            {/* NHTSA copy */}
            <Text size="bodySmall" color="secondary">
              You can verify recall details at the manufacturer's website or the National Highway Traffic Safety Administration (NHTSA) website.
            </Text>
          </Stack>
        )}

        {/* Save / Discard bar */}
        {hasRecalls && hasChanges && (
          <Group itemsSpacing="8" itemsAlignX="end" noWrap style={{
            padding: '12px 0 0',
          }}>
            <Button variant="ghost" onPress={handleDiscard}>Discard changes</Button>
            <Button variant="filled" onPress={handleSave}>Save</Button>
          </Group>
        )}
      </Stack>
    </AccordionSection>
  );
}
