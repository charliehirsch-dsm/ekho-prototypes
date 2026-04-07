import { useState } from 'react';
import {
  Stack, Group, Text, Divider, Button, Box, Badge, Callout,
  AccordionSection,
  useMediaQuery, ViewportWidthContext,
  NotesProvider, Note, NotesToggle,
} from '../../rev';
import { Prop65Warning } from './Prop65Warning';
import { DEMO_SCENARIOS } from './mock-data';
import type { DemoScenario, VehicleInfo, DealerInfo } from './mock-data';
import { HideNotesContext, useHideNotes } from './context';

// ---------------------------------------------------------------------------
// Device config
// ---------------------------------------------------------------------------
type DeviceMode = 'desktop' | 'tablet' | 'phone';

const DEVICE_CONFIG: Record<DeviceMode, { width: number | null; icon: string; label: string }> = {
  desktop: { width: null, icon: 'desktop_windows', label: 'Desktop' },
  tablet: { width: 768, icon: 'tablet', label: 'Tablet' },
  phone: { width: 390, icon: 'phone_iphone', label: 'Phone' },
};

// ---------------------------------------------------------------------------
// View config
// ---------------------------------------------------------------------------
type View = 'vdp' | 'settings';

const VIEW_LABELS: Record<View, string> = {
  vdp: 'Buyer VDP',
  settings: 'Settings',
};

// ---------------------------------------------------------------------------
// Dot separator (matches production VehicleDetailsTitle)
// ---------------------------------------------------------------------------
function DotSeparator() {
  return <Text color="secondary" size="footnote">{' \u2022 '}</Text>;
}

// ---------------------------------------------------------------------------
// SegmentedControl (lightweight, matches production SegmentedControl)
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
// PriceBreakdownRow (matches production ListViewRow in payment card)
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
// FactCard (matches production VehicleDetailsKeyFacts FactCard)
// Uses Box for background/rounding/padding like production.
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
// FeatureRow (matches production VehicleDetailsKeyFeatures check row)
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
// HowItWorksStep (matches production HowItWorks step cards)
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
// RecallCard (matches production Recalls accordion content)
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
// Payment Card (matches production VehicleDetailsPayment structure)
// Box rounding=24, elevation via boxShadow, SegmentedControl, ListViewRow
// pattern for price breakdown, Callout for prequal, social proof line.
// ---------------------------------------------------------------------------
function PaymentCard({
  vehicle,
  dealer,
  isDesktop,
  showCADisclosures,
}: {
  vehicle: VehicleInfo;
  dealer: DealerInfo;
  isDesktop: boolean;
  showCADisclosures: boolean;
}) {
  const [paymentSelection, setPaymentSelection] = useState('one-time');
  const savings = vehicle.dealerRetailPrice - vehicle.advertisedPrice;
  const hasSavings = savings > 0;
  const hideNotes = useHideNotes();

  return (
    <div
      style={{
        width: isDesktop ? 'min-content' : '100%',
        minWidth: isDesktop ? '390px' : undefined,
        position: isDesktop ? 'sticky' : undefined,
        top: isDesktop ? '24px' : undefined,
        alignSelf: isDesktop ? 'flex-start' : undefined,
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
          {/* Price + SegmentedControl */}
          <Stack itemsSpacing="4">
            <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
              {paymentSelection === 'monthly' && vehicle.financing ? (
                <Text size="title200" weight="semibold">
                  ${vehicle.financing.monthlyPayment}/mo
                </Text>
              ) : (
                <Text size="title200" weight="semibold">
                  ${vehicle.advertisedPrice.toLocaleString()}
                </Text>
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
            {hasSavings && paymentSelection === 'one-time' && (
              <Text size="footnote" style={{ color: '#16a34a' }}>
                ${savings.toLocaleString()} below dealer retail
              </Text>
            )}
            {paymentSelection === 'monthly' && vehicle.financing && (
              <Text size="footnote" color="secondary">
                ${vehicle.financing.downPayment.toLocaleString()} down, {vehicle.financing.apr}% APR, {vehicle.financing.term} mo
              </Text>
            )}
          </Stack>

          {/* CTAs */}
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
              Get pre-qualified
            </Button>
          </Stack>

          {/* Prequal banner */}
          <Callout
            variant="info"
            message="Check your rate in minutes with no impact to your credit score."
          />

          {/* Price breakdown */}
          <Stack itemsSpacing="0">
            <PriceBreakdownRow
              label="Vehicle price"
              value={`$${vehicle.advertisedPrice.toLocaleString()}`}
            />
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
            {/* Payment methods accordion header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                cursor: 'pointer',
              }}
            >
              <Text size="bodySmall" weight="semibold">Payment methods</Text>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '18px', color: 'var(--rev-color-textSecondary)' }}
              >
                expand_more
              </span>
            </div>
          </Stack>

          {/* Social proof */}
          <Text size="footnote" color="tertiary" style={{ textAlign: 'center' }}>
            80% of buyers finance with Ekho
          </Text>

          {/* ---- CARS Act: Total Payment Disclosure (BXP-1892) ---- */}
          {showCADisclosures && (
            <div style={{ position: 'relative' }}>
              {!hideNotes && (
                <Note pin={{ top: -4, left: 0 }} align="right">
                  <strong>Total Payment Disclosure (BXP-1892)</strong><br /><br />
                  <strong>Why here:</strong> SB 766 requires total payment to appear &ldquo;alongside&rdquo;
                  or &ldquo;in connection with&rdquo; any monthly payment advertisement. The Payment Card
                  is the only place on the VDP that shows monthly payments, so this disclosure must live
                  here, not in a generic Disclosures section at the bottom.<br /><br />
                  <strong>Status:</strong> N/A Powersports (SB 766 excludes motorcycles per VEH &sect;400).
                  Would apply if Ekho sells automobiles.
                </Note>
              )}
              <Box
                background="secondary"
                rounding="10"
                padding="12"
                style={{ opacity: 0.7 }}
              >
                <Stack itemsSpacing="4">
                  <Group itemsAlignX="space-between" noWrap>
                    <Text size="footnote" weight="semibold" style={{ color: '#b45309' }}>Total of all payments</Text>
                    <Text size="footnote" weight="semibold" style={{ color: '#b45309' }}>
                      ${vehicle.financing
                        ? (vehicle.financing.monthlyPayment * vehicle.financing.term + vehicle.financing.downPayment).toLocaleString()
                        : vehicle.advertisedPrice.toLocaleString()}
                    </Text>
                  </Group>
                  {vehicle.financing && (
                    <Text size="caption" color="tertiary">
                      {vehicle.financing.term} payments of ${vehicle.financing.monthlyPayment} + ${vehicle.financing.downPayment.toLocaleString()} down
                    </Text>
                  )}
                  <Group itemsSpacing="4" itemsAlignY="center">
                    <Badge variant="neutral">N/A Powersports</Badge>
                    <Text size="caption" color="tertiary">BXP-1892</Text>
                  </Group>
                </Stack>
              </Box>
            </div>
          )}

          {/* ---- CARS Act: Payment Comparison Disclaimer (BXP-1896) ---- */}
          {showCADisclosures && (
            <div style={{ position: 'relative' }}>
              {!hideNotes && (
                <Note pin={{ top: -4, left: 0 }} align="right">
                  <strong>Payment Comparison Disclaimer (BXP-1896)</strong><br /><br />
                  <strong>Why here:</strong> SB 766 requires this disclaimer to accompany any monthly
                  payment comparison or marketing claim (e.g., &ldquo;less than your phone bill&rdquo;).
                  The Payment Card contains the &ldquo;80% of buyers finance with Ekho&rdquo; social proof
                  line and the monthly payment display, so the disclaimer must be contextual here.<br /><br />
                  <strong>Status:</strong> N/A Powersports (SB 766 excludes motorcycles per VEH &sect;400).
                </Note>
              )}
              <Box
                background="secondary"
                rounding="10"
                padding={{ top: '8', right: '12', bottom: '8', left: '12' }}
                style={{ opacity: 0.7 }}
              >
                <Text size="caption" color="tertiary" style={{ lineHeight: '16px' }}>
                  Monthly payment amounts shown are estimates. Actual payment may vary based on
                  creditworthiness and lender terms. Total cost of financing may exceed the cash price.
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Group itemsSpacing="4" itemsAlignY="center">
                    <Badge variant="neutral">N/A Powersports</Badge>
                    <Text size="caption" color="tertiary">BXP-1896</Text>
                  </Group>
                </div>
              </Box>
            </div>
          )}
        </Stack>
      </Box>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Buyer VDP View
// ---------------------------------------------------------------------------
function BuyerVDPView({ scenario, buyerIsCA }: { scenario: DemoScenario; buyerIsCA: boolean }) {
  const isCompact = useMediaQuery('(max-width: 980px)');
  const isDesktop = !isCompact;
  const isPhone = useMediaQuery('(max-width: 640px)');
  const { dealer, vehicle } = scenario;
  const pad = isCompact ? '16px' : '48px';
  const hideNotes = useHideNotes();

  const titleParts = [
    vehicle.condition === 'new' ? 'New' : 'Pre-owned',
    vehicle.useType,
    vehicle.fuelType,
    vehicle.vehicleCategory,
  ].filter(Boolean);

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: 'var(--rev-color-backgroundPrimary)',
      }}
    >
      {/* Toolbar */}
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

      {/* Gallery */}
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
          {/* Listing badge */}
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

          {/* Image counter */}
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

      {/* Two-column content layout */}
      <div
        style={{
          paddingTop: '24px',
          paddingBottom: '0',
          paddingLeft: pad,
          paddingRight: pad,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '48px',
          flexWrap: 'nowrap',
        }}
      >
        {/* Main content column */}
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <Stack itemsSpacing="0">

            {/* ---- TITLE ---- */}
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

            {/* ---- MOBILE PAYMENT (between Title and Key Facts) ---- */}
            {!isDesktop && (
              <div style={{ paddingBottom: '32px' }}>
                <PaymentCard vehicle={vehicle} dealer={dealer} isDesktop={false} showCADisclosures={dealer.isCA || buyerIsCA} />
              </div>
            )}

            {/* ---- KEY FACTS ---- */}
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

              {/* ---- HANG TAG / MSRP (BXP-1888) ---- */}
              {(dealer.isCA || buyerIsCA) && vehicle.condition === 'new' && (
                <div style={{ position: 'relative' }}>
                  {!hideNotes && (
                    <Note pin={{ top: -4, right: 0 }} align="left">
                      <strong>OEM Hang Tag Data (BXP-1888)</strong><br /><br />
                      <strong>Why here:</strong> VEH &sect;24014(a) requires new motorcycles to display
                      manufacturer MSRP. This is pricing data, not a legal warning, so it belongs near
                      the pricing context (Key Facts) rather than in the Disclosures section. If
                      required online per OLIN 2021-01, buyers should see it alongside the advertised
                      price, not buried at the bottom of the page.<br /><br />
                      <strong>Conditional:</strong> Dealer in CA or buyer in CA, new vehicles only.<br /><br />
                      <strong>Status:</strong> Active. Building for launch (can&rsquo;t rule out applicability).
                    </Note>
                  )}
                  <Box
                    background="secondary"
                    rounding="12"
                    padding="12"
                    style={{ border: '1px solid var(--rev-color-separatorTertiary)' }}
                  >
                    <Stack itemsSpacing="4">
                      <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
                        <Text size="footnote" weight="semibold">Manufacturer Pricing</Text>
                      </Group>
                      <Group itemsAlignX="space-between" noWrap>
                        <Text size="footnote" color="secondary">MSRP</Text>
                        <Text size="footnote" weight="semibold">${vehicle.advertisedPrice.toLocaleString()}</Text>
                      </Group>
                      <Group itemsAlignX="space-between" noWrap>
                        <Text size="footnote" color="secondary">Destination &amp; Handling</Text>
                        <Text size="footnote" weight="semibold">$400</Text>
                      </Group>
                      <Divider />
                      <Group itemsAlignX="space-between" noWrap>
                        <Text size="footnote" weight="semibold">Total MSRP</Text>
                        <Text size="footnote" weight="semibold">${(vehicle.advertisedPrice + 400).toLocaleString()}</Text>
                      </Group>
                      <Text size="caption" color="tertiary">VEH &sect;24014 &middot; BXP-1888</Text>
                    </Stack>
                  </Box>
                </div>
              )}
            </Stack>

            <Divider />

            {/* ---- KEY SPECS ---- */}
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

            {/* ---- KEY FEATURES (AccordionSection, expanded) ---- */}
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

            {/* ---- TITLE HISTORY (collapsed stub) ---- */}
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

            {/* ---- ACCESSORIES (collapsed stub) ---- */}
            <AccordionSection title="Accessories" defaultExpanded={false}>
              <Text size="bodySmall" color="secondary">No accessories configured for this vehicle.</Text>
            </AccordionSection>
            <Divider />

            {/* ---- HOW IT WORKS ---- */}
            <div style={{ margin: '8px -16px 0' }}>
              <Box
                background="secondary"
                rounding={isDesktop ? '16' : '0'}
                padding={{ top: '32', right: isPhone ? '16' : '24', bottom: '32', left: isPhone ? '16' : '24' }}
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
            </div>

            {/* ---- BUY WITH CONFIDENCE (Dealer Warranty) ---- */}
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
                    {vehicle.condition === 'new' ? 'verified_user' : 'gavel'}
                  </span>
                  <Stack itemsSpacing="4">
                    <Text size="bodySmall" weight="bold">
                      {vehicle.condition === 'new' ? 'Manufacturer Warranty' : 'Sold As-Is'}
                    </Text>
                    <Text size="footnote" color="secondary">
                      {vehicle.condition === 'new'
                        ? 'This vehicle comes with the full manufacturer warranty. Coverage details vary by manufacturer.'
                        : 'This vehicle is sold as-is, where-is. No dealer warranty is included. Extended protection plans are available at checkout.'}
                    </Text>
                  </Stack>
                </Group>
              </Box>

              {/* ---- USED VEHICLE INSPECTION NOTICE (BXP-1889) ---- */}
              {(dealer.isCA || buyerIsCA) && vehicle.condition === 'used' && (
                <div style={{ position: 'relative' }}>
                  {!hideNotes && (
                    <Note pin={{ top: -4, right: 0 }} align="left">
                      <strong>Used Vehicle Inspection Notice (BXP-1889)</strong><br /><br />
                      <strong>Why here:</strong> VEH &sect;11709.1 requires dealers to inform buyers of their
                      right to an independent inspection before purchase. This is directly related to
                      vehicle condition and buyer confidence, so it belongs in &ldquo;Buy with Confidence&rdquo;
                      next to the warranty/as-is card, not in the Disclosures footer.<br /><br />
                      <strong>Conditional:</strong> Dealer in CA or buyer in CA, used vehicles only.<br /><br />
                      <strong>Status:</strong> Active. Building for launch (can&rsquo;t rule out applicability).
                    </Note>
                  )}
                  <Box
                    background="secondary"
                    rounding="12"
                    padding="16"
                    style={{ border: '1px solid var(--rev-color-separatorTertiary)' }}
                  >
                    <Group itemsSpacing="12" itemsAlignY="start" noWrap>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '20px', color: 'var(--rev-color-textSecondary)', flexShrink: 0, marginTop: '2px' }}
                      >
                        search
                      </span>
                      <Stack itemsSpacing="4">
                        <Group itemsSpacing="8" itemsAlignY="center">
                          <Text size="bodySmall" weight="semibold">Independent Inspection</Text>
                        </Group>
                        <Text size="footnote" color="secondary">
                          California law requires that this dealer allow you to have this vehicle
                          inspected by an independent mechanic before you buy it.
                        </Text>
                        <Text size="caption" color="tertiary">VEH &sect;11709.1 &middot; BXP-1889</Text>
                      </Stack>
                    </Group>
                  </Box>
                </div>
              )}
            </Stack>

            <Divider />

            {/* ---- RECALLS (conditional, uses AccordionSection) ---- */}
            {vehicle.recalls.length > 0 && (
              <>
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
                <Divider />
              </>
            )}

            {/* ---- AFFORDABLE PROTECTION (collapsed stub) ---- */}
            <AccordionSection title="Affordable protection" defaultExpanded={false}>
              <Stack itemsSpacing="12">
                <Text size="bodySmall" color="secondary">
                  Protect your investment with extended coverage options available at checkout.
                </Text>
                <div>
                  <Button variant="filled">Explore plans</Button>
                </div>

                {/* ---- CARS Act: Add-On Disclosure (BXP-1895) ---- */}
                {(dealer.isCA || buyerIsCA) && (
                  <div style={{ position: 'relative' }}>
                    {!hideNotes && (
                      <Note pin={{ top: -4, right: 0 }} align="left">
                        <strong>Add-On &ldquo;Purchase Not Required&rdquo; (BXP-1895)</strong><br /><br />
                        <strong>Why here:</strong> SB 766 requires the &ldquo;not required for purchase&rdquo;
                        disclosure wherever add-on products are presented. This means inside the Affordable
                        Protection section, the Accessories section, and the checkout add-on selection. It
                        cannot go in a generic Disclosures footer because buyers must see it in context
                        while they are evaluating the add-on.<br /><br />
                        <strong>Status:</strong> N/A Powersports (SB 766 excludes motorcycles per VEH &sect;400).
                      </Note>
                    )}
                    <Box
                      background="primary"
                      rounding="10"
                      padding={{ top: '8', right: '12', bottom: '8', left: '12' }}
                      style={{ opacity: 0.7 }}
                    >
                      <Group itemsSpacing="8" itemsAlignY="center" noWrap>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--rev-color-textTertiary)' }}>info</span>
                        <Text size="caption" color="secondary">
                          These add-on products are optional. Your financing terms will not change if you decline.
                        </Text>
                      </Group>
                      <div style={{ marginTop: '4px' }}>
                        <Group itemsSpacing="4" itemsAlignY="center">
                          <Badge variant="neutral">N/A Powersports</Badge>
                          <Text size="caption" color="tertiary">BXP-1895</Text>
                        </Group>
                      </div>
                    </Box>
                  </div>
                )}
              </Stack>
            </AccordionSection>
            <Divider />

            {/* ---- FAQ (collapsed stub) ---- */}
            <AccordionSection title="Frequently asked questions" defaultExpanded={false}>
              <Text size="bodySmall" color="secondary">FAQ content loads dynamically per vehicle.</Text>
            </AccordionSection>
            <Divider />

            {/* ============================================================ */}
            {/* DISCLOSURES (existing production section + compliance items) */}
            {/* ============================================================ */}
            <div style={{ position: 'relative' }}>
              {!hideNotes && (
                <Note pin={{ top: 8, right: 0 }} align="left">
                  <strong>Disclosures Section (DES-285)</strong><br /><br />
                  This section already exists in production with VIN, stock, and pricing disclaimers.
                  It is the natural home for compliance notices that don&rsquo;t have contextual
                  placement requirements. The Prop 65 WARNING link and No Cooling-Off notice belong
                  here because neither regulation specifies a particular page location, just
                  &ldquo;on the product display page.&rdquo;<br /><br />
                  <strong>Placement rationale:</strong> Per DES-285, compliance notices sit &ldquo;near
                  bottom of VDP, above footer&rdquo; and &ldquo;should not be visually alarming or
                  dominate the page.&rdquo; This mirrors Amazon, AutoZone, and other retailers.<br /><br />
                  <strong>What does NOT go here:</strong> Disclosures with contextual placement
                  requirements (CARS Act total payment must be in Payment Card, add-on disclosure
                  must be in Affordable Protection, payment comparison must accompany the claim,
                  MSRP data must be near pricing). Those are placed inline in their respective sections.
                </Note>
              )}
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

                {/* ---- PROP 65 WARNING (BXP-1891) inside Disclosures ---- */}
                <Prop65Warning dealer={dealer} buyerIsCA={buyerIsCA} />

                {/* ---- NO COOLING-OFF PERIOD (BXP-1890) ---- */}
                {(dealer.isCA || buyerIsCA) && (
                  <div style={{ position: 'relative' }}>
                    {!hideNotes && (
                      <Note pin={{ top: -4, right: 0 }} align="left">
                        <strong>No Cooling-Off Period (BXP-1890)</strong><br /><br />
                        <strong>Why here:</strong> VEH &sect;11709.2 requires this notice at the
                        dealership and on contracts. It&rsquo;s a general purchase warning with no
                        contextual placement requirement, so it fits naturally in the Disclosures
                        section alongside other legal notices. It does not need to be near a specific
                        UI element like the Payment Card or add-on selector.<br /><br />
                        <strong>Status:</strong> N/A Powersports. &sect;11709.2 explicitly excludes
                        motorcycles and off-highway vehicles. Also being repealed Oct 2026 by SB 766,
                        which replaces it with a mandatory 3-day return right for used autos under $50K.<br /><br />
                        <strong>Conditional:</strong> Dealer in CA or buyer in CA.
                      </Note>
                    )}
                    <Box
                      background="secondary"
                      rounding="10"
                      padding={{ top: '10', right: '12', bottom: '10', left: '12' }}
                      style={{ opacity: 0.7 }}
                    >
                      <Group itemsSpacing="8" itemsAlignY="center" noWrap>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--rev-color-textTertiary)' }}>info</span>
                        <Text size="caption" color="secondary">
                          There is no cooling-off period unless you obtain a contract cancellation option.
                        </Text>
                      </Group>
                      <div style={{ marginTop: '4px' }}>
                        <Group itemsSpacing="4" itemsAlignY="center">
                          <Badge variant="neutral">N/A Powersports</Badge>
                          <Text size="caption" color="tertiary">BXP-1890</Text>
                        </Group>
                      </div>
                    </Box>
                  </div>
                )}
              </Stack>
            </div>

            <Divider />

            {/* ---- MORE FROM US (dealer contact) ---- */}
            <Stack itemsSpacing="16" style={{ padding: '32px 0 40px' }}>
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

          </Stack>
        </div>

        {/* Desktop payment sidebar */}
        {isDesktop && <PaymentCard vehicle={vehicle} dealer={dealer} isDesktop={true} showCADisclosures={dealer.isCA || buyerIsCA} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings View (shows compliance config by state)
// ---------------------------------------------------------------------------
const COMPLIANCE_ITEMS = [
  {
    id: 'prop65',
    label: 'Proposition 65 Warning',
    ticket: 'BXP-1891',
    description: '"WARNING" link per 27 CCR \u00A725602(b). Applies to all vehicle types. Placed in Disclosures section.',
    states: ['CA'],
    status: 'active' as const,
  },
  {
    id: 'hang-tag',
    label: 'OEM Hang Tag / MSRP Data',
    ticket: 'BXP-1888',
    description: 'Manufacturer pricing per VEH \u00A724014. New motorcycles only. Placed in Key Facts (near pricing).',
    states: ['CA'],
    status: 'active' as const,
  },
  {
    id: 'inspection-sign',
    label: 'Used Vehicle Inspection Notice',
    ticket: 'BXP-1889',
    description: 'Inspection rights per VEH \u00A711709.1. Used vehicles only. Placed in Buy with Confidence.',
    states: ['CA'],
    status: 'active' as const,
  },
  {
    id: 'cooling-off',
    label: 'No Cooling-Off Period Notice',
    ticket: 'BXP-1890',
    description: 'VEH \u00A711709.2 no cooling-off notice. Placed in Disclosures section. Excludes motorcycles. Being repealed Oct 2026.',
    states: ['CA'],
    status: 'na-powersports' as const,
  },
  {
    id: 'cars-total-payment',
    label: 'Total Payment Disclosure',
    ticket: 'BXP-1892',
    description: 'Total payment alongside monthly payment. Placed in Payment Card (contextual). Excludes motorcycles. Federal rule withdrawn.',
    states: ['CA'],
    status: 'na-powersports' as const,
  },
  {
    id: 'cars-addon',
    label: 'Add-On "Purchase Not Required"',
    ticket: 'BXP-1895',
    description: 'Optional add-on disclosure. Placed in Affordable Protection (contextual). Excludes motorcycles per VEH \u00A7400.',
    states: ['CA'],
    status: 'na-powersports' as const,
  },
  {
    id: 'cars-payment-comparison',
    label: 'Payment Comparison Disclaimer',
    ticket: 'BXP-1896',
    description: 'Payment comparison disclaimer. Placed in Payment Card (contextual). Excludes motorcycles per VEH \u00A7400.',
    states: ['CA'],
    status: 'na-powersports' as const,
  },
];

function SettingsView({ scenario }: { scenario: DemoScenario }) {
  const isPhone = useMediaQuery('(max-width: 640px)');
  const { dealer } = scenario;
  const hideNotes = useHideNotes();

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: 'var(--rev-color-backgroundSecondary)',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: isPhone ? '24px 16px' : '40px 24px',
        }}
      >
        <Stack itemsSpacing="24">
          <Stack itemsSpacing="4">
            <Text size="heading" weight="bold">Compliance Notices</Text>
            <Text size="bodySmall" color="secondary">
              State-specific legal notices automatically shown on VDPs based on dealer location.
              These are not configurable; they activate when required by law.
            </Text>
          </Stack>

          <Box
            background="primary"
            rounding="12"
            padding={{ top: '12', right: '16', bottom: '12', left: '16' }}
            style={{ border: '1px solid var(--rev-color-separatorTertiary)' }}
          >
            <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
              <Stack itemsSpacing="2">
                <Text size="bodySmall" weight="semibold">Dealer Location</Text>
                <Text size="footnote" color="secondary">{dealer.name}</Text>
              </Stack>
              <Badge variant={dealer.isCA ? 'warning' : 'neutral'}>
                {dealer.state}
              </Badge>
            </Group>
          </Box>

          <Divider />

          <Stack itemsSpacing="12">
            {COMPLIANCE_ITEMS.map((item) => {
              const stateApplies = item.states.includes(dealer.state);
              const isActive = stateApplies && item.status !== 'na-powersports';
              return (
                <Box
                  key={item.id}
                  background="primary"
                  rounding="12"
                  padding="16"
                  style={{
                    border: '1px solid var(--rev-color-separatorTertiary)',
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  <Group itemsAlignX="space-between" itemsAlignY="start" noWrap>
                    <Stack itemsSpacing="4" style={{ flex: 1 }}>
                      <Group itemsSpacing="8" itemsAlignY="center">
                        <Text size="bodySmall" weight="semibold">{item.label}</Text>
                        {item.status === 'na-powersports' && (
                          <Badge variant="neutral">N/A Powersports</Badge>
                        )}
                      </Group>
                      <Text size="footnote" color="secondary">{item.description}</Text>
                      <Group itemsSpacing="8">
                        <Text size="footnote" color="tertiary">
                          Applies to: {item.states.join(', ')}
                        </Text>
                        <Text size="footnote" color="tertiary">&middot;</Text>
                        <Text size="footnote" color="tertiary">{item.ticket}</Text>
                      </Group>
                    </Stack>
                    {/* Toggle indicator */}
                    <div
                      style={{
                        width: '36px',
                        height: '20px',
                        borderRadius: '10px',
                        background: stateApplies && item.status === 'active'
                          ? '#22c55e'
                          : 'var(--rev-color-separatorTertiary)',
                        position: 'relative',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '2px',
                          left: stateApplies && item.status === 'active' ? '18px' : '2px',
                          transition: 'left 0.15s ease',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                        }}
                      />
                    </div>
                  </Group>
                </Box>
              );
            })}
          </Stack>

          {!hideNotes && (
            <div style={{ position: 'relative' }}>
              <Note inline>
                <strong>Settings behavior</strong>
                {' \u2014 '}
                In V1, compliance notices are automatic based on dealer state. There is no
                dealer toggle. This settings view shows which notices are active and why.
                Future versions may allow overrides for multi-state dealers.
              </Note>
            </div>
          )}
        </Stack>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spec View: scrollable narrative document with commentary sidebar
// ---------------------------------------------------------------------------

// Reusable spec layout components
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

function ContentWithCommentary({ children, commentary }: {
  children: React.ReactNode;
  commentary: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
      <div
        style={{
          width: '280px',
          flexShrink: 0,
          position: 'sticky',
          top: '56px',
        }}
      >
        {commentary}
      </div>
    </div>
  );
}

function CommentaryCard({ title, items }: {
  title: string;
  items: { tag?: 'regulation' | 'placement' | 'trigger' | 'note' | 'future'; text: string }[];
}) {
  const tagStyles: Record<string, { bg: string; color: string; label: string }> = {
    regulation: { bg: '#fef3c7', color: '#92400e', label: 'REGULATION' },
    placement: { bg: '#dbeafe', color: '#1e40af', label: 'PLACEMENT' },
    trigger: { bg: '#e0e7ff', color: '#3730a3', label: 'TRIGGER' },
    note: { bg: '#f3e8ff', color: '#6b21a8', label: 'NOTE' },
    future: { bg: '#d1fae5', color: '#065f46', label: 'FUTURE' },
  };

  return (
    <div
      style={{
        background: 'var(--rev-color-backgroundPrimary)',
        borderRadius: '12px',
        border: '1px solid var(--rev-color-separatorTertiary)',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      <Text
        size="footnote"
        weight="bold"
        style={{
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          color: '#b45309',
          marginBottom: '10px',
          display: 'block',
          fontSize: '10px',
        }}
      >
        {title}
      </Text>
      <Stack itemsSpacing="8">
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            {item.tag && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  fontFamily: 'var(--rev-fontFamily)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: tagStyles[item.tag].bg,
                  color: tagStyles[item.tag].color,
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap',
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              >
                {tagStyles[item.tag].label}
              </span>
            )}
            <Text size="footnote" color="secondary" style={{ lineHeight: '18px' }}>
              {item.text}
            </Text>
          </div>
        ))}
      </Stack>
    </div>
  );
}

function InfoCallout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#f0f7ff',
        border: '1px solid #bfdbfe',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '16px', color: '#2563eb', flexShrink: 0, marginTop: '1px' }}
      >
        info
      </span>
      <Text size="footnote" style={{ color: '#1e40af', lineHeight: '18px' }}>
        {children}
      </Text>
    </div>
  );
}

function DeviceFrame({
  width,
  height,
  label,
  children,
}: {
  width: number;
  height: number;
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
            height: `${height}px`,
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ---- PAGE HEADER ---- */}
        <div style={{ marginBottom: '48px', borderBottom: '2px solid var(--rev-color-separatorTertiary)', paddingBottom: '24px' }}>
          <Stack itemsSpacing="8">
            <Text size="title300" weight="bold">VDP CA Compliance Disclosures</Text>
            <Text size="body" color="secondary" style={{ maxWidth: '720px', lineHeight: '24px' }}>
              State-mandated disclosures placed in their correct production locations on the Vehicle Details Page.
              Three active items for powersports: Prop 65, Hang Tag MSRP, and Inspection Notice. CARS Act items are N/A for powersports but designed for extensibility.
            </Text>
          </Stack>
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[
              { color: '#22c55e', label: 'Active' },
              { color: '#d1d5db', label: 'N/A Powersports' },
            ].map((s) => (
              <Group key={s.label} itemsSpacing="6" itemsAlignY="center">
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                <Text size="footnote" color="secondary">{s.label}</Text>
              </Group>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. OVERVIEW (Inventory + Placement Rules)                    */}
        {/* ============================================================ */}
        <SpecSection title="Overview" badge="Inventory & Placement">
          <Stack itemsSpacing="16">
            <Text size="footnote" color="secondary" style={{ lineHeight: '20px' }}>
              All disclosures trigger when dealer is in CA OR buyer is in CA. Some are further conditional on vehicle attributes (new vs used) or vehicle type (motorcycles excluded from CARS Act per VEH 400). Not all disclosures go in one section: some regulations require contextual placement alongside the content they relate to.
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
                    {['Disclosure', 'Ticket', 'VDP Placement', 'Condition', 'Status'].map((h) => (
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
                    { name: 'Prop 65 Warning', ticket: 'BXP-1891', placement: 'Disclosures section', placementNote: 'No contextual requirement. Matches Amazon, AutoZone pattern.', condition: 'All vehicles', regulation: '27 CCR \u00A725602(b)', status: 'Active', color: '#22c55e' },
                    { name: 'OEM Hang Tag / MSRP', ticket: 'BXP-1888', placement: 'Key Facts', placementNote: 'Near pricing display. Pricing data belongs with pricing context.', condition: 'New only', regulation: 'VEH \u00A724014(a)', status: 'Active', color: '#22c55e' },
                    { name: 'Used Vehicle Inspection', ticket: 'BXP-1889', placement: 'Buy with Confidence', placementNote: 'Related to vehicle condition. Next to warranty/as-is card.', condition: 'Used only', regulation: 'VEH \u00A711709.1', status: 'Active', color: '#22c55e' },
                    { name: 'No Cooling-Off Period', ticket: 'BXP-1890', placement: 'Disclosures section', placementNote: 'General purchase warning, no contextual requirement.', condition: 'Excludes motorcycles', regulation: 'VEH \u00A711709.2', status: 'N/A Powersports', color: '#d1d5db' },
                    { name: 'Total Payment', ticket: 'BXP-1892', placement: 'Payment Card', placementNote: 'Must appear alongside monthly payment per SB 766.', condition: 'Excludes motorcycles', regulation: 'SB 766', status: 'N/A Powersports', color: '#d1d5db' },
                    { name: 'Add-On Notice', ticket: 'BXP-1895', placement: 'Affordable Protection', placementNote: 'Must appear where add-ons are presented per SB 766.', condition: 'Excludes motorcycles', regulation: 'SB 766', status: 'N/A Powersports', color: '#d1d5db' },
                    { name: 'Payment Comparison', ticket: 'BXP-1896', placement: 'Payment Card', placementNote: 'Must accompany any payment comparison claim.', condition: 'Excludes motorcycles', regulation: 'SB 766', status: 'N/A Powersports', color: '#d1d5db' },
                  ].map((row, i) => (
                    <tr key={row.ticket} style={{ borderBottom: i < 6 ? '1px solid var(--rev-color-separatorTertiary)' : undefined, verticalAlign: 'top' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 500 }}>{row.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--rev-color-textTertiary)', marginTop: '2px' }}>{row.regulation}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{row.ticket}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 500 }}>{row.placement}</div>
                        <div style={{ fontSize: '11px', color: 'var(--rev-color-textTertiary)', marginTop: '2px', lineHeight: '15px' }}>{row.placementNote}</div>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: 'var(--rev-color-textSecondary)' }}>
                        {row.condition}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <Group itemsSpacing="6" itemsAlignY="center">
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '12px' }}>{row.status}</span>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Stack>
        </SpecSection>

        {/* ============================================================ */}
        {/* 3. SCENARIO: CA DEALER, USED VEHICLE                         */}
        {/* ============================================================ */}
        <SpecSection title="CA Dealer, Used Vehicle" badge="Scenario" badgeColor="#2563eb">
          <ContentWithCommentary
            commentary={
              <>
                <CommentaryCard
                  title="Scenario Details"
                  items={[
                    { text: 'SoCal Motorcycles (San Diego, CA)' },
                    { text: '2025 Honda CRF450R, Pre-owned, $8,499' },
                    { text: 'Buyer location: non-CA' },
                    { text: 'Has open recall (Campaign #24V-847)' },
                  ]}
                />
                <CommentaryCard
                  title="Prop 65 Warning (BXP-1891)"
                  items={[
                    { tag: 'placement', text: 'Disclosures section, bottom of VDP. No contextual placement requirement.' },
                    { tag: 'regulation', text: '"WARNING" hyperlink per 27 CCR 25602(b). Must be the word "WARNING" in all caps. Not a design choice.' },
                    { tag: 'note', text: 'Collapsed: underlined link matching Amazon/AutoZone pattern. Expanded: exact safe harbor text from 27 CCR 25607.17.' },
                    { tag: 'trigger', text: 'Dealer in CA OR buyer in CA.' },
                  ]}
                />
                <CommentaryCard
                  title="Inspection Notice (BXP-1889)"
                  items={[
                    { tag: 'placement', text: 'Buy with Confidence section, next to warranty/as-is card. Related to vehicle condition.' },
                    { tag: 'regulation', text: 'VEH 11709.1: buyer right to independent inspection. Physical sign law (8"x10"), pending OLIN 2021-01.' },
                    { tag: 'trigger', text: 'Dealer in CA or buyer in CA, used vehicles only.' },
                  ]}
                />
                <CommentaryCard
                  title="No Cooling-Off (BXP-1890)"
                  items={[
                    { tag: 'placement', text: 'Disclosures section. General purchase warning, no contextual requirement.' },
                    { tag: 'regulation', text: 'VEH 11709.2. Excludes motorcycles. Being repealed Oct 2026 by SB 766.' },
                    { tag: 'trigger', text: 'Dealer in CA or buyer in CA.' },
                  ]}
                />
                <CommentaryCard
                  title="Payment Card Disclosures"
                  items={[
                    { tag: 'placement', text: 'Total payment (BXP-1892): in Payment Card alongside monthly payment per SB 766.' },
                    { tag: 'placement', text: 'Payment comparison (BXP-1896): in Payment Card alongside "80% of buyers finance" claim.' },
                    { tag: 'note', text: 'Both N/A powersports (SB 766 excludes motorcycles per VEH 400). Render at reduced opacity.' },
                  ]}
                />
                <CommentaryCard
                  title="Add-On Disclosure (BXP-1895)"
                  items={[
                    { tag: 'placement', text: 'Affordable Protection section. SB 766 requires "not required for purchase" where add-ons are presented.' },
                    { tag: 'note', text: 'N/A powersports. Would also appear in Accessories section and checkout if applicable.' },
                  ]}
                />
                <CommentaryCard
                  title="Disclosures Section (DES-285)"
                  items={[
                    { tag: 'placement', text: 'Bottom of VDP, above footer. Natural home for non-contextual compliance notices.' },
                    { tag: 'note', text: 'Mirrors Amazon, AutoZone. "Should not be visually alarming or dominate the page."' },
                    { tag: 'note', text: 'Contextual items (CARS Act, hang tag, inspection) are NOT placed here. They live inline in their respective sections.' },
                  ]}
                />
              </>
            }
          >
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              <DeviceFrame width={1100} height={900} label="Desktop">
                <BuyerVDPView scenario={DEMO_SCENARIOS[0]} buyerIsCA={false} />
              </DeviceFrame>
              <DeviceFrame width={390} height={844} label="Phone">
                <BuyerVDPView scenario={DEMO_SCENARIOS[0]} buyerIsCA={false} />
              </DeviceFrame>
            </div>
          </ContentWithCommentary>
        </SpecSection>

        {/* ============================================================ */}
        {/* 4. SCENARIO: NON-CA DEALER, BUYER IN CA                      */}
        {/* ============================================================ */}
        <SpecSection title="Non-CA Dealer, Buyer in CA" badge="Scenario" badgeColor="#2563eb">
          <InfoCallout>
            Prop 65 applies to any business selling/shipping to CA, not just CA-based businesses.
            A Georgia dealer with a California buyer must still show the WARNING link.
          </InfoCallout>
          <ContentWithCommentary
            commentary={
              <>
                <CommentaryCard
                  title="Scenario Details"
                  items={[
                    { text: 'Ride Atlanta Powersports (Atlanta, GA)' },
                    { text: '2024 Yamaha MT-07, Pre-owned, $6,299' },
                    { text: 'Buyer location: California' },
                  ]}
                />
                <CommentaryCard
                  title="Key Behavior"
                  items={[
                    { tag: 'trigger', text: 'Unified trigger: all CA disclosures appear because buyer is in CA, even though dealer is in GA' },
                    { tag: 'note', text: 'Same disclosures as a CA dealer scenario (minus vehicle-specific ones like hang tag for used)' },
                    { tag: 'note', text: 'CARS Act items appear but are N/A powersports' },
                    { tag: 'note', text: 'Compare with Scenario 3 (same dealer, non-CA buyer) where no disclosures appear' },
                  ]}
                />
                <CommentaryCard
                  title="Prop 65 Placement"
                  items={[
                    { tag: 'placement', text: 'Disclosures section. "WARNING" hyperlink per 27 CCR 25602(b), all caps, underlined.' },
                    { tag: 'regulation', text: 'Applies to any business selling/shipping to CA. Buyer location detected at checkout or IP geo.' },
                    { tag: 'note', text: 'Expanded state shows exact safe harbor text from 27 CCR 25607.17 for vehicle exposures.' },
                  ]}
                />
              </>
            }
          >
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              <DeviceFrame width={1100} height={900} label="Desktop (Buyer: CA)">
                <BuyerVDPView scenario={DEMO_SCENARIOS[1]} buyerIsCA={true} />
              </DeviceFrame>
              <DeviceFrame width={390} height={844} label="Phone (Buyer: CA)">
                <BuyerVDPView scenario={DEMO_SCENARIOS[1]} buyerIsCA={true} />
              </DeviceFrame>
            </div>
          </ContentWithCommentary>
        </SpecSection>

        {/* ============================================================ */}
        {/* 5. SCENARIO: NON-CA DEALER, NON-CA BUYER (baseline)          */}
        {/* ============================================================ */}
        <SpecSection title="Non-CA Dealer, Non-CA Buyer" badge="Baseline" badgeColor="#6b7280">
          <ContentWithCommentary
            commentary={
              <CommentaryCard
                title="Baseline"
                items={[
                  { text: 'Same Ride Atlanta listing as above, but buyer is not in CA.' },
                  { tag: 'note', text: 'Zero compliance disclosures appear. This is the clean VDP experience for non-CA transactions.' },
                  { tag: 'note', text: 'Compare with Scenario 2 to see what the buyer-location trigger adds.' },
                ]}
              />
            }
          >
            <DeviceFrame width={1100} height={900} label="Desktop (no disclosures)">
              <BuyerVDPView scenario={DEMO_SCENARIOS[1]} buyerIsCA={false} />
            </DeviceFrame>
          </ContentWithCommentary>
        </SpecSection>

        {/* ============================================================ */}
        {/* 6. SCENARIO: CA DEALER, NEW VEHICLE                          */}
        {/* ============================================================ */}
        <SpecSection title="CA Dealer, New Vehicle" badge="Scenario" badgeColor="#2563eb">
          <ContentWithCommentary
            commentary={
              <>
                <CommentaryCard
                  title="Scenario Details"
                  items={[
                    { text: 'SoCal Motorcycles (San Diego, CA)' },
                    { text: '2026 Kawasaki Ninja 400 ABS, New, $5,599' },
                    { text: 'Buyer location: non-CA' },
                  ]}
                />
                <CommentaryCard
                  title="New vs Used Differences"
                  items={[
                    { tag: 'note', text: 'Inspection notice does NOT appear (used vehicles only)' },
                    { tag: 'note', text: 'Buy with Confidence shows "Manufacturer Warranty" instead of "Sold As-Is"' },
                    { tag: 'note', text: 'No recalls on this vehicle, so Recalls section is hidden' },
                    { tag: 'note', text: 'No Cooling-Off still appears (CA dealer) but is N/A powersports' },
                  ]}
                />
                <CommentaryCard
                  title="Hang Tag MSRP (BXP-1888)"
                  items={[
                    { tag: 'placement', text: 'Key Facts section, near the pricing display. Pricing data belongs with pricing context.' },
                    { tag: 'regulation', text: 'VEH 24014(a): new motorcycles must display manufacturer MSRP. Physical labeling law.' },
                    { tag: 'trigger', text: 'Dealer in CA or buyer in CA, new vehicles only.' },
                    { tag: 'note', text: 'Active for launch. Building now since we cannot rule out applicability to VDPs.' },
                  ]}
                />
              </>
            }
          >
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              <DeviceFrame width={1100} height={900} label="Desktop">
                <BuyerVDPView scenario={DEMO_SCENARIOS[2]} buyerIsCA={false} />
              </DeviceFrame>
              <DeviceFrame width={390} height={844} label="Phone">
                <BuyerVDPView scenario={DEMO_SCENARIOS[2]} buyerIsCA={false} />
              </DeviceFrame>
            </div>
          </ContentWithCommentary>
        </SpecSection>

        {/* ============================================================ */}
        {/* 7. SETTINGS VIEW                                              */}
        {/* ============================================================ */}
        <SpecSection title="Settings: Compliance Notices" badge="Admin Portal" badgeColor="#7c3aed">
          <ContentWithCommentary
            commentary={
              <CommentaryCard
                title="Design Notes"
                items={[
                  { tag: 'note', text: 'Read-only in V1. Compliance notices auto-activate based on dealer state. No dealer toggle.' },
                  { tag: 'future', text: 'V2 may add overrides for multi-state dealers.' },
                  { tag: 'note', text: 'Green toggle = active, gray = N/A powersports.' },
                  { tag: 'note', text: 'Each item shows its Linear ticket ID for traceability.' },
                ]}
              />
            }
          >
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              <DeviceFrame width={700} height={700} label="CA Dealer (7 items visible)">
                <SettingsView scenario={DEMO_SCENARIOS[0]} />
              </DeviceFrame>
              <DeviceFrame width={700} height={700} label="Non-CA Dealer (all dimmed)">
                <SettingsView scenario={DEMO_SCENARIOS[1]} />
              </DeviceFrame>
            </div>
          </ContentWithCommentary>
        </SpecSection>

      </div>
    </div>
    </HideNotesContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Main Prototype Export
// ---------------------------------------------------------------------------
type ProtoMode = 'spec' | 'interactive';

export function Prop65Prototype() {
  const [mode, setMode] = useState<ProtoMode>('spec');
  const [view, setView] = useState<View>('vdp');
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [activeScenario, setActiveScenario] = useState(0);
  const [buyerIsCA, setBuyerIsCA] = useState(false);

  const scenario = DEMO_SCENARIOS[activeScenario];
  const overrideWidth = DEVICE_CONFIG[device].width;
  const isConstrained = overrideWidth !== null;

  return (
    <NotesProvider>
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: mode === 'spec'
            ? 'var(--rev-color-backgroundTertiary)'
            : isConstrained ? 'var(--rev-color-backgroundTertiary)' : undefined,
          overflow: mode === 'interactive' && isConstrained ? 'hidden' : undefined,
          height: mode === 'interactive' ? '100vh' : undefined,
        }}
      >
        <NotesToggle />

        {/* Mode toggle (top-left) */}
        <div
          style={{
            position: 'fixed',
            top: '12px',
            left: '12px',
            zIndex: 9991,
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            background: 'var(--rev-color-backgroundPrimary)',
            borderRadius: 'var(--rev-borderRadius-full)',
            boxShadow: 'var(--rev-boxShadow-elevation3)',
            border: '1px solid var(--rev-color-separatorTertiary)',
            overflow: 'hidden',
          }}
        >
          {(['spec', 'interactive'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                fontFamily: 'var(--rev-fontFamily)',
                fontSize: '11px',
                lineHeight: '16px',
                fontWeight: mode === m ? 600 : 400,
                padding: '6px 12px',
                border: 'none',
                cursor: 'pointer',
                background: mode === m
                  ? 'var(--rev-color-carbonGray)'
                  : 'var(--rev-color-backgroundPrimary)',
                color: mode === m
                  ? 'var(--rev-color-textInvertPrimary)'
                  : 'var(--rev-color-textSecondary)',
                transition: 'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {m === 'spec' ? 'article' : 'touch_app'}
              </span>
              {m === 'spec' ? 'Spec' : 'Interactive'}
            </button>
          ))}
        </div>

        {mode === 'spec' ? (
          <SpecView />
        ) : (
          <>
            {/* Floating control bar (interactive mode only) */}
            <div
              style={{
                position: 'fixed',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9990,
                display: 'flex',
                alignItems: 'center',
                gap: '0',
                background: 'var(--rev-color-backgroundPrimary)',
                borderRadius: 'var(--rev-borderRadius-full)',
                boxShadow: 'var(--rev-boxShadow-elevation3)',
                border: '1px solid var(--rev-color-separatorTertiary)',
                overflow: 'hidden',
              }}
            >
              {/* View switcher */}
              {(['vdp', 'settings'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    fontFamily: 'var(--rev-fontFamily)',
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontWeight: view === v
                      ? 'var(--rev-fontWeight-semibold)' as unknown as number
                      : 'var(--rev-fontWeight-regular)' as unknown as number,
                    padding: '6px 14px',
                    border: 'none',
                    cursor: 'pointer',
                    background: view === v
                      ? 'var(--rev-color-carbonGray)'
                      : 'var(--rev-color-backgroundPrimary)',
                    color: view === v
                      ? 'var(--rev-color-textInvertPrimary)'
                      : 'var(--rev-color-textSecondary)',
                    transition: 'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {VIEW_LABELS[v]}
                </button>
              ))}

              <div style={{ width: '1px', height: '18px', background: 'var(--rev-color-separatorTertiary)', flexShrink: 0 }} />

              {/* Demo scenario switcher */}
              {DEMO_SCENARIOS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveScenario(i)}
                  style={{
                    fontFamily: 'var(--rev-fontFamily)',
                    fontSize: '11px',
                    lineHeight: '16px',
                    padding: '6px 10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: i === activeScenario ? 600 : 400,
                    background: i === activeScenario
                      ? 'var(--rev-color-carbonGray)'
                      : 'var(--rev-color-backgroundPrimary)',
                    color: i === activeScenario
                      ? 'var(--rev-color-textInvertPrimary)'
                      : 'var(--rev-color-textSecondary)',
                    transition: 'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </button>
              ))}

              <div style={{ width: '1px', height: '18px', background: 'var(--rev-color-separatorTertiary)', flexShrink: 0 }} />

              {/* Buyer location toggle */}
              {(['other', 'ca'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setBuyerIsCA(loc === 'ca')}
                  style={{
                    fontFamily: 'var(--rev-fontFamily)',
                    fontSize: '11px',
                    lineHeight: '16px',
                    padding: '6px 10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: (loc === 'ca') === buyerIsCA ? 600 : 400,
                    background: (loc === 'ca') === buyerIsCA
                      ? 'var(--rev-color-carbonGray)'
                      : 'var(--rev-color-backgroundPrimary)',
                    color: (loc === 'ca') === buyerIsCA
                      ? 'var(--rev-color-textInvertPrimary)'
                      : 'var(--rev-color-textSecondary)',
                    transition: 'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {loc === 'ca' ? 'Buyer: CA' : 'Buyer: Other'}
                </button>
              ))}

              <div style={{ width: '1px', height: '18px', background: 'var(--rev-color-separatorTertiary)', flexShrink: 0 }} />

              {/* Device toggle */}
              {(['desktop', 'tablet', 'phone'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  title={DEVICE_CONFIG[d].label}
                  style={{
                    fontFamily: 'var(--rev-fontFamily)',
                    padding: '5px 8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: device === d
                      ? 'var(--rev-color-carbonGray)'
                      : 'var(--rev-color-backgroundPrimary)',
                    color: device === d
                      ? 'var(--rev-color-textInvertPrimary)'
                      : 'var(--rev-color-textTertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {DEVICE_CONFIG[d].icon}
                  </span>
                </button>
              ))}
            </div>

            {/* Content */}
            <ViewportWidthContext.Provider value={overrideWidth}>
              {isConstrained ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    height: '100vh',
                    paddingTop: '56px',
                    paddingBottom: '16px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${overrideWidth}px`,
                      height: 'calc(100vh - 72px)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: 'var(--rev-boxShadow-elevation5)',
                      border: '1px solid var(--rev-color-separatorTertiary)',
                      background: 'var(--rev-color-backgroundPrimary)',
                      flexShrink: 0,
                    }}
                  >
                    {view === 'vdp' && <BuyerVDPView scenario={scenario} buyerIsCA={buyerIsCA} />}
                    {view === 'settings' && <SettingsView scenario={scenario} />}
                  </div>
                </div>
              ) : (
                <div style={{ height: '100vh' }}>
                  {view === 'vdp' && <BuyerVDPView scenario={scenario} buyerIsCA={buyerIsCA} />}
                  {view === 'settings' && <SettingsView scenario={scenario} />}
                </div>
              )}
            </ViewportWidthContext.Provider>
          </>
        )}
      </div>
    </NotesProvider>
  );
}
