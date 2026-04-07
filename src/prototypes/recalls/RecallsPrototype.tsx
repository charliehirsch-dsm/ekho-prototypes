import { useState } from 'react';
import { Stack, Group, Tabs, Text, Divider, Box, Button } from '../../rev';
import { RecallsSection } from './RecallsSection';
import { VEHICLE_WITH_RECALLS, VEHICLE_NO_RECALLS } from './mock-data';
import type { VehicleRecallData } from './mock-data';

const REPORTS_TABS = [
  { id: 'vehicle_details', content: 'Vehicle Details' },
  { id: 'reports', content: 'Reports' },
  { id: 'accessories', content: 'Accessories' },
];

const DEMO_VEHICLES: { label: string; data: VehicleRecallData }[] = [
  { label: 'With recalls (3)', data: VEHICLE_WITH_RECALLS },
  { label: 'No recalls (clean)', data: VEHICLE_NO_RECALLS },
];

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

export function RecallsPrototype() {
  const [activeTab, setActiveTab] = useState('reports');
  const [activeVehicle, setActiveVehicle] = useState(0);
  const vehicle = DEMO_VEHICLES[activeVehicle].data;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Simulated sidebar */}
      <div
        style={{
          width: '220px',
          background: 'var(--rev-color-backgroundSecondary)',
          borderRight: '1px solid var(--rev-color-separatorTertiary)',
          padding: '16px 0',
          flexShrink: 0,
        }}
      >
        <Stack itemsSpacing="4">
          <div style={{ padding: '0 16px 12px' }}>
            <Text size="bodySmall" weight="bold">ekho</Text>
          </div>
          <Divider />
          {['CRM', 'AI BDC', 'Inventory', 'Orders', 'Reports', 'Settings'].map((item) => (
            <div
              key={item}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                lineHeight: '18px',
                color: item === 'Inventory' ? 'var(--rev-color-textPrimary)' : 'var(--rev-color-textSecondary)',
                fontWeight: item === 'Inventory' ? 'var(--rev-fontWeight-semibold)' : 'var(--rev-fontWeight-regular)',
                background: item === 'Inventory' ? 'var(--rev-color-menuHighlight)' : 'transparent',
                cursor: 'pointer',
                borderRadius: '0',
              }}
            >
              {item}
            </div>
          ))}
        </Stack>
      </div>

      {/* Main content area with drawer overlay */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Faded background (simulated inventory list) */}
        <div style={{ padding: '24px', opacity: 0.3 }}>
          <Text size="heading" weight="semibold">Inventory</Text>
          <div style={{ marginTop: '16px', height: '200px', background: 'var(--rev-color-backgroundSecondary)', borderRadius: '12px' }} />
        </div>

        {/* Right drawer */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '680px',
            height: '100%',
            background: 'var(--rev-color-backgroundPrimary)',
            boxShadow: 'var(--rev-boxShadow-elevation5)',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid var(--rev-color-separatorTertiary)',
          }}
        >
          {/* Drawer header */}
          <div
            style={{
              padding: '20px 24px',
            }}
          >
            <Group itemsAlignX="space-between" itemsAlignY="start" noWrap>
              <Text size="heading" weight="bold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
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

          {/* Demo vehicle switcher */}
          <div style={{
            padding: '8px 24px',
            background: 'var(--rev-color-backgroundSecondary)',
            borderBottom: '1px solid var(--rev-color-separatorTertiary)',
          }}>
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
                    background: i === activeVehicle ? 'var(--rev-color-carbonGray)' : 'var(--rev-color-backgroundPrimary)',
                    color: i === activeVehicle ? 'white' : 'var(--rev-color-textSecondary)',
                    boxShadow: i === activeVehicle ? 'none' : 'var(--rev-boxShadow-elevation0)',
                  }}
                >
                  {v.label}
                </button>
              ))}
            </Group>
          </div>

          {/* Tabs */}
          <div style={{ padding: '0 24px' }}>
            <Tabs items={REPORTS_TABS} selectedKey={activeTab} onSelect={setActiveTab} />
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
            {activeTab === 'reports' && (
              <Stack itemsSpacing="0">
                {/* Cosmetic report (collapsed stub) */}
                <CollapsedSection title="Cosmetic report" />
                <Divider />

                {/* Title & History (collapsed stub) */}
                <CollapsedSection title="Title & history" />
                <Divider />

                {/* Dealer warranty (collapsed stub) */}
                <CollapsedSection title="Dealer warranty" />
                <Divider />

                {/* The Recalls section (the real prototype) */}
                <RecallsSection vehicle={vehicle} key={vehicle.vehicleId} />
              </Stack>
            )}

            {activeTab === 'vehicle_details' && (
              <Box padding="24">
                <Stack itemsSpacing="8" style={{ alignItems: 'center', padding: '48px 0' }}>
                  <Text size="bodySmall" color="secondary">Vehicle Details tab</Text>
                  <Text size="footnote" color="tertiary">Not part of this prototype</Text>
                </Stack>
              </Box>
            )}

            {activeTab === 'accessories' && (
              <Box padding="24">
                <Stack itemsSpacing="8" style={{ alignItems: 'center', padding: '48px 0' }}>
                  <Text size="bodySmall" color="secondary">Accessories tab</Text>
                  <Text size="footnote" color="tertiary">Not part of this prototype</Text>
                </Stack>
              </Box>
            )}
          </div>

          {/* Drawer footer */}
          <div
            style={{
              padding: '12px 24px',
              borderTop: '1px solid var(--rev-color-separatorTertiary)',
              background: 'var(--rev-color-backgroundPrimary)',
            }}
          >
            <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
              <Button variant="secondary">More actions</Button>
              <Group itemsSpacing="8" noWrap>
                <Button variant="filled">Save &amp; publish</Button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
