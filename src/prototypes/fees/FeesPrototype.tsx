import { useEffect, useRef, useState } from 'react';
import { Stack, Text, Group, Breadcrumbs, Divider, Dropdown, Box, Tabs, Button } from '../../rev';
import { FeeSection } from './FeeSection';
import { DEMO_FEES, COMMENTARY } from './mock-data';
import type { FeeConfig } from './mock-data';

// ---------------------------------------------------------------------------
// Commentary card (far-right prototype notes column)
// ---------------------------------------------------------------------------
function CommentaryCard({ title, notes }: { title: string; notes: string[] }) {
  return (
    <Box
      background="primary"
      rounding="12"
      padding="16"
      style={{ border: '1px solid var(--rev-color-separatorTertiary)' }}
    >
      <Stack itemsSpacing="8">
        <Text size="bodySmall" weight="semibold">{title}</Text>
        <ul style={{ margin: 0, paddingLeft: '16px' }}>
          {notes.map((note, i) => (
            <li
              key={i}
              style={{
                fontSize: '12px',
                lineHeight: '17px',
                color: 'var(--rev-color-textSecondary)',
                fontFamily: 'var(--rev-fontFamily)',
                marginBottom: '4px',
              }}
            >
              {note}
            </li>
          ))}
        </ul>
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Table of Contents (inside product area, matching production pattern)
// Sticky, 160px wide, border-left active indicator
// ---------------------------------------------------------------------------
function TableOfContents({ activeId, sections, onSelect }: { activeId: string; sections: { id: string; label: string }[]; onSelect?: (id: string) => void }) {
  return (
    <nav style={{ width: '160px', flexShrink: 0 }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
        {sections.map((section) => {
          const isActive = activeId === section.id;
          return (
            <li key={section.id} style={{ margin: 0, padding: 0 }}>
              <a
                href={`#section-${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect?.(section.id);
                  const el = document.getElementById(`section-${section.id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  display: 'block',
                  padding: '6px 12px',
                  borderLeft: `2px solid ${isActive ? 'var(--rev-color-textPrimary)' : 'transparent'}`,
                  fontSize: '13px',
                  lineHeight: '1.4',
                  fontFamily: 'var(--rev-fontFamily)',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? 'var(--rev-color-textPrimary)'
                    : 'var(--rev-color-textTertiary)',
                  textDecoration: 'none',
                  transition: 'color 150ms ease, border-color 150ms ease',
                  cursor: 'pointer',
                }}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Settings section (matches admin portal SettingsSection pattern)
// Left: 220px sticky header. Right: flex-1 content. 24px gap.
// ---------------------------------------------------------------------------
function SettingsSection({
  id,
  title,
  description,
  hideDivider,
  onEdit,
  onDelete,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  hideDivider?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}) {
  const iconBtnStyle: React.CSSProperties = {
    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: 'var(--rev-borderRadius-8)',
    color: 'var(--rev-color-textTertiary)',
    transition: 'color 150ms ease',
  };

  return (
    <div id={id} style={{ scrollMarginTop: '32px' }}>
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          paddingBlock: '32px',
        }}
      >
        {/* Left header (sticky) */}
        <div
          style={{
            flex: '0 0 220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            position: 'sticky',
            top: '32px',
            alignSelf: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Text size="heading" weight="bold">{title}</Text>
              {description && (
                <Text size="bodySmall" color="secondary">{description}</Text>
              )}
            </div>
            {(onEdit || onDelete) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                {onEdit && (
                  <button onClick={onEdit} title="Edit fee name" style={iconBtnStyle}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button onClick={onDelete} title="Remove fee" style={iconBtnStyle}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
      </div>
      {!hideDivider && <Divider />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// New fee modal
// ---------------------------------------------------------------------------
const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--rev-fontFamily)',
  fontSize: '13px',
  lineHeight: '18px',
  padding: '8px 12px',
  borderRadius: 'var(--rev-borderRadius-10)',
  border: '1px solid var(--rev-color-separatorTertiary)',
  background: '#fff',
  color: 'var(--rev-color-textPrimary)',
  outline: 'none',
};

function FeeModal({
  initialName,
  initialDescription,
  onSave,
  onClose,
}: {
  initialName?: string;
  initialDescription?: string;
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}) {
  const isEditing = initialName != null;
  const [name, setName] = useState(initialName ?? '');
  const [description, setDescription] = useState(initialDescription ?? '');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.4)' }}
      />
      <div
        style={{
          position: 'relative',
          width: '480px',
          background: 'var(--rev-color-backgroundPrimary)',
          borderRadius: 'var(--rev-borderRadius-16, 16px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--rev-color-separatorTertiary)',
          }}
        >
          <Text size="body" weight="bold">{isEditing ? 'Edit fee' : 'New fee'}</Text>
        </div>
        <div style={{ padding: '24px' }}>
          <Stack itemsSpacing="16">
            <Stack itemsSpacing="8">
              <Text size="footnote" color="secondary" weight="medium">Fee name</Text>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Environmental fee"
                style={INPUT_STYLE}
              />
              <Text size="caption" color="tertiary">
                This name appears on your VDP, at checkout, and on the bill of sale.
              </Text>
            </Stack>
            <Stack itemsSpacing="8">
              <Text size="footnote" color="secondary" weight="medium">Description</Text>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this fee covers."
                rows={3}
                style={{ ...INPUT_STYLE, resize: 'vertical' }}
              />
            </Stack>
          </Stack>
        </div>
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--rev-color-separatorTertiary)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <Button variant="secondary" onPress={onClose}>Cancel</Button>
          <Button
            variant="filled"
            onPress={() => { if (name.trim()) onSave(name.trim(), description.trim()); }}
          >
            {isEditing ? 'Save' : 'Add fee'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main prototype
// ---------------------------------------------------------------------------
export function FeesPrototype() {
  const [fees, setFees] = useState<FeeConfig[]>(DEMO_FEES);
  const [shopRate, setShopRate] = useState(75);
  const [activeSection, setActiveSection] = useState('sale');
  const [feeModalState, setFeeModalState] = useState<
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; feeId: string }
    | { type: 'delete'; feeId: string }
  >({ type: 'closed' });
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Derive TOC: labor rate, all fees, add new
  const tocSections = [
    { id: 'labor-rate', label: 'Labor rate' },
    ...fees.map((f) => ({ id: f.id, label: f.tocLabel ?? f.label })),
    { id: 'add-new', label: 'Add new' },
  ];

  // Scroll-spy with IntersectionObserver (re-run when fees change)
  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id.replace('section-', '');
          setActiveSection(id);
        }
      },
      { root, rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [fees]);

  const handleAddFee = (name: string, description: string) => {
    const id = `custom_${Date.now()}`;
    const newFee: FeeConfig = {
      id,
      label: name,
      description,
      icon: 'receipt',
      enabled: true,
      model: 'flat',
      availableModels: ['flat'],
      ekhoFieldName: name,
      fallback: { amountModel: 'flat', amount: 0 },
      rules: [],
    };
    setFees((prev) => [...prev, newFee]);
    setFeeModalState({ type: 'closed' });
  };

  const handleEditFee = (feeId: string, name: string, description: string) => {
    setFees((prev) =>
      prev.map((f) =>
        f.id === feeId ? { ...f, label: name, description } : f
      )
    );
    setFeeModalState({ type: 'closed' });
  };

  const handleDeleteFee = (feeId: string) => {
    setFees((prev) => prev.filter((f) => f.id !== feeId));
  };

  const breadcrumbItems = [
    { id: 'settings', label: 'Settings' },
    { id: 'sales', label: 'Sales' },
    { id: 'fees', label: 'Fees' },
  ];

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--rev-fontFamily, Inter, system-ui, sans-serif)',
      }}
    >
      {/* Outer layout: product area + commentary sidebar */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
        }}
      >
        {/* Product area (own scrollbar): chrome + sections + TOC */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            background: 'var(--rev-color-backgroundPrimary)',
          }}
        >
          {/* Top chrome: breadcrumb + tabs */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ padding: '12px 32px 0 96px' }}>
              <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
                <Breadcrumbs items={breadcrumbItems} />
                <Dropdown
                  options={[
                    { id: 'apex', label: 'Apex' },
                    { id: 'dynamo', label: 'Dynamo' },
                  ]}
                  value="apex"
                  size="small"
                  buttonVariant="outline"
                />
              </Group>
            </div>
            <div style={{ padding: '0 32px 0 96px' }}>
              <Tabs
                items={[{ id: 'fees', content: 'Fees' }]}
                selectedKey="fees"
              />
              <div style={{ borderBottom: '1px solid var(--rev-color-separatorTertiary)' }} />
            </div>
          </div>

          {/* Scrollable content */}
          <div
            style={{
              display: 'flex',
              padding: '0 32px 0 96px',
            }}
          >
            {/* Main content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Shop labor rate */}
              <SettingsSection
                title="Labor rate"
                description="Dealer-wide hourly shop rate used to calculate labor-based fees."
              >
                <div
                  id="section-labor-rate"
                  ref={(el) => { sectionRefs.current['labor-rate'] = el; }}
                >
                  <Box padding="24" background="secondary" rounding="12">
                    <Stack itemsSpacing="12">
                      <Text size="bodySmall" weight="semibold">Hourly labor rate</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Text size="bodySmall" color="tertiary">$</Text>
                        <input
                          type="text"
                          value={shopRate}
                          onChange={(e) => {
                            const num = parseFloat(e.target.value);
                            if (!isNaN(num)) setShopRate(num);
                          }}
                          style={{ ...INPUT_STYLE, width: '100px' }}
                        />
                        <Text size="bodySmall" color="tertiary">/ hr</Text>
                      </div>
                      <Text size="caption" color="tertiary">
                        This rate applies to any fee using the hourly model. Individual fees calculate their total as hours x this rate.
                      </Text>
                    </Stack>
                  </Box>
                </div>
              </SettingsSection>

              {/* Fee sections (all editable + deletable) */}
              {fees.map((fee) => (
                <SettingsSection
                  key={fee.id}
                  title={fee.label}
                  description={fee.description}
                  onEdit={() => setFeeModalState({ type: 'edit', feeId: fee.id })}
                  onDelete={() => setFeeModalState({ type: 'delete', feeId: fee.id })}
                >
                  <FeeSection
                    fee={fee}
                    shopRate={shopRate}
                    sectionRef={(el) => { sectionRefs.current[fee.id] = el; }}
                  />
                </SettingsSection>
              ))}

              {/* Add fee button — matches SettingsSection two-column layout */}
              <div
                id="section-add-new"
                ref={(el) => { sectionRefs.current['add-new'] = el; }}
                style={{ paddingBlock: '24px', scrollMarginTop: '32px', display: 'flex', gap: '24px' }}
              >
                <div style={{ flex: '0 0 220px' }} />
                <button
                  onClick={() => setFeeModalState({ type: 'create' })}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    flex: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontFamily: 'var(--rev-fontFamily)',
                    fontWeight: 600,
                    color: 'var(--rev-color-textSecondary)',
                    padding: '16px 16px',
                    borderRadius: 'var(--rev-borderRadius-12)',
                    border: '1.5px dashed color-mix(in oklch, var(--rev-color-textPrimary) 15%, transparent)',
                    justifyContent: 'center',
                  }}
                >
                  + Add custom fee
                </button>
              </div>

              {/* Bottom spacer */}
              <div style={{ height: '48px' }} />
            </div>

            {/* TOC (right-aligned with separator line) */}
            <div style={{ position: 'sticky', top: '32px', paddingTop: '32px', paddingLeft: '32px', alignSelf: 'flex-start' }}>
              <TableOfContents activeId={activeSection} sections={tocSections} onSelect={setActiveSection} />
            </div>
          </div>
        </div>

        {/* Commentary sidebar (own scrollbar, clearly separate) */}
        <div
          style={{
            width: '420px',
            flexShrink: 0,
            overflowY: 'auto',
            borderLeft: '1px dashed var(--rev-color-separatorTertiary)',
            background: 'var(--rev-color-backgroundPrimary)',
            padding: '24px',
          }}
        >
          <Text
            size="footnote"
            weight="bold"
            color="tertiary"
            isUppercase
            style={{ letterSpacing: '0.05em', marginBottom: '12px' }}
          >
            Prototype notes
          </Text>
          <Stack itemsSpacing="12">
            {COMMENTARY.map((c) => (
              <CommentaryCard key={c.sectionId} title={c.title} notes={c.notes} />
            ))}
          </Stack>
        </div>
      </div>

      {/* Fee modal (create or edit) */}
      {feeModalState.type === 'create' && (
        <FeeModal
          onSave={handleAddFee}
          onClose={() => setFeeModalState({ type: 'closed' })}
        />
      )}
      {feeModalState.type === 'edit' && (() => {
        const editingFee = fees.find((f) => f.id === feeModalState.feeId);
        if (!editingFee) return null;
        return (
          <FeeModal
            initialName={editingFee.label}
            initialDescription={editingFee.description}
            onSave={(name, desc) => handleEditFee(editingFee.id, name, desc)}
            onClose={() => setFeeModalState({ type: 'closed' })}
          />
        );
      })()}
      {feeModalState.type === 'delete' && (() => {
        const deletingFee = fees.find((f) => f.id === feeModalState.feeId);
        if (!deletingFee) return null;
        const onClose = () => setFeeModalState({ type: 'closed' });
        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              onClick={onClose}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.4)' }}
            />
            <div
              style={{
                position: 'relative',
                width: '420px',
                background: 'var(--rev-color-backgroundPrimary)',
                borderRadius: 'var(--rev-borderRadius-16, 16px)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '24px 24px 0' }}>
                <Stack itemsSpacing="8">
                  <Text size="body" weight="bold">Remove {deletingFee.label}?</Text>
                  <Text size="bodySmall" color="secondary">
                    This will remove the fee and all its rules. This cannot be undone, but you can always set up a new fee later.
                  </Text>
                </Stack>
              </div>
              <div
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                }}
              >
                <Button variant="secondary" onPress={onClose}>Cancel</Button>
                <Button
                  variant="filled"
                  onPress={() => {
                    handleDeleteFee(deletingFee.id);
                    onClose();
                  }}
                >
                  Remove fee
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
