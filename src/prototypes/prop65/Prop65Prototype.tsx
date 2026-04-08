import { useState } from 'react';
import {
  Stack, Group, Text, Divider, Button, Box, Badge, Callout,
  AccordionSection,
  useMediaQuery, ViewportWidthContext,
  NotesProvider, NotesToggle,
} from '../../rev';
import { Prop65Warning } from './Prop65Warning';
import { DEMO_SCENARIOS } from './mock-data';
import type { VehicleInfo } from './mock-data';
import { HideNotesContext } from './context';

// ---------------------------------------------------------------------------
// Use CA dealer + used vehicle as the base scenario
// All disclosures forced visible regardless of new/used condition
// ---------------------------------------------------------------------------
const DEALER = DEMO_SCENARIOS[0].dealer;
const VEHICLE = DEMO_SCENARIOS[0].vehicle;

// ---------------------------------------------------------------------------
// Dot separator (matches production VehicleDetailsTitle)
// ---------------------------------------------------------------------------
function DotSeparator() {
  return <Text color="secondary" size="footnote">{' \u2022 '}</Text>;
}

// ---------------------------------------------------------------------------
// SegmentedControl (matches production)
// ---------------------------------------------------------------------------
function SegmentedControl({ items, value, onChange }: {
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        borderRadius: 'var(--rev-borderRadius-full)',
        overflow: 'hidden',
        border: '1px solid var(--rev-color-separatorTertiary)',
        flexShrink: 0,
      }}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              lineHeight: '18px',
              fontFamily: 'var(--rev-fontFamily)',
              fontWeight: isActive ? 600 : 400,
              background: isActive ? 'var(--rev-color-carbonGray)' : 'transparent',
              color: isActive ? 'white' : 'var(--rev-color-textSecondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PriceBreakdownRow (matches production ListViewRow)
// ---------------------------------------------------------------------------
function PriceBreakdownRow({ label, value, isBold }: {
  label: string;
  value: string;
  isBold?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid var(--rev-color-separatorTertiary)',
      }}
    >
      <Text size="bodySmall" weight={isBold ? 'semibold' : undefined}>{label}</Text>
      <Text size="bodySmall" weight="semibold">{value}</Text>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FactCard (matches production VehicleDetailsKeyFacts)
// ---------------------------------------------------------------------------
function FactCard({ name, value, subtitle, icon }: {
  name: string;
  value: string;
  subtitle?: string;
  icon?: string;
}) {
  return (
    <Box background="secondary" rounding="12" padding="16">
      <Group itemsAlignX="space-between" itemsAlignY="start" noWrap>
        <Stack itemsSpacing="4">
          <Text size="footnote" color="secondary">{name}</Text>
          <Group itemsSpacing="8" itemsAlignY="center">
            <Text size="body" weight="semibold">{value}</Text>
            {subtitle && <Text size="bodySmall" color="secondary">{subtitle}</Text>}
          </Group>
        </Stack>
        {icon && (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '20px', color: 'var(--rev-color-textSuccess, #22c55e)', flexShrink: 0 }}
          >
            {icon}
          </span>
        )}
      </Group>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// KeySpecItem (matches production VehicleDetailsKeySpecsItem)
// ---------------------------------------------------------------------------
function KeySpecItem({ label, value }: { label: string; value: string }) {
  return (
    <Box background="secondary" rounding="10" padding={{ top: '12', right: '16', bottom: '12', left: '16' }}>
      <Text size="footnote" color="secondary">{label}</Text>
      <Text size="body" weight="semibold">{value}</Text>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// FeatureRow (matches production VehicleDetailsKeyFeatures)
// ---------------------------------------------------------------------------
function FeatureRow({ feature }: { feature: string }) {
  return (
    <Group itemsSpacing="10" itemsAlignY="center" noWrap>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '18px', color: 'var(--rev-color-textSuccess, #22c55e)', flexShrink: 0 }}
      >
        check_circle
      </span>
      <Text size="bodySmall">{feature}</Text>
    </Group>
  );
}

// ---------------------------------------------------------------------------
// HowItWorksStep (matches production)
// ---------------------------------------------------------------------------
function HowItWorksStep({ number, title, description }: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <Box background="primary" rounding="12" padding="20">
      <Stack itemsSpacing="8">
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--rev-color-carbonGray)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'var(--rev-fontFamily)',
            flexShrink: 0,
          }}
        >
          {number}
        </div>
        <Text size="bodySmall" weight="bold">{title}</Text>
        <Text size="footnote" color="secondary">{description}</Text>
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// RecallCard (matches production)
// ---------------------------------------------------------------------------
function RecallCard({ campaign }: {
  campaign: { campaignNumber: string; component: string; summary: string; remedy: string };
}) {
  return (
    <Box background="secondary" rounding="12" padding="16" style={{ border: '1px solid var(--rev-color-separatorTertiary)' }}>
      <Stack itemsSpacing="8">
        <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
          <Text size="footnote" weight="semibold" color="secondary">
            Campaign #{campaign.campaignNumber}
          </Text>
          <Badge variant="warning">Open</Badge>
        </Group>
        <Text size="bodySmall" weight="semibold">{campaign.component}</Text>
        <Text size="footnote" color="secondary">{campaign.summary}</Text>
        <Divider />
        <Stack itemsSpacing="2">
          <Text size="footnote" weight="semibold">Remedy</Text>
          <Text size="footnote" color="secondary">{campaign.remedy}</Text>
        </Stack>
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// ComplianceHighlight: dashed outline + label for disclosure callouts
// ---------------------------------------------------------------------------
function ComplianceHighlight({ label, ticket, condition, children }: {
  label: string;
  ticket: string;
  condition?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        border: '1.5px dashed #3b82f6',
        borderRadius: '8px',
        padding: '8px',
        margin: '4px 0',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-9px',
          left: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            background: '#3b82f6',
            color: 'white',
            fontSize: '9px',
            fontWeight: 700,
            fontFamily: 'var(--rev-fontFamily)',
            padding: '1px 8px',
            borderRadius: '4px',
            letterSpacing: '0.3px',
          }}
        >
          {label} ({ticket})
        </span>
        {condition && (
          <span
            style={{
              background: 'white',
              color: '#3b82f6',
              fontSize: '9px',
              fontWeight: 600,
              fontFamily: 'var(--rev-fontFamily)',
              padding: '1px 8px',
              borderRadius: '4px',
              letterSpacing: '0.3px',
              border: '1px solid #3b82f6',
            }}
          >
            {condition}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment Card (matches production SharedVehicleDetailsPayment layout)
// Production order: Price + Control > Financing breakdown > Payment methods
// accordion > Prequal banner > CTAs > Price breakdown > Social proof
// ---------------------------------------------------------------------------
function PaymentCard({ vehicle }: {
  vehicle: VehicleInfo;
}) {
  const [paymentSelection, setPaymentSelection] = useState('one-time');

  return (
    <div
      id="section-payment-card"
      style={{
        width: '100%',
        minWidth: '390px',
        position: 'sticky',
        top: '24px',
        alignSelf: 'flex-start',
      }}
    >
      <Box
        rounding="24"
        padding="24"
        style={{
          boxShadow: 'var(--rev-boxShadow-elevation3)',
          background: 'var(--rev-color-backgroundPrimary)',
        }}
      >
        <Stack itemsSpacing="24">

          {/* 1. Price + SegmentedControl (top row) */}
          <ComplianceHighlight label="Hang Tag / MSRP" ticket="BXP-1888" condition="New only">
            <Stack itemsSpacing="4">
              <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
                {paymentSelection === 'monthly' && vehicle.financing ? (
                  <Stack itemsSpacing="2">
                    <Text size="footnote" color="tertiary" style={{ textDecoration: 'line-through' }}>
                      ${vehicle.dealerRetailPrice.toLocaleString()}
                    </Text>
                    <Text size="title200" weight="semibold">
                      ${vehicle.financing.monthlyPayment}/mo*
                    </Text>
                  </Stack>
                ) : (
                  <Stack itemsSpacing="2">
                    <Text size="footnote" color="tertiary" style={{ textDecoration: 'line-through' }}>
                      ${vehicle.dealerRetailPrice.toLocaleString()}
                    </Text>
                    <Text size="title200" weight="semibold">
                      ${vehicle.advertisedPrice.toLocaleString()}
                    </Text>
                  </Stack>
                )}
                <SegmentedControl
                  items={[
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'one-time', label: 'One-time' },
                  ]}
                  value={paymentSelection}
                  onChange={setPaymentSelection}
                />
              </Group>

              {/* Financing breakdown (monthly) */}
              {paymentSelection === 'monthly' && vehicle.financing && (
                <Text size="footnote" color="secondary">
                  ${vehicle.financing.downPayment.toLocaleString()} down {'\u2022'} {vehicle.financing.apr}% APR {'\u2022'} {vehicle.financing.term} mo
                </Text>
              )}
            </Stack>
          </ComplianceHighlight>

          {/* Total Payment + Disclaimer (BXP-1892 / BXP-1896) */}
          {paymentSelection === 'monthly' && vehicle.financing && (
            <ComplianceHighlight label="Total Payment + Disclaimer" ticket="BXP-1892 / 1896" condition="Monthly selected">
              <Text size="caption" color="tertiary" style={{ lineHeight: '16px' }}>
                *Total of all payments: ${(vehicle.financing.monthlyPayment * vehicle.financing.term + vehicle.financing.downPayment).toLocaleString()}. Actual terms vary by creditworthiness.
              </Text>
            </ComplianceHighlight>
          )}

          {/* 2. Payment Methods Accordion */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                cursor: 'pointer',
                borderBottom: '1px solid var(--rev-color-separatorTertiary)',
              }}
            >
              <Text size="bodySmall" weight="semibold">
                {paymentSelection === 'monthly'
                  ? 'Monthly payment options (2)'
                  : 'One-time payment options (4)'}
              </Text>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '18px', color: 'var(--rev-color-textSecondary)' }}
              >
                expand_more
              </span>
            </div>
          </div>

          {/* 3. Prequal Banner (monthly only, matches production) */}
          {paymentSelection === 'monthly' && (
            <Callout
              variant="info"
              message="Check your rate in minutes with no impact to your credit score."
            />
          )}

          {/* 4. CTAs */}
          <Stack itemsSpacing="12">
            <Button
              variant="filled"
              style={{ width: '100%', padding: '14px 16px', fontSize: '15px' }}
            >
              Start my deal
            </Button>
            <Button
              variant="secondary"
              style={{ width: '100%', padding: '14px 16px', fontSize: '15px' }}
            >
              {paymentSelection === 'monthly' ? 'Get pre-qualified' : 'Contact dealer'}
            </Button>
          </Stack>

          {/* 5. Price breakdown */}
          <Stack itemsSpacing="0">
            <PriceBreakdownRow
              label="Vehicle price"
              value={`$${vehicle.advertisedPrice.toLocaleString()}`}
            />
            {paymentSelection === 'one-time' && (
              <ComplianceHighlight label="Hang Tag / Freight" ticket="BXP-1888" condition="New only">
                <PriceBreakdownRow
                  label="Manufacturer freight"
                  value="$400"
                />
              </ComplianceHighlight>
            )}
            {vehicle.financing && paymentSelection === 'monthly' && (
              <PriceBreakdownRow
                label="Est. monthly payment"
                value={`$${vehicle.financing.monthlyPayment}/mo`}
              />
            )}
            <PriceBreakdownRow
              label="Est. shipping"
              value="Calculated at checkout"
            />
            <PriceBreakdownRow
              label="Est. tax, title & reg."
              value="Calculated at checkout"
            />
          </Stack>

          {/* 6. Social proof */}
          <Group itemsAlignX="center" itemsAlignY="center" itemsSpacing="6">
            <span style={{ fontSize: '14px' }}>🔥</span>
            <Text size="footnote" color="tertiary">
              80% of buyers finance with Ekho
            </Text>
          </Group>


        </Stack>
      </Box>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main VDP Layout
// Section order matches production: apps/carthage/src/pages/routes/vehicle-details/index.tsx
// ---------------------------------------------------------------------------
function VDPContent() {
  const isCompact = useMediaQuery('(max-width: 980px)');
  const isDesktop = !isCompact;
  const isPhone = useMediaQuery('(max-width: 640px)');
  const dealer = DEALER;
  const vehicle = VEHICLE;
  const pad = isCompact ? '16px' : '48px';

  const titleParts = [
    vehicle.condition === 'new' ? 'New' : 'Pre-owned',
    vehicle.useType,
    vehicle.fuelType,
    vehicle.vehicleCategory,
  ].filter(Boolean);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--rev-color-backgroundPrimary)',
      }}
    >
      {/* ================================================================ */}
      {/* 1. TOOLBAR                                                       */}
      {/* ================================================================ */}
      <div style={{ padding: `12px ${pad}` }}>
        <Group itemsAlignX="space-between" itemsAlignY="center">
          <Group itemsSpacing="4" itemsAlignY="center">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--rev-color-textSecondary)' }}>
              arrow_back
            </span>
            <Text size="footnote" color="secondary">Back to results</Text>
          </Group>
          <Group itemsSpacing="12">
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--rev-color-textSecondary)', cursor: 'pointer' }}>share</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--rev-color-textSecondary)', cursor: 'pointer' }}>favorite_border</span>
          </Group>
        </Group>
      </div>

      {/* ================================================================ */}
      {/* 2. GALLERY                                                       */}
      {/* ================================================================ */}
      <div style={{ padding: `0 ${pad}` }}>
        <Box
          background="secondary"
          rounding="16"
          style={{
            width: '100%',
            height: isPhone ? '240px' : isCompact ? '320px' : '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <Badge variant={vehicle.condition === 'new' ? 'positive' : 'neutral'}>
              {vehicle.condition === 'new' ? 'New' : 'Pre-owned'}
            </Badge>
          </div>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '64px', color: 'var(--rev-color-textTertiary)', opacity: 0.4 }}
          >
            two_wheeler
          </span>
          <button
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              padding: '6px 12px',
              borderRadius: 'var(--rev-borderRadius-full)',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'white' }}>
              photo_library
            </span>
            <Text size="footnote" style={{ color: 'white' }}>
              All images ({vehicle.imageCount})
            </Text>
          </button>
        </Box>
      </div>

      {/* ================================================================ */}
      {/* TWO-COLUMN LAYOUT (main content + payment sidebar)               */}
      {/* ================================================================ */}
      <div
        style={{
          paddingTop: '24px',
          paddingLeft: pad,
          paddingRight: pad,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '48px',
          flexWrap: 'nowrap',
        }}
      >
        {/* ---- Main content column ---- */}
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <Stack itemsSpacing="0">

            {/* ============================================================ */}
            {/* 3. TITLE                                                      */}
            {/* ============================================================ */}
            <Stack itemsSpacing="8" style={{ paddingBottom: '24px' }}>
              <Text size="title200" weight="semibold" as="h1">
                {vehicle.year} {vehicle.make} {vehicle.model}{vehicle.trim ? ` ${vehicle.trim}` : ''}
              </Text>
              <Group itemsAlignY="center">
                {titleParts.map((part, i) => (
                  <span key={part} style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {i > 0 && <DotSeparator />}
                    <Text size="footnote" color="secondary">{part}</Text>
                  </span>
                ))}
              </Group>
            </Stack>

            {/* ============================================================ */}
            {/* 4. PAYMENT CARD (mobile only)                                */}
            {/* ============================================================ */}
            {!isDesktop && (
              <div style={{ paddingBottom: '32px' }}>
                <PaymentCard vehicle={vehicle} />
              </div>
            )}

            {/* ============================================================ */}
            {/* 5. KEY FACTS                                                  */}
            {/* ============================================================ */}
            <Stack itemsSpacing="16" style={{ paddingBottom: '32px' }}>
              <Text size="heading" weight="bold">Key facts</Text>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isPhone ? '1fr 1fr' : 'repeat(4, 1fr)',
                  gap: isPhone ? '8px' : '12px',
                }}
              >
                <FactCard
                  name="Condition"
                  value={vehicle.condition === 'new' ? 'New' : 'Pre-owned'}
                  subtitle={vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : undefined}
                />
                <FactCard
                  name="Availability"
                  value="Available online"
                  icon="check_circle"
                />
                <FactCard
                  name="Location"
                  value={`${dealer.city}, ${dealer.state}`}
                  subtitle={vehicle.distance}
                  icon="location_on"
                />
                <FactCard
                  name="Delivery"
                  value={vehicle.deliveryEstimate}
                  subtitle={vehicle.deliveryPrice}
                  icon="check_circle"
                />
              </div>
            </Stack>

            <Divider />

            {/* ============================================================ */}
            {/* 6. KEY SPECS                                                  */}
            {/* ============================================================ */}
            <Stack itemsSpacing="16" style={{ padding: '32px 0' }}>
              <Text size="heading" weight="bold">Key specs</Text>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                {vehicle.specs.slice(0, 6).map((spec) => (
                  <KeySpecItem key={spec.label} label={spec.label} value={spec.value} />
                ))}
              </div>
              {vehicle.specs.length > 6 && (
                <div>
                  <Button variant="filled">View all specs</Button>
                </div>
              )}
            </Stack>

            <Divider />

            {/* ============================================================ */}
            {/* 7. KEY FEATURES                                               */}
            {/* ============================================================ */}
            <AccordionSection title="Key features" defaultExpanded={true}>
              <Stack itemsSpacing="20">
                {vehicle.features.map((category) => (
                  <Stack key={category.name} itemsSpacing="8">
                    <Text size="bodySmall" weight="semibold" color="secondary">
                      {category.name}
                    </Text>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isPhone ? '1fr' : '1fr 1fr',
                        gap: '6px 24px',
                      }}
                    >
                      {category.features.map((f) => (
                        <FeatureRow key={f} feature={f} />
                      ))}
                    </div>
                  </Stack>
                ))}
              </Stack>
            </AccordionSection>
            <Divider />

            {/* ============================================================ */}
            {/* 8. TITLE HISTORY                                              */}
            {/* ============================================================ */}
            <AccordionSection title="Title history" defaultExpanded={false}>
              <Box background="secondary" rounding="12" padding="16">
                <Group itemsSpacing="12" itemsAlignY="center" noWrap>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--rev-color-textSuccess, #22c55e)' }}>verified</span>
                  <Stack itemsSpacing="2">
                    <Text size="bodySmall" weight="semibold">Clean title</Text>
                    <Text size="footnote" color="secondary">No reported accidents or damage history found.</Text>
                  </Stack>
                </Group>
              </Box>
            </AccordionSection>
            <Divider />

            {/* ============================================================ */}
            {/* 9. ACCESSORIES                                                */}
            {/* ============================================================ */}
            <AccordionSection title="Accessories" defaultExpanded={false}>
              <Text size="bodySmall" color="secondary">No accessories configured for this vehicle.</Text>
            </AccordionSection>
            <Divider />

          </Stack>
        </div>

        {/* ---- Desktop payment sidebar ---- */}
        {isDesktop && <PaymentCard vehicle={vehicle} />}
      </div>

      {/* ================================================================ */}
      {/* 10. HOW IT WORKS (secondary background, full width)              */}
      {/* ================================================================ */}
      <Box
        background="secondary"
        rounding="0"
        padding={{ top: '80', right: isPhone ? '16' : '48', bottom: '32', left: isPhone ? '16' : '48' }}
      >
        <Stack itemsSpacing="20">
          <Text size="heading" weight="bold">How it works</Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isPhone ? '1fr' : isCompact ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            <HowItWorksStep
              number={1}
              title="Enter order details"
              description="Choose your vehicle options, add-ons, and protection plans."
            />
            <HowItWorksStep
              number={2}
              title="Apply for financing"
              description="Get approved in minutes. Check your rate with no credit impact."
            />
            <HowItWorksStep
              number={3}
              title="Complete paperwork"
              description="E-sign your documents online. No trips to the dealership."
            />
            <HowItWorksStep
              number={4}
              title="Get your vehicle"
              description="Pick up at the dealer or get it delivered to your door."
            />
          </div>
        </Stack>
      </Box>

      {/* ================================================================ */}
      {/* 11. DEALER WARRANTY / BUY WITH CONFIDENCE                        */}
      {/* ================================================================ */}
      <div style={{ padding: `0 ${isCompact ? '16px' : '48px'}` }}>
        <Stack itemsSpacing="16" style={{ padding: '32px 0' }}>
          <Text size="heading" weight="bold">Buy with confidence</Text>
          <Box
            background="secondary"
            rounding="12"
            padding="20"
            style={{ border: '1px solid var(--rev-color-separatorTertiary)' }}
          >
            <Group itemsSpacing="12" itemsAlignY="start" noWrap>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '24px', color: 'var(--rev-color-textSecondary)', flexShrink: 0, marginTop: '2px' }}
              >
                gavel
              </span>
              <Stack itemsSpacing="4">
                <Text size="bodySmall" weight="bold">Sold As-Is</Text>
                <Text size="footnote" color="secondary">
                  This vehicle is sold as-is, where-is. No dealer warranty is included. Extended protection plans are available at checkout.
                </Text>
              </Stack>
            </Group>
          </Box>
        </Stack>
      </div>

      <div style={{ padding: `0 ${isCompact ? '16px' : '48px'}` }}>
        <Divider />
      </div>

      {/* ================================================================ */}
      {/* 12. RECALLS                                                      */}
      {/* ================================================================ */}
      <div style={{ padding: `0 ${isCompact ? '16px' : '48px'}` }}>
        <Stack itemsSpacing="0" style={{ padding: '32px 0 40px' }}>
          {vehicle.recalls.length > 0 && (
            <AccordionSection
              title="Recalls"
              defaultExpanded={true}
              rightAccessory={<Badge variant="warning">{vehicle.recalls.length} open</Badge>}
            >
              <Stack itemsSpacing="12">
                {vehicle.recalls.map((recall) => (
                  <RecallCard key={recall.campaignNumber} campaign={recall} />
                ))}
                <Text size="footnote" color="tertiary">
                  Recall data sourced from NHTSA.{' '}
                  <a
                    href="https://www.nhtsa.gov/recalls"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--rev-color-textSecondary)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                    }}
                  >
                    Check NHTSA
                  </a>
                </Text>
              </Stack>
            </AccordionSection>
          )}
        </Stack>
      </div>

      {/* ================================================================ */}
      {/* 13. AFFORDABLE PROTECTION + Add-On Notice (BXP-1895)             */}
      {/* ================================================================ */}
      <div id="section-affordable-protection">
        <Box
          padding={{ top: '80', bottom: '32' }}
          rounding="0"
          style={{ background: 'var(--rev-color-backgroundSecondary)' }}
        >
          <div style={{ padding: `0 ${isCompact ? '16px' : '48px'}` }}>
            <AccordionSection title="Affordable protection" defaultExpanded={false}>
              <Stack itemsSpacing="12">
                <ComplianceHighlight label="Add-On Notice" ticket="BXP-1895" condition="Add-on sections">
                  <Text size="bodySmall" color="secondary">
                    Protect your investment with extended coverage options available at checkout. Purchase not required.
                  </Text>
                </ComplianceHighlight>
                <div>
                  <Button variant="filled">Explore plans</Button>
                </div>
              </Stack>
            </AccordionSection>
          </div>
        </Box>
      </div>

      <div style={{ padding: `0 ${isCompact ? '16px' : '48px'}` }}>
        <Divider />
      </div>

      {/* ================================================================ */}
      {/* 14. MORE FROM US (dealer contact)                                */}
      {/* ================================================================ */}
      <div style={{ padding: `0 ${isCompact ? '16px' : '48px'}` }}>
        <Stack itemsSpacing="16" style={{ padding: '32px 0' }}>
          <Text size="heading" weight="bold">More from {dealer.name}</Text>
          <Box background="secondary" rounding="12" padding="20">
            <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
              <Stack itemsSpacing="4">
                <Text size="bodySmall" weight="semibold">{dealer.name}</Text>
                <Text size="footnote" color="secondary">{dealer.city}, {dealer.state}</Text>
                <Text size="footnote" color="secondary">{dealer.hours}</Text>
              </Stack>
              <Button variant="secondary" style={{ flexShrink: 0 }}>
                <Group itemsSpacing="4" itemsAlignY="center" noWrap>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>call</span>
                  <span>{dealer.phone}</span>
                </Group>
              </Button>
            </Group>
          </Box>
        </Stack>
      </div>

      <div style={{ padding: `0 ${isCompact ? '16px' : '48px'}` }}>
        <Divider />
      </div>

      {/* ================================================================ */}
      {/* 15. DISCLOSURES                                                  */}
      {/* ================================================================ */}
      <div id="section-disclosures" style={{ padding: `0 ${isCompact ? '16px' : '48px'}` }}>
        <Stack itemsSpacing="12" style={{ padding: '24px 0 16px' }}>
          <Text size="heading" weight="bold">Disclosures</Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            <Stack itemsSpacing="2">
              <Text size="footnote" color="tertiary">VIN</Text>
              <Text size="footnote" weight="semibold" style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                {vehicle.vin}
              </Text>
            </Stack>
            <Stack itemsSpacing="2">
              <Text size="footnote" color="tertiary">Stock #</Text>
              <Text size="footnote" weight="semibold">{vehicle.stockNumber}</Text>
            </Stack>
          </div>
          <Text size="footnote" color="tertiary" style={{ lineHeight: '18px' }}>
            Plus government fees and taxes, any finance charges, any dealer document
            processing charge, any electronic filing charge, and any emission testing charge.
            Prices are subject to change. Vehicle availability is not guaranteed. Images may
            not represent the actual vehicle.
          </Text>

          {/* ---- PROP 65 WARNING (BXP-1891) ---- */}
          <ComplianceHighlight label="Prop 65 Warning" ticket="BXP-1891" condition="All vehicles">
            <Prop65Warning dealer={dealer} buyerIsCA={false} />
          </ComplianceHighlight>

          {/* ---- USED VEHICLE INSPECTION NOTICE (BXP-1889) ---- */}
          <ComplianceHighlight label="Inspection Notice" ticket="BXP-1889" condition="Used only">
            <Text size="footnote" color="tertiary" style={{ lineHeight: '18px' }}>
              California law entitles you to have this vehicle inspected by an independent mechanic before purchase.
            </Text>
          </ComplianceHighlight>

          {/* ---- NO COOLING-OFF PERIOD (BXP-1890) ---- */}
          <ComplianceHighlight label="No Cooling-Off" ticket="BXP-1890" condition="All vehicles">
            <Text size="footnote" color="tertiary" style={{ lineHeight: '18px' }}>
              There is no cooling-off period unless you obtain a contract cancellation option.
            </Text>
          </ComplianceHighlight>
        </Stack>
      </div>

      {/* Bottom padding */}
      <div style={{ height: '80px' }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spec View components
// ---------------------------------------------------------------------------
function SpecSection({ title, badge, badgeColor, children }: {
  title: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Text size="title200" weight="bold">{title}</Text>
        {badge && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'var(--rev-fontFamily)',
              padding: '3px 10px',
              borderRadius: 'var(--rev-borderRadius-full)',
              background: badgeColor || 'var(--rev-color-carbonGray)',
              color: 'white',
              letterSpacing: '0.3px',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}


function DeviceFrame({
  width,
  label,
  children,
}: {
  width: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
      <Text size="footnote" color="tertiary" weight="semibold">{label}</Text>
      <ViewportWidthContext.Provider value={width}>
        <div
          style={{
            width: `${width}px`,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--rev-boxShadow-elevation3)',
            border: '1px solid var(--rev-color-separatorTertiary)',
            background: 'var(--rev-color-backgroundPrimary)',
            flexShrink: 0,
          }}
        >
          {children}
        </div>
      </ViewportWidthContext.Provider>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spec View
// ---------------------------------------------------------------------------
function SpecView() {
  return (
    <HideNotesContext.Provider value={true}>
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '60px 48px 120px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ---- PAGE HEADER ---- */}
        <div style={{ marginBottom: '48px', borderBottom: '2px solid var(--rev-color-separatorTertiary)', paddingBottom: '24px' }}>
          <Stack itemsSpacing="8">
            <Text size="title300" weight="bold">VDP CA Compliance Disclosures</Text>
            <Text size="body" color="secondary" style={{ maxWidth: '720px', lineHeight: '24px' }}>
              State-mandated disclosures placed in their correct production locations on the Vehicle Details Page.
              All items active regardless of vehicle type. CARS Act disclosures (SB 766) included proactively.
            </Text>
          </Stack>
        </div>

        {/* ============================================================ */}
        {/* 1. OVERVIEW TABLE                                             */}
        {/* ============================================================ */}
        <SpecSection title="Overview">
          <Stack itemsSpacing="16">
            <Text size="footnote" color="secondary" style={{ lineHeight: '20px' }}>
              All disclosures trigger when dealer is in CA OR buyer is in CA. Click any row to jump to the disclosure in the VDP below.
            </Text>
            <Box background="primary" rounding="12" padding="0" style={{ overflow: 'hidden', border: '1px solid var(--rev-color-separatorTertiary)' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: 'var(--rev-fontFamily)',
                  fontSize: '13px',
                }}
              >
                <thead>
                  <tr style={{ background: 'var(--rev-color-backgroundSecondary)' }}>
                    {['Disclosure', 'Ticket', 'VDP Section', 'Why here', 'Condition'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '10px 14px',
                          textAlign: 'left',
                          fontWeight: 600,
                          fontSize: '10px',
                          textTransform: 'uppercase' as const,
                          letterSpacing: '0.5px',
                          color: 'var(--rev-color-textTertiary)',
                          borderBottom: '1px solid var(--rev-color-separatorTertiary)',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Hang Tag / MSRP', ticket: 'BXP-1888', section: 'Payment Card', how: 'MSRP strikethrough + freight line item', why: 'CA law requires MSRP and freight displayed on new vehicles', condition: 'New only', regulation: 'VEH \u00A724014(a)', targetId: 'section-payment-card' },
                    { name: 'Total Payment + Disclaimer', ticket: 'BXP-1892 / 1896', section: 'Payment Card', how: 'Footnote on monthly view', why: 'SB 766 requires total cost and terms disclaimer alongside monthly payment', condition: 'Monthly selected', regulation: 'SB 766', targetId: 'section-payment-card' },
                    { name: 'Add-On Notice', ticket: 'BXP-1895', section: 'F&I + Accessories', how: '"Purchase not required." appended to copy', why: 'SB 766 requires "purchase not required" wherever add-ons are shown. Applies to both F&I and accessories sections.', condition: 'Add-on sections', regulation: 'SB 766', targetId: 'section-affordable-protection' },
                    { name: 'Inspection Notice', ticket: 'BXP-1889', section: 'Disclosures', how: 'Simple disclosure line', why: 'CA law requires notice of right to independent inspection on used vehicles', condition: 'Used only', regulation: 'VEH \u00A711709.1', targetId: 'section-disclosures' },
                    { name: 'No Cooling-Off', ticket: 'BXP-1890', section: 'Disclosures', how: 'Simple disclosure line', why: 'CA law requires notice that there is no return period', condition: 'All vehicles', regulation: 'VEH \u00A711709.2', targetId: 'section-disclosures' },
                    { name: 'Prop 65 Warning', ticket: 'BXP-1891', section: 'Disclosures', how: '"WARNING" hyperlink with safe harbor text', why: 'Prop 65 requires warning on products with known carcinogens', condition: 'All vehicles', regulation: '27 CCR \u00A725602(b)', targetId: 'section-disclosures' },
                  ].map((row, i) => (
                    <tr
                      key={row.ticket}
                      onClick={() => {
                        const el = document.getElementById(row.targetId);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          el.style.outline = '2px solid #3b82f6';
                          el.style.outlineOffset = '8px';
                          el.style.borderRadius = '8px';
                          el.style.transition = 'outline-color 1.5s ease';
                          setTimeout(() => { el.style.outlineColor = 'transparent'; }, 1500);
                        }
                      }}
                      style={{
                        borderBottom: i < 5 ? '1px solid var(--rev-color-separatorTertiary)' : undefined,
                        verticalAlign: 'top',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f7ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 500, color: '#3b82f6' }}>{row.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--rev-color-textTertiary)', marginTop: '2px' }}>{row.regulation}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{row.ticket}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 500 }}>{row.section}</div>
                        <div style={{ fontSize: '11px', color: 'var(--rev-color-textTertiary)', marginTop: '2px', lineHeight: '15px' }}>{row.how}</div>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--rev-color-textSecondary)', lineHeight: '17px' }}>
                        {row.why}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--rev-color-textSecondary)' }}>
                        {row.condition}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Stack>
        </SpecSection>

        {/* ============================================================ */}
        {/* 2. VDP PREVIEW (desktop only)                                */}
        {/* ============================================================ */}
        <SpecSection title="CA Dealer VDP" badge="All Disclosures" badgeColor="#2563eb">
          <DeviceFrame width={1100} label="Desktop (1100px)">
            <VDPContent />
          </DeviceFrame>
        </SpecSection>

      </div>
    </div>
    </HideNotesContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Main Export (spec view only, no mode toggle)
// ---------------------------------------------------------------------------
export function Prop65Prototype() {
  return (
    <NotesProvider>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <NotesToggle />
        <SpecView />
      </div>
    </NotesProvider>
  );
}
