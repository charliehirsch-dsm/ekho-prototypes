import { Text, Stack, AccordionSection } from '../../rev';
import type { VehicleModificationsData } from './mock-data';

// ---------------------------------------------------------------------------
// Price field row (matches existing PricingSettings layout)
// ---------------------------------------------------------------------------
function PriceField({
  label,
  description,
  value,
  isDisabled,
}: {
  label: string;
  description: string;
  value: number;
  isDisabled?: boolean;
}) {
  return (
    <Stack itemsSpacing="4">
      <Text size="bodySmall" weight="semibold">{label}</Text>
      <div
        style={{
          padding: '8px 12px',
          borderRadius: 'var(--rev-borderRadius-8)',
          border: '1px solid var(--rev-color-separatorSecondary)',
          background: isDisabled
            ? 'var(--rev-color-backgroundSecondary)'
            : 'var(--rev-color-backgroundPrimary)',
          fontFamily: 'var(--rev-fontFamily)',
          fontSize: '13px',
          lineHeight: '18px',
          color: isDisabled
            ? 'var(--rev-color-textTertiary)'
            : 'var(--rev-color-textPrimary)',
        }}
      >
        ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>
      <Text size="caption" color="tertiary">{description}</Text>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Pricing Section (matches admin portal pattern)
// ---------------------------------------------------------------------------
export function PricingSection({
  vehicle,
}: {
  vehicle: VehicleModificationsData;
}) {
  return (
    <AccordionSection title="Pricing" defaultExpanded>
      <Stack itemsSpacing="16">
        <PriceField
          label="Dealer retail"
          description="You may enter your own retail price here. If provided, it will replace the MSRP as the reference price."
          value={vehicle.dealerRetailPrice}
        />

        <PriceField
          label="Advertised price"
          description="The price shown publicly on your listing."
          value={vehicle.advertisedPrice}
        />

        <PriceField
          label="Retail price"
          description="Your true selling price. Hidden until buyers share details."
          value={vehicle.retailPrice}
        />
      </Stack>
    </AccordionSection>
  );
}
