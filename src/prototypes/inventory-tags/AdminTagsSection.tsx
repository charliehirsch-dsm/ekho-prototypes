import { useState } from 'react';
import { Stack, Text, AccordionSection, Badge, toast } from '../../rev';
import { INVENTORY_TAG_CATALOG, ADMIN_DEMO_VEHICLE } from './mock-data';
import type { InventoryTagKey } from './mock-data';

// Chip component (outline → solid on select)
function TagChip({
  label,
  icon,
  selected,
  onToggle,
}: {
  label: string;
  icon: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: 'var(--rev-borderRadius-full)',
        border: selected
          ? '1.5px solid var(--rev-color-accent5Bold)'
          : '1px solid var(--rev-color-separatorTertiary)',
        background: selected ? 'var(--rev-color-accent5Light)' : 'transparent',
        color: selected
          ? 'var(--rev-color-accent5Bold)'
          : 'var(--rev-color-textSecondary)',
        fontFamily: 'var(--rev-fontFamily)',
        fontSize: '13px',
        lineHeight: '18px',
        fontWeight: selected
          ? ('var(--rev-fontWeight-semibold)' as unknown as number)
          : ('var(--rev-fontWeight-regular)' as unknown as number),
        cursor: 'pointer',
        transition:
          'all var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
        userSelect: 'none',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '16px' }}
      >
        {icon}
      </span>
      {label}
      {selected && (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '14px', marginLeft: '2px' }}
        >
          close
        </span>
      )}
    </button>
  );
}

export function AdminTagsSection() {
  const [selectedTags, setSelectedTags] = useState<Set<InventoryTagKey>>(
    new Set(ADMIN_DEMO_VEHICLE.tags.map((t) => t.key))
  );

  const originalTags = new Set(ADMIN_DEMO_VEHICLE.tags.map((t) => t.key));
  const hasChanges =
    selectedTags.size !== originalTags.size ||
    [...selectedTags].some((t) => !originalTags.has(t));

  function toggleTag(key: InventoryTagKey) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        if (next.size >= 2) {
          toast.info('Maximum 2 tags per vehicle');
          return prev;
        }
        next.add(key);
      }
      return next;
    });
  }

  return (
    <AccordionSection
      title="Tags"
      defaultExpanded={true}
      rightAccessory={
        selectedTags.size > 0 ? (
          <Badge variant="warning">{selectedTags.size}</Badge>
        ) : undefined
      }
    >
      <Stack itemsSpacing="12">
        <Text size="footnote" color="secondary">
          Select up to 2 tags to display on this listing. Tags appear as badges
          on the SRP card and as filters for shoppers.
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {INVENTORY_TAG_CATALOG.map((tag) => (
            <TagChip
              key={tag.key}
              label={tag.label}
              icon={tag.icon}
              selected={selectedTags.has(tag.key)}
              onToggle={() => toggleTag(tag.key)}
            />
          ))}
        </div>
        {hasChanges && (
          <Text size="footnote" color="tertiary" style={{ fontStyle: 'italic' }}>
            Unsaved changes. Press "Save & publish" to apply.
          </Text>
        )}
      </Stack>
    </AccordionSection>
  );
}
