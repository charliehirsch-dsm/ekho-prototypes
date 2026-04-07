import { Text, Dropdown } from '../../rev';
import type { Recall, RecallStatus } from './mock-data';
import { RECALL_STATUS_OPTIONS } from './mock-data';

interface RecallCardProps {
  recall: Recall;
  status: RecallStatus;
  onStatusChange: (recallId: string, status: RecallStatus) => void;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: '12px',
        padding: '12px 0',
        alignItems: 'baseline',
      }}
    >
      <Text size="bodySmall" weight="semibold">{label}</Text>
      <div>{children}</div>
    </div>
  );
}

export function RecallCard({ recall, status, onStatusChange }: RecallCardProps) {
  return (
    <div
      style={{
        background: 'var(--rev-color-backgroundSecondary)',
        borderRadius: 'var(--rev-borderRadius-10)',
        border: '1px solid var(--rev-color-separatorTertiary)',
        overflow: 'visible',
      }}
    >
      {/* Component description header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--rev-color-separatorTertiary)' }}>
        <Text size="bodySmall" color="secondary" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          {recall.componentDescription}
        </Text>
      </div>

      {/* Structured label-value rows */}
      <div style={{ padding: '4px 16px 16px' }}>
        <InfoRow label="Recall ID">
          <Text size="bodySmall">{recall.nhtsaCampaignNumber}</Text>
        </InfoRow>

        <InfoRow label="Issue">
          <Text size="bodySmall">{recall.risk}</Text>
        </InfoRow>

        <InfoRow label="Repair">
          <Text size="bodySmall">{recall.remedy}</Text>
        </InfoRow>

        {/* Assignment row with dropdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: '12px',
            padding: '12px 0 0',
            alignItems: 'center',
          }}
        >
          <Text size="bodySmall" weight="semibold">Assignment</Text>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <Dropdown
              options={RECALL_STATUS_OPTIONS}
              value={status}
              onSelectionChange={(val) => onStatusChange(recall.id, val as RecallStatus)}
              placeholder="Assign recall status"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
