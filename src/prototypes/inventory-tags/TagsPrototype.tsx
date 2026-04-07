import { useState } from 'react';
import { Stack, Group, Tabs, Text, Divider, Button, toast, useMediaQuery, ViewportWidthContext } from '../../rev';
import { AdminTagsSection } from './AdminTagsSection';
import { TagSettingsSection } from './TagSettingsSection';
import { SRPView } from './SRPView';
import { ADMIN_DEMO_VEHICLE } from './mock-data';

// ---------------------------------------------------------------------------
// Collapsed section stub (for non-prototype drawer sections)
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
// Sidebar Nav (shared between Admin and Settings views)
// ---------------------------------------------------------------------------
function SidebarNav({ active }: { active: string }) {
  return (
    <Stack itemsSpacing="4">
      <div style={{ padding: '0 16px 12px' }}>
        <Text size="bodySmall" weight="bold">ekho</Text>
      </div>
      <Divider />
      {['CRM', 'AI BDC', 'Inventory', 'Orders', 'Reports', 'Settings'].map(
        (item) => (
          <div
            key={item}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              lineHeight: '18px',
              color:
                item === active
                  ? 'var(--rev-color-textPrimary)'
                  : 'var(--rev-color-textSecondary)',
              fontWeight:
                item === active
                  ? 'var(--rev-fontWeight-semibold)'
                  : 'var(--rev-fontWeight-regular)',
              background:
                item === active
                  ? 'var(--rev-color-menuHighlight)'
                  : 'transparent',
              cursor: 'pointer',
            }}
          >
            {item}
          </div>
        )
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Admin Drawer View
// ---------------------------------------------------------------------------
function AdminDrawerView() {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const isPhone = useMediaQuery('(max-width: 640px)');
  const [activeTab, setActiveTab] = useState('vehicle_details');
  const vehicle = ADMIN_DEMO_VEHICLE;

  const TABS = [
    { id: 'vehicle_details', content: 'Vehicle Details' },
    { id: 'reports', content: 'Reports' },
    { id: 'accessories', content: 'Accessories' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar: hidden on mobile */}
      {!isMobile && (
        <div
          style={{
            width: '220px',
            background: 'var(--rev-color-backgroundSecondary)',
            borderRight: '1px solid var(--rev-color-separatorTertiary)',
            padding: '16px 0',
            flexShrink: 0,
          }}
        >
          <SidebarNav active="Inventory" />
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Faded background (desktop only) */}
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

        {/* Drawer: full-screen on mobile, right panel on desktop */}
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
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </Text>
                <Group itemsSpacing="12" itemsAlignY="center">
                  <Text size="footnote" color="secondary">
                    VIN: {vehicle.vin}
                  </Text>
                  {!isPhone && (
                    <Text size="footnote" color="secondary">
                      Stock: {vehicle.stock}
                    </Text>
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
            {activeTab === 'vehicle_details' && (
              <Stack itemsSpacing="0">
                <CollapsedSection title="Inventory status" />
                <Divider />
                <AdminTagsSection />
                <Divider />
                <CollapsedSection title="Media & photos" />
                <Divider />
                <CollapsedSection title="Pricing" />
                <Divider />
                <CollapsedSection title="Vehicle information" />
              </Stack>
            )}

            {activeTab === 'reports' && (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <Text size="bodySmall" color="secondary">
                  Reports tab (not part of this prototype)
                </Text>
              </div>
            )}

            {activeTab === 'accessories' && (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <Text size="bodySmall" color="secondary">
                  Accessories tab (not part of this prototype)
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
                onPress={() => toast.success('Tags saved!')}
                style={{ width: '100%' }}
              >
                Save &amp; publish
              </Button>
            ) : (
              <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
                <Button variant="secondary">More actions</Button>
                <Group itemsSpacing="8" noWrap>
                  <Button
                    variant="filled"
                    onPress={() => toast.success('Tags saved!')}
                  >
                    Save &amp; publish
                  </Button>
                  <Group itemsSpacing="4" noWrap>
                    <button
                      style={{
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
                      }}
                    >
                      &#8249;
                    </button>
                    <button
                      style={{
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
                      }}
                    >
                      &#8250;
                    </button>
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
// Settings View (global dealer-level tag configuration)
// ---------------------------------------------------------------------------
function SettingsView() {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const isPhone = useMediaQuery('(max-width: 640px)');

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar: hidden on mobile */}
      {!isMobile && (
        <div
          style={{
            width: '220px',
            background: 'var(--rev-color-backgroundSecondary)',
            borderRight: '1px solid var(--rev-color-separatorTertiary)',
            padding: '16px 0',
            flexShrink: 0,
          }}
        >
          <SidebarNav active="Settings" />
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div
          style={{
            maxWidth: '640px',
            padding: isPhone ? '20px 16px' : '32px 40px',
          }}
        >
          <Stack itemsSpacing="24">
            <Stack itemsSpacing="4">
              <Text size={isPhone ? 'body' : 'heading'} weight="bold">
                Settings
              </Text>
              <Text size="bodySmall" color="secondary">
                Manage dealership-wide configuration for inventory tags.
              </Text>
            </Stack>
            <Divider />
            <TagSettingsSection />
          </Stack>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Device Mode Types
// ---------------------------------------------------------------------------
type DeviceMode = 'desktop' | 'tablet' | 'phone';

const DEVICE_CONFIG: Record<DeviceMode, { width: number | null; icon: string; label: string }> = {
  desktop: { width: null, icon: 'desktop_windows', label: 'Desktop' },
  tablet: { width: 768, icon: 'tablet', label: 'Tablet' },
  phone: { width: 390, icon: 'phone_iphone', label: 'Phone' },
};

// ---------------------------------------------------------------------------
// Main Prototype (view switcher + device toggle)
// ---------------------------------------------------------------------------
type View = 'admin' | 'srp' | 'settings';

const VIEW_LABELS: Record<View, string> = {
  admin: 'Admin CMS',
  srp: 'Shopper SRP',
  settings: 'Settings',
};

export function TagsPrototype() {
  const [view, setView] = useState<View>('admin');
  const [device, setDevice] = useState<DeviceMode>('desktop');

  const overrideWidth = DEVICE_CONFIG[device].width;
  const isConstrained = overrideWidth !== null;

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        background: isConstrained ? 'var(--rev-color-backgroundTertiary)' : undefined,
        overflow: isConstrained ? 'hidden' : undefined,
      }}
    >
      {/* Floating control bar */}
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
        {/* View switcher pills */}
        {(['admin', 'srp', 'settings'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              fontFamily: 'var(--rev-fontFamily)',
              fontSize: '11px',
              lineHeight: '16px',
              fontWeight:
                view === v
                  ? ('var(--rev-fontWeight-semibold)' as unknown as number)
                  : ('var(--rev-fontWeight-regular)' as unknown as number),
              padding: '6px 14px',
              border: 'none',
              cursor: 'pointer',
              background:
                view === v
                  ? 'var(--rev-color-carbonGray)'
                  : 'var(--rev-color-backgroundPrimary)',
              color:
                view === v
                  ? 'var(--rev-color-textInvertPrimary)'
                  : 'var(--rev-color-textSecondary)',
              transition:
                'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
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

        {/* Device toggle icons */}
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
              background:
                device === d
                  ? 'var(--rev-color-carbonGray)'
                  : 'var(--rev-color-backgroundPrimary)',
              color:
                device === d
                  ? 'var(--rev-color-textInvertPrimary)'
                  : 'var(--rev-color-textTertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition:
                'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px' }}
            >
              {DEVICE_CONFIG[d].icon}
            </span>
          </button>
        ))}
      </div>

      {/* Content area with viewport override */}
      <ViewportWidthContext.Provider value={overrideWidth}>
        {isConstrained ? (
          /* Device frame: centered container with shadow */
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
              {view === 'admin' && <AdminDrawerView />}
              {view === 'srp' && <SRPView />}
              {view === 'settings' && <SettingsView />}
            </div>
          </div>
        ) : (
          /* Desktop: full viewport */
          <div style={{ height: '100vh' }}>
            {view === 'admin' && <AdminDrawerView />}
            {view === 'srp' && <SRPView />}
            {view === 'settings' && <SettingsView />}
          </div>
        )}
      </ViewportWidthContext.Provider>
    </div>
  );
}
