import { Stack, Text, Callout, Divider } from '../../rev';

/**
 * Stub showing where License Number and Primary Contract Signer moved to.
 * Not the full Business Details page, just enough to demonstrate the reorganization.
 */
export function BusinessDetailsSection() {
  return (
    <div
      style={{
        background: 'var(--rev-color-backgroundPrimary)',
        borderRadius: 'var(--rev-borderRadius-12)',
        border: '1px solid var(--rev-color-separatorTertiary)',
        padding: '24px',
      }}
    >
      <Stack itemsSpacing="16">
        <Stack itemsSpacing="4">
          <Text size="body" weight="bold">Business Details</Text>
          <Text size="footnote" color="tertiary">
            These fields have moved from the old Sales settings page to Business Details.
          </Text>
        </Stack>

        <Callout
          variant="information"
          message="License Number and Primary Contract Signer are now configured under Settings > Business Details, not Fees."
          appearance="outline"
        />

        <Divider />

        <Stack itemsSpacing="12">
          <FieldPreview label="License Number" value="CA-DLR-294817" />
          <FieldPreview label="Primary Contract Signer" value="Mike Rodriguez, General Manager" />
        </Stack>
      </Stack>
    </div>
  );
}

function FieldPreview({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 12px',
        background: 'var(--rev-color-backgroundSecondary)',
        borderRadius: 'var(--rev-borderRadius-8)',
      }}
    >
      <Text size="bodySmall" weight="medium">{label}</Text>
      <Text size="bodySmall" color="secondary">{value}</Text>
    </div>
  );
}
