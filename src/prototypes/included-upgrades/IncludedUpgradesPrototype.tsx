import { useState } from 'react';
import {
  Stack, Group, Tabs, Text, Divider, Button, toast,
  useMediaQuery, ViewportWidthContext,
  NotesProvider, NotesToggle,
} from '../../rev';
import { ModificationsSection } from './ModificationsSection';
import { AddModificationModal } from './AddModificationModal';
import { PricingSection } from './PricingSection';
import { VDPUpgradesSection } from './VDPUpgradesSection';
import { HideNotesContext } from './context';
import {
  VEHICLE_WITH_MODS,
  VEHICLE_NO_MODS,
} from './mock-data';
import type { VehicleModificationsData } from './mock-data';

// ---------------------------------------------------------------------------
// Demo vehicles
// ---------------------------------------------------------------------------
const DEMO_VEHICLES: { label: string; data: VehicleModificationsData }[] = [
  { label: 'Has mods (5)', data: VEHICLE_WITH_MODS },
  { label: 'Empty', data: VEHICLE_NO_MODS },
];

// ---------------------------------------------------------------------------
// Collapsed section stub
// ---------------------------------------------------------------------------
function CollapsedSection({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 0 16px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Text size="body" weight="bold">{title}</Text>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '22px', color: 'var(--rev-color-textSecondary)' }}
      >
        expand_more
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar Nav (matches production AppSideNav: NavigationMenu + NavigationMenuButton)
// 240px width, section titles, 24px material icons, dividers between groups
// ---------------------------------------------------------------------------
const NAV_SECTIONS = [
  {
    title: 'LEADS',
    items: [
      { label: 'CRM', icon: 'person_add' },
      { label: 'AI BDC', icon: 'inbox' },
    ],
  },
  {
    title: 'SALES',
    items: [
      { label: 'Inventory', icon: 'inventory_2' },
      { label: 'Orders', icon: 'receipt_long' },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { label: 'Reports', icon: 'bar_chart' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Settings', icon: 'settings' },
    ],
  },
];

function NavButton({ label, icon, isSelected }: { label: string; icon: string; isSelected: boolean }) {
  return (
    <button
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        border: 'none',
        borderRadius: 'var(--rev-borderRadius-10)',
        background: isSelected ? 'var(--rev-color-menuHighlight)' : 'transparent',
        cursor: 'pointer',
        fontFamily: 'var(--rev-fontFamily)',
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: isSelected
          ? 'var(--rev-fontWeight-semibold)' as unknown as number
          : 'var(--rev-fontWeight-regular)' as unknown as number,
        color: isSelected ? 'var(--rev-color-textPrimary)' : 'var(--rev-color-textSecondary)',
        textAlign: 'left',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '20px', flexShrink: 0 }}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function SidebarNav({ active }: { active: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '8px 12px' }}>
      {NAV_SECTIONS.map((section, sectionIdx) => (
        <div key={section.title}>
          {/* Section title */}
          <div
            style={{
              padding: '12px 12px 6px',
              fontSize: '11px',
              lineHeight: '14px',
              fontWeight: 600,
              fontFamily: 'var(--rev-fontFamily)',
              color: 'var(--rev-color-textTertiary)',
              letterSpacing: '0.02em',
            }}
          >
            {section.title}
          </div>
          {/* Items */}
          {section.items.map((item) => (
            <NavButton
              key={item.label}
              label={item.label}
              icon={item.icon}
              isSelected={item.label === active}
            />
          ))}
          {/* Divider between sections (not after last) */}
          {sectionIdx < NAV_SECTIONS.length - 1 && (
            <div style={{ padding: '6px 0' }}>
              <Divider />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vehicle Details tab (default tab in CMS drawer)
// Shows collapsed sections for non-prototype areas + PricingDetails with mods summary
// ---------------------------------------------------------------------------
function VehicleDetailsTab({
  vehicle,
  onGoToMods,
}: {
  vehicle: VehicleModificationsData;
  onGoToMods: () => void;
}) {
  const pricedMods = vehicle.modifications.filter((m) => m.price > 0);
  const totalModValue = pricedMods.reduce((sum, m) => sum + m.price, 0);
  const totalPrice = vehicle.advertisedPrice + totalModValue;

  return (
    <Stack itemsSpacing="0">
      <CollapsedSection title="Status" />
      <Divider />
      <CollapsedSection title="Media" />
      <Divider />
      <CollapsedSection title="Model Details" />
      <Divider />
      <CollapsedSection title="Unit Details" />
      <Divider />

      {/* Pricing section (expanded, the focus of this prototype) */}
      <PricingSection vehicle={vehicle} />

      {/* Modifications price summary with link to Accessories tab */}
      {pricedMods.length > 0 && (
        <div style={{ padding: '0 0 16px' }}>
          <button
            onClick={onGoToMods}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--rev-borderRadius-10)',
              border: '1px solid var(--rev-color-separatorTertiary)',
              background: 'var(--rev-color-backgroundSecondary)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'var(--rev-fontFamily)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '18px', color: 'var(--rev-color-textSecondary)' }}
              >
                build
              </span>
              <Stack itemsSpacing="2" style={{ textAlign: 'left' }}>
                <Text size="bodySmall" weight="semibold">
                  {pricedMods.length} modification{pricedMods.length > 1 ? 's' : ''} adding ${totalModValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Text>
                <Text size="footnote" color="secondary">
                  Advertised/retail price with accessories: ${totalPrice.toLocaleString()}
                </Text>
              </Stack>
            </div>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '18px', color: 'var(--rev-color-textSecondary)' }}
            >
              chevron_right
            </span>
          </button>
        </div>
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Inventory CMS View (Accessories tab with Modifications section + Pricing)
// ---------------------------------------------------------------------------
function InventoryCMSView({
  activeVehicle,
  setActiveVehicle,
}: {
  activeVehicle: number;
  setActiveVehicle: (idx: number) => void;
}) {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const isPhone = useMediaQuery('(max-width: 640px)');
  const [activeTab, setActiveTab] = useState('vehicle-details');
  const vehicle = DEMO_VEHICLES[activeVehicle].data;

  const TABS = [
    { id: 'vehicle-details', content: 'Vehicle Details' },
    { id: 'reports', content: 'Reports' },
    { id: 'accessories', content: 'Accessories' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {!isMobile && (
        <div
          style={{
            width: '240px',
            background: 'var(--rev-color-backgroundSecondary)',
            borderRight: '1px solid var(--rev-color-separatorTertiary)',
            padding: '8px 0',
            flexShrink: 0,
          }}
        >
          <SidebarNav active="Inventory" />
        </div>
      )}

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!isMobile && (
          <div style={{ padding: '24px', opacity: 0.3 }}>
            <Text size="heading" weight="semibold">Inventory</Text>
            <div
              style={{
                marginTop: '16px',
                height: '200px',
                background: 'var(--rev-color-backgroundSecondary)',
                borderRadius: '12px',
              }}
            />
          </div>
        )}

        {/* Drawer */}
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            top: 0,
            right: 0,
            width: isMobile ? '100%' : '680px',
            height: '100%',
            background: 'var(--rev-color-backgroundPrimary)',
            boxShadow: isMobile ? 'none' : 'var(--rev-boxShadow-elevation5)',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: isMobile ? 'none' : '1px solid var(--rev-color-separatorTertiary)',
          }}
        >
          {/* Header */}
          <div style={{ padding: isPhone ? '16px' : '20px 24px' }}>
            <Group itemsAlignX="space-between" itemsAlignY="start" noWrap>
              <Stack itemsSpacing="4">
                <Text size={isPhone ? 'body' : 'heading'} weight="bold">
                  {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                </Text>
                <Group itemsSpacing="12" itemsAlignY="center">
                  <Text size="footnote" color="secondary">VIN: {vehicle.vin}</Text>
                  {!isPhone && (
                    <Text size="footnote" color="secondary">Stock: {vehicle.stock}</Text>
                  )}
                </Group>
              </Stack>
              <button
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid var(--rev-color-separatorTertiary)',
                  background: 'var(--rev-color-backgroundPrimary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '20px', color: 'var(--rev-color-textPrimary)' }}
                >
                  close
                </span>
              </button>
            </Group>
          </div>

          {/* Demo switcher */}
          <div
            style={{
              padding: '8px 24px',
              background: 'var(--rev-color-backgroundSecondary)',
              borderBottom: '1px solid var(--rev-color-separatorTertiary)',
            }}
          >
            <Group itemsSpacing="8" itemsAlignY="center">
              <Text size="footnote" color="secondary">Demo:</Text>
              {DEMO_VEHICLES.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setActiveVehicle(i)}
                  style={{
                    fontFamily: 'var(--rev-fontFamily)',
                    fontSize: '11px',
                    lineHeight: '16px',
                    padding: '3px 8px',
                    borderRadius: 'var(--rev-borderRadius-full)',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: i === activeVehicle ? 550 : 350,
                    background: i === activeVehicle
                      ? 'var(--rev-color-carbonGray)'
                      : 'var(--rev-color-backgroundPrimary)',
                    color: i === activeVehicle
                      ? 'white'
                      : 'var(--rev-color-textSecondary)',
                    boxShadow: i === activeVehicle ? 'none' : 'var(--rev-boxShadow-elevation0)',
                  }}
                >
                  {v.label}
                </button>
              ))}
            </Group>
          </div>

          {/* Tabs */}
          <div style={{ padding: isPhone ? '0 16px' : '0 24px' }}>
            <Tabs items={TABS} selectedKey={activeTab} onSelect={setActiveTab} />
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: isPhone ? '0 16px 16px' : '0 24px 24px',
            }}
          >
            {activeTab === 'vehicle-details' && (
              <VehicleDetailsTab vehicle={vehicle} onGoToMods={() => setActiveTab('accessories')} />
            )}

            {activeTab === 'accessories' && (
              <Stack itemsSpacing="0" key={vehicle.vehicleId}>
                <ModificationsSection vehicle={vehicle} />
                <Divider />
                <CollapsedSection title="Available Accessories" />
              </Stack>
            )}

            {activeTab === 'reports' && (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <Text size="bodySmall" color="secondary">
                  Reports tab (not part of this prototype)
                </Text>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: isPhone ? '12px 16px' : '12px 24px',
              paddingBottom: isPhone ? 'max(12px, env(safe-area-inset-bottom))' : '12px',
              borderTop: '1px solid var(--rev-color-separatorTertiary)',
              background: 'var(--rev-color-backgroundPrimary)',
            }}
          >
            {isPhone ? (
              <Button
                variant="filled"
                onPress={() => toast.success('Changes saved!')}
                style={{ width: '100%' }}
              >
                Save & publish
              </Button>
            ) : (
              <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
                <Button variant="secondary">More actions</Button>
                <Group itemsSpacing="8" noWrap>
                  <Button
                    variant="filled"
                    onPress={() => toast.success('Changes saved!')}
                  >
                    Save & publish
                  </Button>
                  <Group itemsSpacing="4" noWrap>
                    <button style={{
                      fontFamily: 'var(--rev-fontFamily)',
                      background: 'var(--rev-color-backgroundSecondary)',
                      border: 'none',
                      borderRadius: 'var(--rev-borderRadius-8)',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      boxShadow: 'var(--rev-boxShadow-elevation0)',
                      fontSize: '16px',
                      lineHeight: 1,
                      color: 'var(--rev-color-textSecondary)',
                    }}>&#8249;</button>
                    <button style={{
                      fontFamily: 'var(--rev-fontFamily)',
                      background: 'var(--rev-color-backgroundSecondary)',
                      border: 'none',
                      borderRadius: 'var(--rev-borderRadius-8)',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      boxShadow: 'var(--rev-boxShadow-elevation0)',
                      fontSize: '16px',
                      lineHeight: 1,
                      color: 'var(--rev-color-textSecondary)',
                    }}>&#8250;</button>
                  </Group>
                </Group>
              </Group>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dot separator (matches production VehicleDetailsTitle)
// ---------------------------------------------------------------------------
function DotSeparator() {
  return (
    <Text color="secondary" size="footnote">
      {' \u2022 '}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// FactCard stub (matches production FactCard layout)
// ---------------------------------------------------------------------------
function FactCard({
  name,
  value,
  subtitle,
  icon,
}: {
  name: string;
  value: string;
  subtitle?: string;
  icon?: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: '16px',
        background: 'var(--rev-color-backgroundSecondary)',
        borderRadius: 'var(--rev-borderRadius-12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <Group itemsAlignX="space-between" itemsAlignY="start" noWrap>
        <Text size="footnote" color="secondary">{name}</Text>
        {icon && (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '18px', color: 'var(--rev-color-textSuccess, #22c55e)' }}
          >
            {icon}
          </span>
        )}
      </Group>
      <Text size="body" weight="semibold">{value}</Text>
      {subtitle && <Text size="footnote" color="secondary">{subtitle}</Text>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment card (matches production VehicleDetailsPayment)
// Desktop: min-width 390px, sticky, width: min-content
// Mobile: full-width inline
// Production structure (from VehicleDetailsPayment.tsx + VehiclePriceInfo.tsx):
//   Box (rounding 24, elevation 3, padding 24) > Stack itemsSpacing={24}
//     VehiclePriceInfo (price + savings + monthly/one-time segmented control)
//     Stack itemsSpacing={0}
//       PriceBreakdown (ListViewGroup > ListViewRows) — one-time only
//       PaymentMethodsAccordion
//     prequalBanner (monthly only)
//     CTA buttons
//     financingLabel (monthly only)
// ---------------------------------------------------------------------------
function ListViewRow({ label, value, isLink, onClick }: {
  label: string;
  value: string;
  isLink?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <Text size="bodySmall" style={isLink ? { textDecoration: 'underline', textUnderlineOffset: '2px' } : undefined}>
        {label}
      </Text>
      <Text size="bodySmall" weight="semibold">{value}</Text>
    </>
  );

  if (isLink) {
    return (
      <a
        href="#included-upgrades"
        onClick={(e) => { e.preventDefault(); onClick?.(); }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0',
          borderBottom: '1px solid var(--rev-color-separatorTertiary)',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {content}
      </a>
    );
  }

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
      {content}
    </div>
  );
}

function PaymentCard({
  vehicle,
  isDesktop,
}: {
  vehicle: VehicleModificationsData;
  isDesktop: boolean;
}) {
  const [paymentMode, setPaymentMode] = useState<'monthly' | 'one-time'>('one-time');
  const upgradesTotal = Math.round(vehicle.modifications.reduce((sum, m) => sum + m.price, 0));
  const totalPrice = vehicle.advertisedPrice + upgradesTotal;
  const retailWithUpgrades = vehicle.dealerRetailPrice + upgradesTotal;
  const savings = retailWithUpgrades > totalPrice
    ? retailWithUpgrades - totalPrice
    : 0;
  // Hardcoded monthly estimate (roughly totalPrice financed over 60 months)
  const estMonthly = Math.round(totalPrice / 60 + 30);

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
      {/* Box rounding=24, elevation=3, padding=24 (matches production) */}
      <div
        data-rev-rounding="24"
        data-rev-elevation="3"
        style={{
          background: 'var(--rev-color-backgroundPrimary)',
          borderRadius: 'var(--rev-borderRadius-24)',
          boxShadow: 'var(--rev-boxShadow-elevation3)',
          padding: '24px',
        }}
      >
        <Stack itemsSpacing="24">
          {/* VehiclePriceInfo: price + savings/monthly + segmented control */}
          <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
            <Stack itemsSpacing="4">
              <Text size="title200" weight="semibold">
                ${totalPrice.toLocaleString()}
              </Text>
              {savings > 0 && (
                <Group itemsSpacing="8" itemsAlignY="center">
                  <Text size="bodySmall" color="secondary" style={{ textDecoration: 'line-through' }}>
                    ${retailWithUpgrades.toLocaleString()}
                  </Text>
                  <Text size="bodySmall" style={{ color: 'var(--rev-color-textSuccess, #22c55e)' }}>
                    Save ${savings.toLocaleString()}
                  </Text>
                </Group>
              )}
            </Stack>
            {/* Segmented control (matches production SegmentedControl) */}
            <div
              style={{
                display: 'flex',
                borderRadius: 'var(--rev-borderRadius-full)',
                overflow: 'hidden',
                border: '1px solid var(--rev-color-separatorTertiary)',
                flexShrink: 0,
              }}
            >
              {(['monthly', 'one-time'] as const).map((mode) => {
                const isActive = paymentMode === mode;
                const label = mode === 'monthly' ? 'Monthly' : 'One-time';
                return (
                  <div
                    key={mode}
                    onClick={() => setPaymentMode(mode)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      lineHeight: '18px',
                      fontFamily: 'var(--rev-fontFamily)',
                      fontWeight: isActive ? 600 : 400,
                      background: isActive ? 'var(--rev-color-carbonGray)' : 'transparent',
                      color: isActive ? 'white' : 'var(--rev-color-textSecondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </Group>

          {/* Est. monthly (monthly mode only) */}
          {paymentMode === 'monthly' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Text
                size="body"
                weight="semibold"
                style={{
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Est. ${estMonthly}/mo
              </Text>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '16px', color: 'var(--rev-color-textSecondary)' }}
              >
                calculate
              </span>
            </div>
          )}

          {/* Price breakdown (varies by mode) */}
          {paymentMode === 'one-time' ? (
            <Stack itemsSpacing="0">
              <ListViewRow
                label="Vehicle price"
                value={`$${vehicle.advertisedPrice.toLocaleString()}`}
              />
              {upgradesTotal > 0 && (
                <ListViewRow
                  label={`Included upgrades (${vehicle.modifications.filter(m => m.price > 0).length})`}
                  value={`+$${upgradesTotal.toLocaleString()}`}
                  isLink
                  onClick={() => {
                    const target = document.getElementById('included-upgrades');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                />
              )}
              <ListViewRow label="Est. shipping" value="Calculated at checkout" />
              <ListViewRow label="Est. tax, title & reg." value="Calculated at checkout" />

              {/* Total price */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--rev-color-separatorTertiary)',
                }}
              >
                <Text size="body" weight="bold">Total price</Text>
                <Text size="body" weight="bold">${totalPrice.toLocaleString()}</Text>
              </div>

              {/* PaymentMethodsAccordion stub (collapsed) */}
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
          ) : (
            <Stack itemsSpacing="0">
              <ListViewRow
                label="Vehicle price"
                value={`$${vehicle.advertisedPrice.toLocaleString()}`}
              />
              {upgradesTotal > 0 && (
                <ListViewRow
                  label={`Included upgrades (${vehicle.modifications.filter(m => m.price > 0).length})`}
                  value={`+$${upgradesTotal.toLocaleString()}`}
                  isLink
                  onClick={() => {
                    const target = document.getElementById('included-upgrades');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                />
              )}
              <ListViewRow label="Est. APR" value="7.99%" />
              <ListViewRow label="Term" value="60 months" />
              <ListViewRow label="Down payment" value="$0" />

              {/* PaymentMethodsAccordion stub (collapsed) */}
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
          )}

          {/* Prequal banner (monthly only) */}
          {paymentMode === 'monthly' && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--rev-borderRadius-10)',
                background: 'var(--rev-color-backgroundSecondary)',
                border: '1px solid var(--rev-color-separatorTertiary)',
                textAlign: 'center',
              }}
            >
              <Text size="bodySmall" color="secondary">
                Check your rate without impacting your credit score
              </Text>
            </div>
          )}

          {/* CTA button (matches production VdpCtaGroup) */}
          <Button
            variant="filled"
            size="large"
            onPress={() => toast.success('Starting your deal!')}
            style={{ width: '100%' }}
          >
            Start my deal
          </Button>

          {/* Financing label (monthly only) */}
          {paymentMode === 'monthly' && (
            <Text size="footnote" color="tertiary" style={{ textAlign: 'center' }}>
              Financing provided by Ekho Financial Services. Terms and conditions apply.
            </Text>
          )}
        </Stack>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key Specs row item (matches production VehicleDetailsKeySpecsItem)
// ---------------------------------------------------------------------------
function KeySpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: '12px 16px',
        background: 'var(--rev-color-backgroundSecondary)',
        borderRadius: 'var(--rev-borderRadius-10)',
      }}
    >
      <Text size="footnote" color="secondary">{label}</Text>
      <Text size="body" weight="semibold">{value}</Text>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Buyer VDP View (matches Carthage production layout exactly)
//
// Production structure (from vehicle-details/index.tsx):
//   Section > Stack (gallery area, padding y:20, spacing 20)
//   Section > Group (content, padding top:20 bottom:40, margin x:48, spacing 48, noWrap)
//     Group.Item grow={1} > Stack itemsSpacing={40}
//       VehicleDetailsTitle
//       (mobile: VehicleDetailsPayment)
//       VehicleDetailsKeyFacts
//       VehicleDetailsKeySpecs
//       VehicleDetailsKeyFeatures
//       VehicleDetailsAccessories
//     (desktop: VehicleDetailsPayment — sticky sidebar)
// ---------------------------------------------------------------------------
function BuyerVDPView({ activeVehicle }: { activeVehicle: number }) {
  const isCompact = useMediaQuery('(max-width: 980px)');
  const isDesktop = !isCompact;
  const vehicle = DEMO_VEHICLES[activeVehicle].data;

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: 'var(--rev-color-backgroundPrimary)',
      }}
    >
      {/* Gallery section (matches production Section > Stack padding y:20 spacing 20) */}
      <div style={{ padding: '20px 0' }}>
        <Stack itemsSpacing="20">
          {/* Toolbar placeholder */}
          <div style={{ padding: isCompact ? '0 16px' : '0 48px' }}>
            <Group itemsAlignX="space-between" itemsAlignY="center">
              <Text size="footnote" color="secondary">
                {'\u2190'} Back to results
              </Text>
              <Group itemsSpacing="8">
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--rev-color-textSecondary)' }}>share</span>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--rev-color-textSecondary)' }}>favorite_border</span>
              </Group>
            </Group>
          </div>
          {/* Gallery placeholder */}
          <div style={{ padding: isCompact ? '0 16px' : '0 48px' }}>
            <div
              style={{
                width: '100%',
                height: isCompact ? '240px' : '400px',
                background: 'var(--rev-color-backgroundSecondary)',
                borderRadius: 'var(--rev-borderRadius-12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '64px', color: 'var(--rev-color-textTertiary)', opacity: 0.5 }}
              >
                directions_bike
              </span>
              {/* Photo count badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  padding: '4px 10px',
                  borderRadius: 'var(--rev-borderRadius-full)',
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Text size="footnote" style={{ color: 'white' }}>1 / 12</Text>
              </div>
            </div>
          </div>
        </Stack>
      </div>

      {/* Content section (matches production Group layout exactly) */}
      <div
        style={{
          paddingTop: '20px',
          paddingBottom: '40px',
          paddingLeft: isCompact ? '16px' : '0',
          paddingRight: isCompact ? '16px' : '0',
          marginLeft: isCompact ? '0' : '48px',
          marginRight: isCompact ? '0' : '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '48px',
          flexWrap: 'nowrap',
        }}
      >
        {/* Main content column (matches Group.Item grow={1}) */}
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <Stack itemsSpacing="40">
            {/* Title (matches VehicleDetailsTitle exactly) */}
            <Stack itemsSpacing="8">
              <Text size="title200" weight="semibold">
                {vehicle.year} {vehicle.make} {vehicle.model}{vehicle.trim ? ` ${vehicle.trim}` : ''}
              </Text>
              <Group itemsAlignX="start" itemsAlignY="center">
                <Text>{vehicle.condition === 'new' ? 'New' : 'Pre-owned'}</Text>
                <DotSeparator />
                <Text>Gasoline</Text>
                <DotSeparator />
                <Text>Motorcycle</Text>
              </Group>
            </Stack>

            {/* Mobile payment (matches production: payment renders between title and key facts on mobile) */}
            {!isDesktop && <PaymentCard vehicle={vehicle} isDesktop={false} />}

            {/* Key Facts (matches VehicleDetailsKeyFacts: Stack 16 > heading > CardGroup) */}
            <Stack itemsSpacing="16">
              <Text size="heading">Key facts</Text>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: isCompact ? 'wrap' : 'nowrap',
                }}
              >
                <FactCard
                  name="Condition"
                  value={vehicle.condition === 'new' ? 'New' : 'Pre-owned'}
                  subtitle={vehicle.condition === 'used' ? '2,847 mi' : undefined}
                />
                <FactCard
                  name="Availability"
                  value="Available online"
                  icon="check_circle"
                />
                <FactCard
                  name="Location"
                  value="Tampa, FL"
                  subtitle="42 mi away"
                />
                <FactCard
                  name="Delivery"
                  value="3-7 business days"
                  subtitle="$299 est."
                  icon="check_circle"
                />
              </div>
            </Stack>

            {/* Key Specs (matches VehicleDetailsKeySpecs: Stack 16 > heading > rows of 2 > Button) */}
            <Stack itemsSpacing="16">
              <Text size="heading">Key specs</Text>
              <Group itemsSpacing="16" noWrap>
                <KeySpecItem label="Engine" value="689cc parallel-twin" />
                <KeySpecItem label="Horsepower" value="72.4 hp" />
              </Group>
              <Group itemsSpacing="16" noWrap>
                <KeySpecItem label="Torque" value="50 lb-ft" />
                <KeySpecItem label="Weight" value="403 lbs" />
              </Group>
              <Group itemsSpacing="16" noWrap>
                <KeySpecItem label="Seat Height" value="31.7 in" />
                <KeySpecItem label="Fuel Capacity" value="3.7 gal" />
              </Group>
              <Stack itemsAlignX="start">
                <Button variant="filled" size="large">View all specs</Button>
              </Stack>
            </Stack>

            {/* Features (matches VehicleDetailsKeyFeatures: Stack 16 > heading > categories > Button) */}
            <Stack itemsSpacing="16">
              <Text size="heading">Features</Text>
              <Stack itemsSpacing="24">
                {[
                  { category: 'Performance', items: ['Assist & Slipper Clutch', 'Crossplane Crankshaft', '6-Speed Transmission'] },
                  { category: 'Technology', items: ['Full LCD Dashboard', 'LED Lighting', 'Quick Shifter'] },
                ].map((cat) => (
                  <Stack key={cat.category} itemsSpacing="12">
                    <Text size="body" weight="semibold">{cat.category}</Text>
                    <Stack itemsSpacing="8">
                      {cat.items.map((item) => (
                        <Text key={item} size="body" style={{ marginLeft: '20px', listStyleType: 'disc', display: 'list-item' }}>{item}</Text>
                      ))}
                    </Stack>
                    <Divider />
                  </Stack>
                ))}
              </Stack>
              <Stack itemsAlignX="start">
                <Button variant="filled" size="large">View all features</Button>
              </Stack>
            </Stack>

            {/* Included Upgrades (the prototype section) */}
            <VDPUpgradesSection modifications={vehicle.modifications} />

            {/* Add-ons stub (matches VehicleDetailsAccessories) */}
            <Stack itemsSpacing="16">
              <Group itemsSpacing="8" itemsAlignY="center" itemsAlignX="start">
                <Text size="heading">Add-ons</Text>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 8px',
                    borderRadius: 'var(--rev-borderRadius-full)',
                    border: '1px solid currentColor',
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontWeight: 500,
                    fontFamily: 'var(--rev-fontFamily)',
                    color: 'var(--rev-color-textSecondary)',
                  }}
                >
                  Popular
                </span>
              </Group>
              <div>
                <Text size="bodySmall" color="secondary">
                  Add accessories during checkout to make this vehicle truly yours.
                </Text>
              </div>
              {/* 2-col grid stub matching production .vehicle-details-accessories__grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr',
                  columnGap: '16px',
                  rowGap: '16px',
                }}
              >
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      rowGap: '16px',
                      padding: '12px 0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
                        <div>
                          <Text size="body" weight="semibold">Accessory {i}</Text>
                          <Text size="footnote" color="secondary">Sample add-on accessory item</Text>
                        </div>
                        <Text size="bodySmall">+$99.00</Text>
                      </div>
                      <div
                        style={{
                          marginLeft: '20px',
                          width: '165px',
                          aspectRatio: '4 / 3',
                          borderRadius: 'var(--rev-borderRadius-12)',
                          background: 'var(--rev-color-backgroundSecondary)',
                          flexShrink: 0,
                        }}
                      />
                    </div>
                    <Divider />
                  </div>
                ))}
              </div>
            </Stack>
          </Stack>
        </div>

        {/* Payment sidebar (desktop only, matches VehicleDetailsPayment) */}
        {isDesktop && <PaymentCard vehicle={vehicle} isDesktop={true} />}
      </div>
    </div>
  );
}

// ===========================================================================
// SPEC VIEW: Scrollable narrative document with commentary sidebar
// ===========================================================================

// --- Reusable spec layout components ---

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
  items: { tag?: 'note' | 'placement' | 'trigger' | 'data' | 'future'; text: string }[];
}) {
  const tagStyles: Record<string, { bg: string; color: string; label: string }> = {
    note: { bg: '#f3e8ff', color: '#6b21a8', label: 'NOTE' },
    placement: { bg: '#dbeafe', color: '#1e40af', label: 'PLACEMENT' },
    trigger: { bg: '#e0e7ff', color: '#3730a3', label: 'TRIGGER' },
    data: { bg: '#fef3c7', color: '#92400e', label: 'DATA' },
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
      <NotesProvider defaultVisible={false}>
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
      </NotesProvider>
    </div>
  );
}

// --- SpecView ---

function SpecView() {
  const vehicle = VEHICLE_WITH_MODS;
  const upgradesTotal = vehicle.modifications.reduce((sum, m) => sum + m.price, 0);
  const pricedCount = vehicle.modifications.filter((m) => m.price > 0).length;

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
            <Text size="title300" weight="bold">Included Upgrades & Modifications</Text>
            <Text size="body" color="secondary" style={{ maxWidth: '720px', lineHeight: '24px' }}>
              Dealer-installed modifications that are included in the vehicle price. Managed in the Inventory CMS,
              displayed as "Included Upgrades" on the buyer-facing VDP. Supports both DMS-synced and manually added entries
              with field-level source tracking.
            </Text>
          </Stack>
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[
              { color: '#7c3aed', label: 'Admin Portal (CMS)' },
              { color: '#2563eb', label: 'Buyer VDP' },
            ].map((s) => (
              <Group key={s.label} itemsSpacing="6" itemsAlignY="center">
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                <Text size="footnote" color="secondary">{s.label}</Text>
              </Group>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. CMS: VEHICLE DETAILS TAB                                  */}
        {/* ============================================================ */}
        <SpecSection title="CMS: Vehicle Details Tab" badge="Admin Portal" badgeColor="#7c3aed">
          <ContentWithCommentary
            commentary={
              <CommentaryCard
                title="Design Notes"
                items={[
                  { tag: 'placement', text: 'PricingDetails section at the bottom of the Vehicle Details tab, matching production drawer layout.' },
                  { tag: 'note', text: 'Modifications summary card shows count + total dollar impact, with a chevron link to the Accessories tab.' },
                  { tag: 'data', text: 'Total vehicle price = advertised price + sum of priced modifications. Displayed in the summary card.' },
                  { tag: 'note', text: 'The summary is read-only. All editing happens in the Accessories tab.' },
                ]}
              />
            }
          >
            <DeviceFrame width={680} height={700} label="Vehicle Details Tab (default)">
              <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px' }}>
                <Stack itemsSpacing="4" style={{ marginBottom: '16px' }}>
                  <Text size="heading" weight="bold">
                    {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                  </Text>
                  <Text size="footnote" color="secondary">VIN: {vehicle.vin}</Text>
                </Stack>
                <VehicleDetailsTab vehicle={vehicle} onGoToMods={() => {}} />
              </div>
            </DeviceFrame>
          </ContentWithCommentary>
        </SpecSection>

        {/* ============================================================ */}
        {/* 2. CMS: MODIFICATIONS LIST                                   */}
        {/* ============================================================ */}
        <SpecSection title="CMS: Modifications List" badge="Admin Portal" badgeColor="#7c3aed">
          <ContentWithCommentary
            commentary={
              <>
                <CommentaryCard
                  title="List Behavior"
                  items={[
                    { tag: 'note', text: 'Source badges: "DMS Synced" (blue) for DMS entries, "Added in Ekho" (gray) for manual entries. Buyers never see this.' },
                    { tag: 'note', text: 'Part number has dotted underline, click-to-copy with toast confirmation.' },
                    { tag: 'note', text: '"Remove" action only available for Ekho entries. DMS entries are managed by the DMS.' },
                    { tag: 'data', text: 'Total row shows sum of all priced modifications with "Added to vehicle price" subtitle.' },
                  ]}
                />
                <CommentaryCard
                  title="Empty State"
                  items={[
                    { tag: 'note', text: 'Shows build_circle icon, "No modifications on this vehicle" message, and "Add modification" button.' },
                    { tag: 'note', text: 'Subtext: "DMS-synced accessories will appear here automatically."' },
                  ]}
                />
              </>
            }
          >
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              <DeviceFrame width={680} height={600} label="Populated (5 mods)">
                <div style={{ height: '100%', overflowY: 'auto', padding: '16px 24px' }}>
                  <ModificationsSection vehicle={VEHICLE_WITH_MODS} />
                </div>
              </DeviceFrame>
              <DeviceFrame width={390} height={600} label="Empty state (phone)">
                <div style={{ height: '100%', overflowY: 'auto', padding: '16px' }}>
                  <ModificationsSection vehicle={VEHICLE_NO_MODS} />
                </div>
              </DeviceFrame>
            </div>
          </ContentWithCommentary>
        </SpecSection>

        {/* ============================================================ */}
        {/* 3. CMS: ADD/EDIT MODAL                                       */}
        {/* ============================================================ */}
        <SpecSection title="CMS: Add/Edit Modal" badge="Admin Portal" badgeColor="#7c3aed">
          <ContentWithCommentary
            commentary={
              <>
                <CommentaryCard
                  title="Field Source Tracking"
                  items={[
                    { tag: 'data', text: 'Each field tracks its source independently: DMS (blue badge) or Ekho override (amber badge with edit icon).' },
                    { tag: 'note', text: 'When a dealer edits a DMS field, it flips to "Ekho override" with a warning: "This field will no longer sync with DMS updates."' },
                    { tag: 'note', text: '"Reset to DMS" link appears on overridden fields. Toast: "Pulling latest value from DMS."' },
                  ]}
                />
                <CommentaryCard
                  title="Form Rules"
                  items={[
                    { tag: 'note', text: 'Required fields (Title, Description) marked with red *. No "(optional)" labels on other fields.' },
                    { tag: 'note', text: 'Part number is disabled (grayed out) for DMS entries since it is the DMS identifier.' },
                    { tag: 'note', text: 'Up to 3 images. JPEG/PNG accepted.' },
                    { tag: 'note', text: 'Save disabled until Title (3-40 chars) and Description (10-140 chars) are valid.' },
                  ]}
                />
              </>
            }
          >
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              <DeviceFrame width={480} height={680} label="Edit DMS entry">
                <div style={{ height: '100%', overflowY: 'auto', position: 'relative' }}>
                  <AddModificationModal
                    existingEntry={vehicle.modifications[0]}
                    onClose={() => {}}
                    onSave={() => {}}
                    inline
                  />
                </div>
              </DeviceFrame>
              <DeviceFrame width={480} height={680} label="Edit Ekho entry">
                <div style={{ height: '100%', overflowY: 'auto', position: 'relative' }}>
                  <AddModificationModal
                    existingEntry={vehicle.modifications[3]}
                    onClose={() => {}}
                    onSave={() => {}}
                    inline
                  />
                </div>
              </DeviceFrame>
              <DeviceFrame width={480} height={680} label="Add new">
                <div style={{ height: '100%', overflowY: 'auto', position: 'relative' }}>
                  <AddModificationModal
                    onClose={() => {}}
                    onSave={() => {}}
                    inline
                  />
                </div>
              </DeviceFrame>
            </div>
          </ContentWithCommentary>
        </SpecSection>

        {/* ============================================================ */}
        {/* 4. VDP: PRICING CARD                                         */}
        {/* ============================================================ */}
        <SpecSection title="VDP: Pricing Card" badge="Buyer VDP" badgeColor="#2563eb">
          <ContentWithCommentary
            commentary={
              <>
                <CommentaryCard
                  title="Pricing Math"
                  items={[
                    { tag: 'data', text: `Big price = advertised price ($${vehicle.advertisedPrice.toLocaleString()}) + modifications ($${upgradesTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}) = $${(vehicle.advertisedPrice + upgradesTotal).toLocaleString()}.` },
                    { tag: 'note', text: 'Monthly estimated payment is based on the total price (including mods), not the base advertised price.' },
                  ]}
                />
                <CommentaryCard
                  title="One-Time Breakdown"
                  items={[
                    { tag: 'placement', text: 'Line item order: Vehicle price, Included upgrades (linked), Est. shipping, Est. tax/title/reg, Total price.' },
                    { tag: 'note', text: `"Included upgrades (${pricedCount})" is a clickable link that scrolls to the Included Upgrades section on the VDP.` },
                    { tag: 'note', text: 'Total price row shown at bottom in bold.' },
                  ]}
                />
                <CommentaryCard
                  title="Monthly View"
                  items={[
                    { tag: 'note', text: 'Segmented control toggles between Monthly and One-time.' },
                    { tag: 'note', text: 'Monthly shows larger "Est. $XXX/mo" text below the big price, plus APR/term/down payment breakdown.' },
                    { tag: 'note', text: 'Prequal banner and financing label only appear in monthly mode.' },
                  ]}
                />
              </>
            }
          >
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              <DeviceFrame width={1100} height={800} label="Desktop (One-time)">
                <BuyerVDPView activeVehicle={0} />
              </DeviceFrame>
              <DeviceFrame width={390} height={844} label="Phone">
                <BuyerVDPView activeVehicle={0} />
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
// Device Types
// ---------------------------------------------------------------------------
type DeviceMode = 'desktop' | 'tablet' | 'phone';

const DEVICE_CONFIG: Record<DeviceMode, { width: number | null; icon: string; label: string }> = {
  desktop: { width: null, icon: 'desktop_windows', label: 'Desktop' },
  tablet: { width: 768, icon: 'tablet', label: 'Tablet' },
  phone: { width: 390, icon: 'phone_iphone', label: 'Phone' },
};

// ---------------------------------------------------------------------------
// View Types
// ---------------------------------------------------------------------------
type View = 'cms' | 'vdp';

const VIEW_LABELS: Record<View, string> = {
  cms: 'Inventory CMS',
  vdp: 'Buyer VDP',
};

// ---------------------------------------------------------------------------
// Main Prototype
// ---------------------------------------------------------------------------
type ProtoMode = 'spec' | 'interactive';

export function IncludedUpgradesPrototype() {
  const [mode, setMode] = useState<ProtoMode>('spec');
  const [view, setView] = useState<View>('cms');
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [activeVehicle, setActiveVehicle] = useState(0);

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
              {(['cms', 'vdp'] as const).map((v) => (
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

              {/* Divider */}
              <div
                style={{
                  width: '1px',
                  height: '18px',
                  background: 'var(--rev-color-separatorTertiary)',
                  flexShrink: 0,
                }}
              />

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
                    {view === 'cms' && (
                      <InventoryCMSView
                        activeVehicle={activeVehicle}
                        setActiveVehicle={setActiveVehicle}
                      />
                    )}
                    {view === 'vdp' && <BuyerVDPView activeVehicle={activeVehicle} />}
                  </div>
                </div>
              ) : (
                <div style={{ height: '100vh' }}>
                  {view === 'cms' && (
                    <InventoryCMSView
                      activeVehicle={activeVehicle}
                      setActiveVehicle={setActiveVehicle}
                    />
                  )}
                  {view === 'vdp' && <BuyerVDPView activeVehicle={activeVehicle} />}
                </div>
              )}
            </ViewportWidthContext.Provider>
          </>
        )}
      </div>
    </NotesProvider>
  );
}
