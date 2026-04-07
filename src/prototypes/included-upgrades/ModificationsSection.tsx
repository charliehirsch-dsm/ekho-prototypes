import { useState } from 'react';
import { Text, Stack, Group, Badge, Button, Divider, AccordionSection, toast, useMediaQuery, Note } from '../../rev';
import type { ModificationEntry, VehicleModificationsData } from './mock-data';
import { AddModificationModal } from './AddModificationModal';

// ---------------------------------------------------------------------------
// Source badge (per-entry) -- small tag style matching production Tag component
// ---------------------------------------------------------------------------
function SourceBadge({ source }: { source: 'dms' | 'ekho' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '1px 6px',
        borderRadius: 'var(--rev-borderRadius-full)',
        fontSize: '11px',
        lineHeight: '16px',
        fontWeight: 500,
        fontFamily: 'var(--rev-fontFamily)',
        background: source === 'dms'
          ? 'var(--rev-color-informationBackground, rgba(59,130,246,0.08))'
          : 'var(--rev-color-backgroundSecondary)',
        color: source === 'dms'
          ? 'var(--rev-color-informationText, #3b82f6)'
          : 'var(--rev-color-textTertiary)',
        border: source === 'dms'
          ? '1px solid var(--rev-color-informationBorder, rgba(59,130,246,0.2))'
          : '1px solid var(--rev-color-separatorTertiary)',
        whiteSpace: 'nowrap',
      }}
    >
      {source === 'dms' ? 'DMS Synced' : 'Added in Ekho'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Per-field source indicator (inline micro-badge)
// ---------------------------------------------------------------------------
function FieldSourceTag({ source, isOverridden }: { source: 'DMS' | 'EKHO'; isOverridden?: boolean }) {
  if (!isOverridden && source === 'EKHO') return null;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        padding: '0 5px',
        borderRadius: 'var(--rev-borderRadius-full)',
        fontSize: '10px',
        lineHeight: '14px',
        fontWeight: 500,
        fontFamily: 'var(--rev-fontFamily)',
        background: isOverridden
          ? 'var(--rev-color-informationBackground, rgba(59,130,246,0.08))'
          : 'var(--rev-color-backgroundSecondary)',
        color: isOverridden
          ? 'var(--rev-color-informationText, #3b82f6)'
          : 'var(--rev-color-textTertiary)',
        border: `1px solid ${isOverridden ? 'var(--rev-color-informationBorder, rgba(59,130,246,0.2))' : 'var(--rev-color-separatorTertiary)'}`,
      }}
    >
      {isOverridden && (
        <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>edit</span>
      )}
      {source}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Image placeholder (matches production 48x48 dashed border)
// ---------------------------------------------------------------------------
function ImagePlaceholder() {
  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        border: '1px dashed rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '18px', color: 'rgba(0,0,0,0.25)' }}
      >
        build
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// More button (matches Rev IconButton ghost style)
// ---------------------------------------------------------------------------
function MoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--rev-color-backgroundSecondary)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--rev-borderRadius-10)',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--rev-color-textSecondary)',
        flexShrink: 0,
        transition: 'background var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_horiz</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Menu item (matches Rev Dropdown row with hover highlight)
// ---------------------------------------------------------------------------
function MenuItem({
  label,
  icon,
  destructive,
  onClick,
}: {
  label: string;
  icon?: string;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--rev-color-menuHighlight)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
      style={{
        width: '100%',
        padding: '8px 12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'var(--rev-fontFamily)',
        fontSize: '13px',
        lineHeight: '18px',
        color: destructive ? 'var(--rev-color-textDestructive, #ef4444)' : 'var(--rev-color-textPrimary)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background var(--rev-duration-presto)',
      }}
    >
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>
      )}
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Action menu dropdown (matches Rev popover / Dropdown pattern)
// ---------------------------------------------------------------------------
function ActionMenu({
  onEdit,
  onDelete,
  canDelete,
  onClose,
}: {
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: '4px',
          background: 'var(--rev-color-backgroundPrimary)',
          borderRadius: 'var(--rev-borderRadius-12)',
          boxShadow: 'var(--rev-boxShadow-elevation3)',
          border: '1px solid var(--rev-color-separatorTertiary)',
          minWidth: '160px',
          zIndex: 100,
          overflow: 'hidden',
          padding: '4px 0',
          animation: 'revFadeIn var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
        }}
      >
        <MenuItem icon="edit" label="Edit details" onClick={() => { onEdit(); onClose(); }} />
        {canDelete && (
          <MenuItem icon="delete" label="Remove" destructive onClick={() => { onDelete(); onClose(); }} />
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Modification row (matches production Accessories list row pattern)
// Flat row: [Thumbnail 48x48] [Name + subtitle] [Price] [MoreButton]
// ---------------------------------------------------------------------------
function ModificationRow({
  entry,
  index,
  onEdit,
  onDelete,
}: {
  entry: ModificationEntry;
  index: number;
  onEdit: (entry: ModificationEntry) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDMS = entry.source === 'dms';
  const thumbnailUrl = entry.images?.[0];

  // Check for overridden fields on DMS entries
  const titleOverridden = isDMS && entry.fieldSources.title.source === 'EKHO';
  const descOverridden = isDMS && entry.fieldSources.description.source === 'EKHO';
  const priceOverridden = isDMS && entry.fieldSources.price.source === 'EKHO';
  const hasOverrides = titleOverridden || descOverridden || priceOverridden;

  return (
    <div style={{ padding: '10px 0', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Thumbnail */}
        {thumbnailUrl ? (
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={thumbnailUrl}
              alt={entry.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <ImagePlaceholder />
        )}

        {/* Name + source badge, then brand + part number */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Text size="bodySmall" weight="semibold">{entry.title}</Text>
            <SourceBadge source={entry.source} />
            {index === 0 && (
              <Note inline>
                <strong>Source badge</strong> — "DMS Synced" for items pulled from the dealer's DMS, "Added in Ekho" for manually created entries. Buyers never see this distinction.
              </Note>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
            {entry.brand && (
              <Text size="footnote" color="secondary">{entry.brand}</Text>
            )}
            {entry.brand && entry.partNumber && (
              <Text size="footnote" color="tertiary">{'\u00B7'}</Text>
            )}
            {entry.partNumber && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(entry.partNumber!);
                  toast.success('Part number copied');
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
                title="Click to copy"
              >
                <Text size="footnote" color="secondary" style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '2px' }}>
                  {entry.partNumber}
                </Text>
              </button>
            )}
            {index === 2 && (
              <Note inline>
                <strong>Brand + Part #</strong> — Always shown when available. Part number has a dotted underline and is click-to-copy (copies to clipboard with a toast confirmation).
              </Note>
            )}
          </div>
        </div>

        {/* Note on remove action (first Ekho entry) */}
        {!isDMS && index === 3 && (
          <Note inline align="left">
            <strong>Remove action</strong> — The "Remove" option in the ... menu is only available for "Added in Ekho" modifications. DMS-synced entries cannot be removed since they are managed by the dealer's DMS.
          </Note>
        )}

        {/* Price */}
        <Text size="bodySmall" style={{ flexShrink: 0 }}>
          {entry.price > 0
            ? `$${entry.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            : '\u2014'}
        </Text>

        {/* More button */}
        <MoreButton onClick={() => setMenuOpen(true)} />
      </div>

      {/* Action menu */}
      {menuOpen && (
        <ActionMenu
          onEdit={() => onEdit(entry)}
          onDelete={() => {
            onDelete(entry.id);
            toast.success('Modification removed');
          }}
          canDelete={entry.source === 'ekho'}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      style={{
        padding: '32px 16px',
        textAlign: 'center',
      }}
    >
      <Stack itemsSpacing="8" style={{ alignItems: 'center' }}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '32px', color: 'var(--rev-color-textTertiary)' }}
        >
          build_circle
        </span>
        <Text size="bodySmall" color="secondary">
          No modifications on this vehicle.
        </Text>
        <Text size="footnote" color="tertiary">
          DMS-synced accessories will appear here automatically.
        </Text>
        <div style={{ marginTop: '8px' }}>
          <Button variant="secondary" onPress={onAdd}>
            Add modification
          </Button>
        </div>
      </Stack>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section (Modifications under Accessories tab)
// ---------------------------------------------------------------------------
export function ModificationsSection({
  vehicle,
}: {
  vehicle: VehicleModificationsData;
}) {
  const isPhone = useMediaQuery('(max-width: 640px)');
  const [modifications, setModifications] = useState<ModificationEntry[]>(vehicle.modifications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ModificationEntry | null>(null);

  const handleSave = (entry: ModificationEntry) => {
    const idx = modifications.findIndex((m) => m.id === entry.id);
    if (idx >= 0) {
      const updated = [...modifications];
      updated[idx] = entry;
      setModifications(updated);
    } else {
      setModifications([...modifications, entry]);
    }
  };

  const handleDelete = (id: string) => {
    setModifications(modifications.filter((m) => m.id !== id));
  };

  const handleEdit = (entry: ModificationEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const dmsCount = modifications.filter((m) => m.source === 'dms').length;
  const ekhoCount = modifications.filter((m) => m.source === 'ekho').length;
  const totalValue = modifications.reduce((sum, m) => sum + m.price, 0);

  return (
    <AccordionSection
      title="Modifications"
      defaultExpanded
      rightAccessory={
        modifications.length > 0 ? (
          <Badge variant="neutral">{modifications.length}</Badge>
        ) : undefined
      }
    >
      <Stack itemsSpacing="0">
        {/* Description */}
        <div style={{ padding: '0 0 12px' }}>
          <Text size="footnote" color="secondary">
            These show as "Included upgrades" on your listing. Syncs from your DMS, or add your own. Priced items are added to the vehicle price.
          </Text>
        </div>

        {/* Header bar: summary + Add button */}
        {modifications.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              {totalValue > 0 ? (
                <Stack itemsSpacing="2">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Text size="bodySmall" weight="semibold">
                      Total: ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                    <Note inline>
                      <strong>Total price</strong> — Sum of all priced modifications. This amount is added to the vehicle's advertised price. $0 items (like the sprocket) are included but don't affect price.
                    </Note>
                  </div>
                  <Text size="footnote" color="tertiary">Added to vehicle price</Text>
                </Stack>
              ) : (
                <div />
              )}
              <Button
                variant="secondary"
                onPress={() => {
                  setEditingEntry(null);
                  setIsModalOpen(true);
                }}
              >
                Add
              </Button>
            </div>
          </>
        )}

        {/* List */}
        {modifications.length === 0 ? (
          <EmptyState onAdd={() => setIsModalOpen(true)} />
        ) : (
          <Stack itemsSpacing="0">
            {modifications.map((mod, index) => (
              <div key={mod.id}>
                <ModificationRow
                  entry={mod}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {index < modifications.length - 1 && <Divider />}
              </div>
            ))}
          </Stack>
        )}

      </Stack>

      {/* Modal */}
      {isModalOpen && (
        <AddModificationModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingEntry(null);
          }}
          onSave={handleSave}
          existingEntry={editingEntry}
        />
      )}
    </AccordionSection>
  );
}
