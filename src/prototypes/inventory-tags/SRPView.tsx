import { useState, useMemo } from 'react';
import { Text, Group, Stack, Button, useMediaQuery } from '../../rev';
import {
  DEMO_VEHICLES,
  INVENTORY_TAG_CATALOG,
  getTagDef,
} from './mock-data';
import type { InventoryTagKey, VehicleListing } from './mock-data';

// ---------------------------------------------------------------------------
// Tag Badge (orange outline pill for card overlay)
// ---------------------------------------------------------------------------
function TagBadge({ label, icon }: { label: string; icon: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 8px 2px 5px',
        borderRadius: 'var(--rev-borderRadius-full)',
        border: '1.5px solid var(--rev-color-accent5Bold)',
        background: 'rgba(255,255,255,0.92)',
        color: 'var(--rev-color-accent5Bold)',
        fontSize: '11px',
        lineHeight: '16px',
        fontWeight: 'var(--rev-fontWeight-semibold)' as unknown as number,
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(4px)',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '13px' }}
      >
        {icon}
      </span>
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Save Badge (green filled pill)
// ---------------------------------------------------------------------------
function SaveBadge({ amount }: { amount: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: 'var(--rev-borderRadius-full)',
        background: 'var(--rev-color-successBold)',
        color: 'white',
        fontSize: '11px',
        lineHeight: '16px',
        fontWeight: 'var(--rev-fontWeight-semibold)' as unknown as number,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '12px' }}
      >
        sell
      </span>
      Save ${amount.toLocaleString()}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Toolbar Pill
// ---------------------------------------------------------------------------
function ToolbarPill({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 14px',
        borderRadius: 'var(--rev-borderRadius-full)',
        border: active
          ? '1.5px solid var(--rev-color-carbonGray)'
          : '1px solid var(--rev-color-separatorTertiary)',
        background: active
          ? 'var(--rev-color-carbonGray)'
          : 'var(--rev-color-backgroundPrimary)',
        color: active
          ? 'var(--rev-color-textInvertPrimary)'
          : 'var(--rev-color-textPrimary)',
        fontFamily: 'var(--rev-fontFamily)',
        fontSize: '13px',
        lineHeight: '18px',
        fontWeight: active
          ? ('var(--rev-fontWeight-semibold)' as unknown as number)
          : ('var(--rev-fontWeight-regular)' as unknown as number),
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition:
          'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
      }}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span style={{ fontSize: '11px', opacity: 0.7 }}>({count})</span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Vehicle Card
// ---------------------------------------------------------------------------
function VehicleCard({ vehicle }: { vehicle: VehicleListing }) {
  const sortedTags = [...vehicle.tags].sort(
    (a, b) => getTagDef(a.key).priority - getTagDef(b.key).priority
  );
  const visibleTags = sortedTags.slice(0, 2);

  return (
    <div
      style={{
        background: 'var(--rev-color-backgroundPrimary)',
        borderRadius: 'var(--rev-borderRadius-12)',
        border: '1px solid var(--rev-color-separatorTertiary)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition:
          'box-shadow var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          'var(--rev-boxShadow-elevation2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Image area with badge overlays */}
      <div
        style={{
          position: 'relative',
          height: '180px',
          background: vehicle.imageUrl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '48px', color: 'rgba(255,255,255,0.2)' }}
        >
          two_wheeler
        </span>

        {/* Tag badge stack: top-left (max 2) */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {visibleTags.map((tag) => {
            const def = getTagDef(tag.key);
            return <TagBadge key={tag.key} label={def.label} icon={def.icon} />;
          })}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '12px 14px 14px' }}>
        <Stack itemsSpacing="4">
          <Text size="bodySmall" weight="semibold">
            {vehicle.year} {vehicle.make} {vehicle.model}
            {vehicle.trim ? ` ${vehicle.trim}` : ''}
          </Text>
          <Text size="footnote" color="secondary">
            {vehicle.category}
            {vehicle.mileage > 0
              ? ` \u00b7 ${vehicle.mileage.toLocaleString()} mi`
              : ''}
          </Text>
          <Text size="footnote" color="tertiary">
            {vehicle.location}
          </Text>
          <div style={{ marginTop: '4px' }}>
            <Group itemsSpacing="6" itemsAlignY="center">
              <Text size="body" weight="bold">
                ${vehicle.price.toLocaleString()}
              </Text>
              {vehicle.savings > 0 && (
                <Text
                  size="footnote"
                  color="tertiary"
                  style={{ textDecoration: 'line-through' }}
                >
                  ${vehicle.msrp.toLocaleString()}
                </Text>
              )}
              {vehicle.savings > 0 && <SaveBadge amount={vehicle.savings} />}
            </Group>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Group itemsSpacing="8" noWrap>
              <button
                style={{
                  flex: 1,
                  fontFamily: 'var(--rev-fontFamily)',
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 'var(--rev-fontWeight-semibold)' as unknown as number,
                  padding: '8px 0',
                  borderRadius: 'var(--rev-borderRadius-8)',
                  border: '1px solid var(--rev-color-separatorTertiary)',
                  background: 'var(--rev-color-backgroundPrimary)',
                  color: 'var(--rev-color-textPrimary)',
                  cursor: 'pointer',
                }}
              >
                Send Inquiry
              </button>
              <button
                style={{
                  flex: 1,
                  fontFamily: 'var(--rev-fontFamily)',
                  fontSize: '12px',
                  lineHeight: '16px',
                  fontWeight: 'var(--rev-fontWeight-semibold)' as unknown as number,
                  padding: '8px 0',
                  borderRadius: 'var(--rev-borderRadius-8)',
                  border: 'none',
                  background: 'var(--rev-color-carbonGray)',
                  color: 'var(--rev-color-textInvertPrimary)',
                  cursor: 'pointer',
                }}
              >
                Buy now
              </button>
            </Group>
          </div>
        </Stack>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar Filter Section (collapsed stub)
// ---------------------------------------------------------------------------
function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--rev-color-separatorTertiary)' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Text size="bodySmall" weight="semibold">{title}</Text>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '18px',
            color: 'var(--rev-color-textTertiary)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--rev-duration-allegro)',
          }}
        >
          expand_more
        </span>
      </div>
      {open && children && (
        <div style={{ paddingBottom: '12px' }}>{children}</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Applied Filters Chip
// ---------------------------------------------------------------------------
function AppliedFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px 3px 10px',
        borderRadius: 'var(--rev-borderRadius-full)',
        background: 'var(--rev-color-accent5Light)',
        border: '1px solid var(--rev-color-accent5Bold)',
        color: 'var(--rev-color-accent5Bold)',
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: 'var(--rev-fontWeight-semibold)' as unknown as number,
      }}
    >
      {label}
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '14px', cursor: 'pointer' }}
        onClick={onRemove}
      >
        close
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Filters content (shared between sidebar and sheet)
// ---------------------------------------------------------------------------
function FiltersContent({
  tagCounts,
  activeTagFilter,
  setActiveTagFilter,
  activePill,
  setActivePill,
}: {
  tagCounts: Map<InventoryTagKey, number>;
  activeTagFilter: InventoryTagKey | null;
  setActiveTagFilter: (v: InventoryTagKey | null) => void;
  activePill: CategoryPillId;
  setActivePill: (v: CategoryPillId) => void;
}) {
  return (
    <Stack itemsSpacing="0">
      {/* Applied filters */}
      {(activeTagFilter || activePill !== 'all') && (
        <div
          style={{
            paddingBottom: '12px',
            borderBottom: '1px solid var(--rev-color-separatorTertiary)',
          }}
        >
          <Group
            itemsAlignX="space-between"
            itemsAlignY="center"
            style={{ marginBottom: '8px' }}
          >
            <Text size="footnote" color="secondary" weight="semibold">
              APPLIED FILTERS
            </Text>
            <button
              onClick={() => {
                setActiveTagFilter(null);
                setActivePill('all');
              }}
              style={{
                fontFamily: 'var(--rev-fontFamily)',
                fontSize: '11px',
                color: 'var(--rev-color-textTertiary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear all
            </button>
          </Group>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {activePill !== 'all' && (
              <AppliedFilterChip
                label={
                  CATEGORY_PILLS.find((p) => p.id === activePill)?.label ||
                  activePill
                }
                onRemove={() => setActivePill('all')}
              />
            )}
            {activeTagFilter && (
              <AppliedFilterChip
                label={getTagDef(activeTagFilter).label}
                onRemove={() => setActiveTagFilter(null)}
              />
            )}
          </div>
        </div>
      )}

      {/* Inventory Tags filter */}
      <FilterSection title="Inventory Tags" defaultOpen={true}>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          {INVENTORY_TAG_CATALOG.map((tag) => {
            const count = tagCounts.get(tag.key) || 0;
            const isActive = activeTagFilter === tag.key;
            return (
              <label
                key={tag.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: count > 0 ? 'pointer' : 'default',
                  opacity: count > 0 ? 1 : 0.4,
                  padding: '4px 0',
                }}
                onClick={() => {
                  if (count > 0)
                    setActiveTagFilter(
                      activeTagFilter === tag.key ? null : tag.key
                    );
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    border: isActive
                      ? '1.5px solid var(--rev-color-accent5Bold)'
                      : '1.5px solid var(--rev-color-separatorSecondary)',
                    background: isActive
                      ? 'var(--rev-color-accent5Bold)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isActive && (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '12px', color: 'white' }}
                    >
                      check
                    </span>
                  )}
                </div>
                <Text size="bodySmall">{tag.label}</Text>
                <Text
                  size="footnote"
                  color="tertiary"
                  style={{ marginLeft: 'auto' }}
                >
                  {count}
                </Text>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Other filter sections (collapsed stubs) */}
      <FilterSection title="Price Range" />
      <FilterSection title="Monthly Payment" />
      <FilterSection title="Make" />
      <FilterSection title="Model" />
      <FilterSection title="Year" />
      <FilterSection title="Category" />
      <FilterSection title="Mileage" />
      <FilterSection title="Exterior Color" />
      <FilterSection title="Location" />
      <FilterSection title="Fuel Type" />
      <FilterSection title="Engine Displacement" />
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Mobile Filter Sheet (bottom sheet overlay)
// ---------------------------------------------------------------------------
function MobileFilterSheet({
  onClose,
  resultCount,
  children,
}: {
  onClose: () => void;
  resultCount: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '85vh',
          background: 'var(--rev-color-backgroundPrimary)',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          flexDirection: 'column',
          animation:
            'sheetSlideUp var(--rev-duration-moderato) var(--rev-timingFunction-curveOut)',
        }}
      >
        {/* Handle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '10px 0 4px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '4px',
              borderRadius: '2px',
              background: 'var(--rev-color-backgroundTertiary)',
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            padding: '8px 20px 12px',
            borderBottom: '1px solid var(--rev-color-separatorTertiary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text size="body" weight="bold">
            Filters
          </Text>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--rev-color-separatorTertiary)',
              background: 'var(--rev-color-backgroundPrimary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '18px' }}
            >
              close
            </span>
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 20px',
          }}
        >
          {children}
        </div>

        {/* Sticky footer */}
        <div
          style={{
            padding: '12px 20px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            borderTop: '1px solid var(--rev-color-separatorTertiary)',
            background: 'var(--rev-color-backgroundPrimary)',
            display: 'flex',
            gap: '12px',
          }}
        >
          <Button variant="filled" onPress={onClose} style={{ flex: 1 }}>
            View results ({resultCount})
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SRP View
// ---------------------------------------------------------------------------
const CATEGORY_PILLS = [
  { id: 'all', label: 'All' },
  { id: 'New', label: 'New' },
  { id: 'Used', label: 'Used' },
  { id: 'Motorcycle', label: 'Motorcycles & Bikes' },
  { id: 'ATV', label: 'ATVs' },
  { id: 'Side-by-Side', label: 'Side-by-Sides' },
  { id: 'Watercraft', label: 'Watercraft' },
] as const;

type CategoryPillId = (typeof CATEGORY_PILLS)[number]['id'];

export function SRPView() {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const isPhone = useMediaQuery('(max-width: 640px)');

  const [activePill, setActivePill] = useState<CategoryPillId>('all');
  const [activeTagFilter, setActiveTagFilter] =
    useState<InventoryTagKey | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Compute which tags have inventory
  const tagCounts = useMemo(() => {
    const counts = new Map<InventoryTagKey, number>();
    for (const v of DEMO_VEHICLES) {
      for (const t of v.tags) {
        counts.set(t.key, (counts.get(t.key) || 0) + 1);
      }
    }
    return counts;
  }, []);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return DEMO_VEHICLES.filter((v) => {
      if (activePill === 'New' && v.condition !== 'New') return false;
      if (activePill === 'Used' && v.condition !== 'Used') return false;
      if (activePill === 'Motorcycle' && v.category !== 'Motorcycle')
        return false;
      if (activePill === 'ATV' && v.category !== 'ATV') return false;
      if (activePill === 'Side-by-Side' && v.category !== 'Side-by-Side')
        return false;
      if (activePill === 'Watercraft' && v.category !== 'Watercraft')
        return false;
      if (activeTagFilter && !v.tags.some((t) => t.key === activeTagFilter))
        return false;
      return true;
    });
  }, [activePill, activeTagFilter]);

  const totalFilterCount =
    (activePill !== 'all' ? 1 : 0) + (activeTagFilter ? 1 : 0);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Top header bar */}
      <div
        style={{
          background: 'var(--rev-color-carbonGray)',
          padding: isPhone ? '10px 16px' : '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text size="bodySmall" weight="bold" color="invertPrimary">
          SoCal Motorcycles
        </Text>
        {!isPhone && (
          <Group itemsSpacing="16" itemsAlignY="center">
            <Text
              size="footnote"
              color="invertPrimary"
              style={{ opacity: 0.6 }}
            >
              Inventory
            </Text>
            <Text
              size="footnote"
              color="invertPrimary"
              style={{ opacity: 0.6 }}
            >
              Sell/Trade
            </Text>
            <Text
              size="footnote"
              color="invertPrimary"
              style={{ opacity: 0.6 }}
            >
              Financing
            </Text>
            <Text
              size="footnote"
              color="invertPrimary"
              style={{ opacity: 0.6 }}
            >
              About
            </Text>
          </Group>
        )}
        {isPhone && (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '22px', color: 'white' }}
          >
            menu
          </span>
        )}
      </div>

      {/* Toolbar */}
      <div
        style={{
          padding: isPhone ? '10px 16px' : '12px 24px',
          borderBottom: '1px solid var(--rev-color-separatorTertiary)',
          background: 'var(--rev-color-backgroundPrimary)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Filters button */}
        {isMobile ? (
          <div style={{ flexShrink: 0, position: 'relative' }}>
            <button
              onClick={() => setSheetOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--rev-borderRadius-full)',
                border: '1px solid var(--rev-color-separatorTertiary)',
                background: 'var(--rev-color-backgroundPrimary)',
                fontFamily: 'var(--rev-fontFamily)',
                fontSize: '13px',
                lineHeight: '18px',
                fontWeight:
                  'var(--rev-fontWeight-semibold)' as unknown as number,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: 'var(--rev-color-textPrimary)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                tune
              </span>
              Filters
            </button>
            {totalFilterCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--rev-color-errorBold)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'var(--rev-fontWeight-bold)' as unknown as number,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalFilterCount}
              </span>
            )}
          </div>
        ) : (
          <div style={{ flexShrink: 0 }}>
            <ToolbarPill
              label={
                sidebarOpen
                  ? `Hide Filters${totalFilterCount > 0 ? ` (${totalFilterCount})` : ''}`
                  : `All Filters${totalFilterCount > 0 ? ` (${totalFilterCount})` : ''}`
              }
              active={false}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
        )}

        {/* Result count on mobile */}
        {isMobile && (
          <Text size="bodySmall" color="secondary" style={{ flexShrink: 0 }}>
            {filteredVehicles.length} results
          </Text>
        )}

        {/* Category pills: horizontally scrollable on mobile, centered on desktop */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'center',
            overflow: isMobile ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'nowrap',
            }}
          >
            {CATEGORY_PILLS.map((pill) => (
              <ToolbarPill
                key={pill.id}
                label={pill.label}
                active={activePill === pill.id}
                onClick={() =>
                  setActivePill((p) => (p === pill.id ? 'all' : pill.id))
                }
              />
            ))}
          </div>
        </div>

        {/* Spacer to balance (desktop only) */}
        {!isMobile && (
          <div style={{ flexShrink: 0, visibility: 'hidden' }}>
            <ToolbarPill
              label="Hide Filters"
              active={false}
              onClick={() => {}}
            />
          </div>
        )}
      </div>

      {/* Main area: sidebar + grid */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Desktop sidebar filters */}
        {!isMobile && sidebarOpen && (
          <div
            style={{
              width: '280px',
              flexShrink: 0,
              borderRight: '1px solid var(--rev-color-separatorTertiary)',
              overflowY: 'auto',
              padding: '16px 20px',
              background: 'var(--rev-color-backgroundPrimary)',
            }}
          >
            <FiltersContent
              tagCounts={tagCounts}
              activeTagFilter={activeTagFilter}
              setActiveTagFilter={setActiveTagFilter}
              activePill={activePill}
              setActivePill={setActivePill}
            />
          </div>
        )}

        {/* Vehicle grid */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isPhone ? '16px' : '20px 24px',
          }}
        >
          {/* Results count (desktop only, mobile shows in toolbar) */}
          {!isMobile && (
            <div style={{ marginBottom: '16px' }}>
              <Text size="bodySmall" color="secondary">
                {filteredVehicles.length} vehicle
                {filteredVehicles.length !== 1 ? 's' : ''}
                {activeTagFilter
                  ? ` tagged "${getTagDef(activeTagFilter).label}"`
                  : ''}
              </Text>
            </div>
          )}

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isPhone
                ? '1fr'
                : isMobile
                  ? 'repeat(auto-fill, minmax(240px, 1fr))'
                  : sidebarOpen
                    ? 'repeat(auto-fill, minmax(260px, 1fr))'
                    : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: isPhone ? '12px' : '16px',
            }}
          >
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '48px',
                  color: 'var(--rev-color-textQuaternary)',
                }}
              >
                search_off
              </span>
              <Text
                size="bodySmall"
                color="secondary"
                as="p"
                style={{ marginTop: '12px' }}
              >
                No vehicles match the current filters.
              </Text>
              <button
                onClick={() => {
                  setActiveTagFilter(null);
                  setActivePill('all');
                }}
                style={{
                  fontFamily: 'var(--rev-fontFamily)',
                  fontSize: '13px',
                  color: 'var(--rev-color-accent5Bold)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '8px',
                  textDecoration: 'underline',
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {isMobile && sheetOpen && (
        <MobileFilterSheet
          onClose={() => setSheetOpen(false)}
          resultCount={filteredVehicles.length}
        >
          <FiltersContent
            tagCounts={tagCounts}
            activeTagFilter={activeTagFilter}
            setActiveTagFilter={setActiveTagFilter}
            activePill={activePill}
            setActivePill={setActivePill}
          />
        </MobileFilterSheet>
      )}

      {/* CSS for sheet animation and scrollbar hiding */}
      <style>{`
        @keyframes sheetSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
