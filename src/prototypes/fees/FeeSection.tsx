import { Fragment, useEffect, useRef, useState } from 'react';
import { Stack, Text, Group, Switch, SegmentedControl, Divider, Dropdown, Box, Button } from '../../rev';
import type {
  FeeConfig,
  FeeRule,
  PricingSource,
  AmountModel,
  ConditionField,
  ConditionFilter,
  FallbackConfig,
  SteppedBracket,
} from './mock-data';
import {
  PRICING_SOURCE_LABELS,
  AMOUNT_MODEL_LABELS,
  CONDITION_FIELD_LABELS,
  CONDITION_FIELD_VALUES,
  CONDITION_FIELD_GROUPS,
  BRACKET_FIELD_UNITS,
  US_STATES,
  getRuleChips,
  getRuleSublabel,
} from './mock-data';

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------
function DragHandleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="6" cy="3.5" r="1.25" />
      <circle cx="10" cy="3.5" r="1.25" />
      <circle cx="6" cy="8" r="1.25" />
      <circle cx="10" cy="8" r="1.25" />
      <circle cx="6" cy="12.5" r="1.25" />
      <circle cx="10" cy="12.5" r="1.25" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function BinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Shared input style
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

// ---------------------------------------------------------------------------
// Modal backdrop + panel
// ---------------------------------------------------------------------------
function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
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
          width: '520px',
          maxHeight: '85vh',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text size="body" weight="bold">{title}</Text>
          <button
            onClick={onClose}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--rev-borderRadius-8)',
              color: 'var(--rev-color-textSecondary)',
            }}
          >
            <CloseIcon />
          </button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
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
          {footer}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Amount editor (shared between rule modal and fallback modal)
// ---------------------------------------------------------------------------
function AmountEditor({
  amountModel,
  amount,
  onModelChange,
  onAmountChange,
}: {
  amountModel: AmountModel;
  amount: number;
  onModelChange: (m: AmountModel) => void;
  onAmountChange: (n: number) => void;
}) {
  const modelOptions = (Object.keys(AMOUNT_MODEL_LABELS) as AmountModel[]).map((k) => ({
    id: k,
    label: AMOUNT_MODEL_LABELS[k],
  }));

  const isPercentage = amountModel !== 'flat';

  return (
    <Stack itemsSpacing="8">
      <Dropdown
        options={modelOptions}
        value={amountModel}
        onSelectionChange={(val) => onModelChange(val as AmountModel)}
        size="medium"
        buttonVariant="outline"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {!isPercentage && <Text size="body" weight="semibold" color="secondary">$</Text>}
        <input
          type="text"
          value={amount}
          onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) onAmountChange(num);
          }}
          style={{ ...INPUT_STYLE, width: '120px', fontSize: '16px', fontWeight: 600 }}
        />
        {isPercentage && <Text size="body" weight="semibold" color="secondary">%</Text>}
      </div>
      {isPercentage && (
        <Text size="caption" color="tertiary">
          {AMOUNT_MODEL_LABELS[amountModel].toLowerCase()}
        </Text>
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Bracket editor (generic, works for any bracket field)
// ---------------------------------------------------------------------------
function BracketEditor({
  brackets,
  onChange,
  unitLabel,
  isLabor,
  shopRate,
}: {
  brackets: SteppedBracket[];
  onChange: (brackets: SteppedBracket[]) => void;
  unitLabel: string;
  isLabor: boolean;
  shopRate: number;
}) {
  const handleUpdate = (index: number, field: keyof SteppedBracket, value: number | null) => {
    const updated = brackets.map((b, i) => (i === index ? { ...b, [field]: value } : b));
    if (field === 'to' && value !== null && index < updated.length - 1) {
      updated[index + 1] = { ...updated[index + 1], from: value };
    }
    onChange(updated);
  };

  const handleAdd = () => {
    const lastTo = brackets.length > 0 ? (brackets[brackets.length - 1].to ?? 0) : 0;
    onChange([...brackets, { from: lastTo, to: null, amount: 0 }]);
  };

  const handleRemove = (index: number) => {
    const updated = brackets.filter((_, i) => i !== index);
    for (let i = 1; i < updated.length; i++) {
      updated[i] = { ...updated[i], from: updated[i - 1].to ?? 0 };
    }
    if (updated.length > 0) updated[0] = { ...updated[0], from: 0 };
    onChange(updated);
  };

  const COMPACT_INPUT: React.CSSProperties = {
    ...INPUT_STYLE,
    width: '64px',
    padding: '6px 8px',
    textAlign: 'center' as const,
  };

  return (
    <Stack itemsSpacing="12">
      <Text size="footnote" color="secondary" weight="medium">
        {isLabor ? 'Hours by tier' : 'Fee by tier'}
      </Text>
      {brackets.map((bracket, i) => {
        const isLast = i === brackets.length - 1;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'var(--rev-color-backgroundSecondary)',
              borderRadius: 'var(--rev-borderRadius-10)',
              flexWrap: 'nowrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
              <input
                type="text"
                value={bracket.from}
                style={{ ...COMPACT_INPUT, width: '48px', background: 'transparent', border: 'none', color: 'var(--rev-color-textSecondary)' }}
                readOnly
              />
              <Text size="caption" color="tertiary">{isLast ? '+' : 'to'}</Text>
              {!isLast && (
                <input
                  type="text"
                  value={bracket.to ?? ''}
                  onChange={(e) => {
                    const num = parseFloat(e.target.value);
                    if (!isNaN(num)) handleUpdate(i, 'to', num);
                  }}
                  style={COMPACT_INPUT}
                />
              )}
              <Text size="caption" color="tertiary">{unitLabel}</Text>
            </div>
            <div style={{ flex: 1 }} />
            {isLabor ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <input
                  type="text"
                  value={bracket.amount}
                  onChange={(e) => {
                    const num = parseFloat(e.target.value);
                    if (!isNaN(num)) handleUpdate(i, 'amount', num);
                  }}
                  style={{ ...COMPACT_INPUT, fontWeight: 600 }}
                />
                <Text size="caption" color="tertiary">hrs</Text>
                <Text size="caption" color="tertiary">
                  = ${(bracket.amount * shopRate).toFixed(0)}
                </Text>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <Text size="caption" color="tertiary">$</Text>
                <input
                  type="text"
                  value={bracket.amount}
                  onChange={(e) => {
                    const num = parseFloat(e.target.value);
                    if (!isNaN(num)) handleUpdate(i, 'amount', num);
                  }}
                  style={{ ...COMPACT_INPUT, fontWeight: 600 }}
                />
              </div>
            )}
            <button
              onClick={() => handleRemove(i)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: 'var(--rev-borderRadius-8)',
                color: 'var(--rev-color-textTertiary)',
              }}
            >
              <CloseIcon />
            </button>
          </div>
        );
      })}
      <button
        onClick={handleAdd}
        style={{
          all: 'unset',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'var(--rev-fontFamily)',
          fontWeight: 600,
          color: 'var(--rev-color-textSecondary)',
          padding: '8px 0',
        }}
      >
        + Add tier
      </button>
      {isLabor && (
        <Text size="caption" color="tertiary">
          Hours multiplied by ${shopRate}/hr shop labor rate
        </Text>
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Grouped filter picker (replaces flat Dropdown for "+ Add a filter")
// ---------------------------------------------------------------------------
function GroupedFilterPicker({
  availableFields,
  onSelect,
}: {
  availableFields: Set<ConditionField>;
  onSelect: (field: ConditionField) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const groups = CONDITION_FIELD_GROUPS
    .map((g) => ({
      ...g,
      fields: g.fields.filter((f) => availableFields.has(f)),
    }))
    .filter((g) => g.fields.length > 0);

  if (groups.length === 0) return null;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 12px',
          borderRadius: 'var(--rev-borderRadius-10)',
          border: '1px solid var(--rev-color-separatorTertiary)',
          fontSize: '13px',
          fontFamily: 'var(--rev-fontFamily)',
          fontWeight: 500,
          color: 'var(--rev-color-textSecondary)',
          background: '#fff',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        + Add a filter
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'var(--rev-color-backgroundPrimary)',
            borderRadius: 'var(--rev-borderRadius-12, 12px)',
            border: '1px solid var(--rev-color-separatorTertiary)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: '6px 0',
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          {groups.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && (
                <div style={{ height: '1px', background: 'var(--rev-color-separatorTertiary)', margin: '4px 0' }} />
              )}
              <div
                style={{
                  padding: '6px 12px 2px',
                  fontSize: '10px',
                  fontWeight: 600,
                  fontFamily: 'var(--rev-fontFamily)',
                  color: 'var(--rev-color-textTertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {group.label}
              </div>
              {group.fields.map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    onSelect(field);
                    setOpen(false);
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'block',
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '7px 12px 7px 20px',
                    fontSize: '13px',
                    fontFamily: 'var(--rev-fontFamily)',
                    color: 'var(--rev-color-textPrimary)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--rev-color-backgroundSecondary)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {CONDITION_FIELD_LABELS[field]}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Conditions editor (Section 1 of the modal: "Applies when")
// ---------------------------------------------------------------------------
function ConditionsEditor({
  conditions,
  onChange,
  pricingSource,
  dmsFieldName,
  bracketField,
}: {
  conditions: ConditionFilter[];
  onChange: (conditions: ConditionFilter[]) => void;
  pricingSource: PricingSource;
  dmsFieldName?: string;
  bracketField?: string;
}) {
  const usedFields = new Set(conditions.map((c) => c.field));
  const availableFields = (Object.keys(CONDITION_FIELD_LABELS) as ConditionField[]).filter(
    (f) => !usedFields.has(f)
  );

  const handleAddCondition = (field: ConditionField) => {
    onChange([...conditions, { field, values: [] }]);
  };

  const handleRemoveCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const handleUpdateValues = (index: number, values: string[]) => {
    onChange(conditions.map((c, i) => (i === index ? { ...c, values } : c)));
  };

  // Implicit data conditions based on pricing source
  const implicitConditions: string[] = [];
  if (pricingSource === 'dms_field') {
    implicitConditions.push(dmsFieldName ? `Only when ${dmsFieldName} is available in your DMS` : 'Only when DMS data is available');
  }
  if (pricingSource === 'ekho_per_unit') {
    implicitConditions.push('Only when a per-vehicle value is set in Ekho');
  }
  if (pricingSource === 'stepped' && bracketField) {
    const fieldLabel = CONDITION_FIELD_LABELS[bracketField as ConditionField] ?? bracketField;
    implicitConditions.push(`Only when ${fieldLabel} data is available`);
  }

  return (
    <Stack itemsSpacing="12">
      {/* Section header */}
      <Stack itemsSpacing="2">
        <Text size="bodySmall" weight="semibold">Applies when</Text>
        <Text size="caption" color="tertiary">
          Every condition listed here must match for this rule to apply.
        </Text>
      </Stack>

      {/* Explicit conditions */}
      {conditions.length === 0 && implicitConditions.length === 0 && (
        <Text size="bodySmall" color="tertiary" style={{ fontStyle: 'italic' }}>
          No conditions set. This rule applies to all vehicles.
        </Text>
      )}

      {conditions.map((cond, i) => {
        const valueOptions = CONDITION_FIELD_VALUES[cond.field];
        const isStateField = cond.field === 'buyer_state';

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 12px',
              background: 'var(--rev-color-backgroundSecondary)',
              borderRadius: 'var(--rev-borderRadius-10)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <Stack itemsSpacing="6">
                <Text size="footnote" weight="medium" color="secondary">
                  {CONDITION_FIELD_LABELS[cond.field]}
                </Text>

                {/* Value selector */}
                {valueOptions ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {Object.entries(valueOptions).map(([val, label]) => {
                      const selected = cond.values.includes(val);
                      return (
                        <button
                          key={val}
                          onClick={() => {
                            const newValues = selected
                              ? cond.values.filter((v) => v !== val)
                              : [...cond.values, val];
                            handleUpdateValues(i, newValues);
                          }}
                          style={{
                            all: 'unset',
                            cursor: 'pointer',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 500,
                            fontFamily: 'var(--rev-fontFamily)',
                            background: selected
                              ? 'var(--rev-color-carbonGray)'
                              : 'var(--rev-color-backgroundPrimary)',
                            color: selected ? '#fff' : 'var(--rev-color-textSecondary)',
                            border: selected
                              ? '1px solid var(--rev-color-carbonGray)'
                              : '1px solid var(--rev-color-separatorTertiary)',
                            transition: 'all 150ms ease',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : isStateField ? (
                  <Stack itemsSpacing="6">
                    <Dropdown
                      key={`state-${cond.values.length}`}
                      options={US_STATES.filter((s) => !cond.values.includes(s.id))}
                      placeholder="Add a state..."
                      onSelectionChange={(val) => {
                        if (val && !cond.values.includes(val)) {
                          handleUpdateValues(i, [...cond.values, val]);
                        }
                      }}
                      size="medium"
                      buttonVariant="outline"
                    />
                    {cond.values.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {cond.values.map((s) => (
                          <span
                            key={s}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '999px',
                              background: 'var(--rev-color-backgroundPrimary)',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: 'var(--rev-color-textPrimary)',
                            }}
                          >
                            {s}
                            <button
                              onClick={() => handleUpdateValues(i, cond.values.filter((x) => x !== s))}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                fontSize: '13px',
                                lineHeight: 1,
                                color: 'var(--rev-color-textTertiary)',
                              }}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </Stack>
                ) : (
                  <Text size="caption" color="tertiary">
                    Value picker not yet implemented for this field
                  </Text>
                )}
              </Stack>
            </div>
            <button
              onClick={() => handleRemoveCondition(i)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: 'var(--rev-borderRadius-8)',
                color: 'var(--rev-color-textTertiary)',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              <CloseIcon />
            </button>
          </div>
        );
      })}

      {/* Implicit data conditions */}
      {implicitConditions.map((text, i) => (
        <div
          key={`implicit-${i}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'var(--rev-color-backgroundSecondary)',
            borderRadius: 'var(--rev-borderRadius-10)',
            border: '1px dashed var(--rev-color-separatorTertiary)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              fontFamily: 'var(--rev-fontFamily)',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'color-mix(in oklch, var(--rev-color-textTertiary) 15%, transparent)',
              color: 'var(--rev-color-textTertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            data required
          </span>
          <Text size="bodySmall" color="tertiary">{text}</Text>
        </div>
      ))}

      {/* Add condition button -- grouped picker with Vehicle / Order sections */}
      <GroupedFilterPicker
        availableFields={new Set(availableFields)}
        onSelect={handleAddCondition}
      />
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Pricing source editor (Section 2 of the modal: "Fee calculation")
// ---------------------------------------------------------------------------
function PricingSourceEditor({
  pricingSource,
  onSourceChange,
  ekhoFieldName,
  shopRate,
  // DMS
  dmsFieldName,
  onDmsFieldNameChange,
  dmsIsLabor,
  onDmsIsLaborChange,
  // Ekho
  ekhoIsLabor,
  onEkhoIsLaborChange,
  // Fixed
  amountModel,
  amount,
  onAmountModelChange,
  onAmountChange,
  // Labor hours
  hours,
  onHoursChange,
  // Stepped
  brackets,
  onBracketsChange,
  bracketField,
  onBracketFieldChange,
  bracketIsLabor,
  onBracketIsLaborChange,
  // Markup
  markupType,
  onMarkupTypeChange,
  markupAmount,
  onMarkupAmountChange,
}: {
  pricingSource: PricingSource;
  onSourceChange: (s: PricingSource) => void;
  ekhoFieldName: string;
  shopRate: number;
  dmsFieldName: string;
  onDmsFieldNameChange: (v: string) => void;
  dmsIsLabor: boolean;
  onDmsIsLaborChange: (v: boolean) => void;
  ekhoIsLabor: boolean;
  onEkhoIsLaborChange: (v: boolean) => void;
  amountModel: AmountModel;
  amount: number;
  onAmountModelChange: (m: AmountModel) => void;
  onAmountChange: (n: number) => void;
  hours: number;
  onHoursChange: (n: number) => void;
  brackets: SteppedBracket[];
  onBracketsChange: (b: SteppedBracket[]) => void;
  bracketField: string;
  onBracketFieldChange: (f: string) => void;
  bracketIsLabor: boolean;
  onBracketIsLaborChange: (v: boolean) => void;
  markupType: 'flat' | 'percentage';
  onMarkupTypeChange: (t: 'flat' | 'percentage') => void;
  markupAmount: number;
  onMarkupAmountChange: (n: number) => void;
}) {
  const sourceOptions = (Object.keys(PRICING_SOURCE_LABELS) as PricingSource[]).map((k) => ({
    id: k,
    label: PRICING_SOURCE_LABELS[k],
  }));

  const bracketFieldOptions = [
    { id: 'cc', label: 'Engine size (CC)' },
    { id: 'inventory_age', label: 'Days in stock' },
    { id: 'delivery_distance', label: 'Delivery distance' },
  ];

  return (
    <Stack itemsSpacing="12">
      <Stack itemsSpacing="2">
        <Text size="bodySmall" weight="semibold">How it's calculated</Text>
        <Text size="caption" color="tertiary">
          How the fee amount is determined when this rule matches.
        </Text>
      </Stack>

      <Dropdown
        options={sourceOptions}
        value={pricingSource}
        onSelectionChange={(val) => onSourceChange(val as PricingSource)}
        size="medium"
        buttonVariant="outline"
      />

      {/* Source-specific config */}
      {pricingSource === 'dms_field' && (
        <Box padding="16" background="secondary" rounding="12">
          <Stack itemsSpacing="12">
            <Stack itemsSpacing="8">
              <Text size="footnote" color="secondary" weight="medium">Field name in your DMS</Text>
              <input
                type="text"
                value={dmsFieldName}
                onChange={(e) => onDmsFieldNameChange(e.target.value)}
                placeholder="e.g., doc_fee, setup_hrs"
                style={INPUT_STYLE}
              />
            </Stack>
            <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
              <Stack itemsSpacing="2">
                <Text size="caption" weight="medium">This field contains labor hours</Text>
                <Text size="caption" color="tertiary">
                  The value will be multiplied by your ${shopRate}/hr shop rate
                </Text>
              </Stack>
              <Switch isSelected={dmsIsLabor} onChange={onDmsIsLaborChange} />
            </Group>
            <Text size="caption" color="tertiary">
              If this field is blank or missing for a vehicle, this rule is skipped and the next one is checked.
            </Text>
          </Stack>
        </Box>
      )}

      {pricingSource === 'ekho_per_unit' && (
        <Box padding="16" background="secondary" rounding="12">
          <Stack itemsSpacing="12">
            <Stack itemsSpacing="8">
              <Text size="footnote" color="secondary" weight="medium">Inventory field</Text>
              <div
                style={{
                  ...INPUT_STYLE,
                  background: 'var(--rev-color-backgroundSecondary)',
                  color: 'var(--rev-color-textSecondary)',
                  cursor: 'default',
                }}
              >
                {ekhoFieldName}
              </div>
            </Stack>
            <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
              <Stack itemsSpacing="2">
                <Text size="caption" weight="medium">This field contains labor hours</Text>
                <Text size="caption" color="tertiary">
                  The value will be multiplied by your ${shopRate}/hr shop rate
                </Text>
              </Stack>
              <Switch isSelected={ekhoIsLabor} onChange={onEkhoIsLaborChange} />
            </Group>
            <Text size="caption" color="tertiary">
              Set individually on each vehicle in Ekho. Skipped if not set.
            </Text>
          </Stack>
        </Box>
      )}

      {pricingSource === 'fixed' && (
        <Box padding="16" background="secondary" rounding="12">
          <Stack itemsSpacing="8">
            <Text size="footnote" color="secondary" weight="medium">Fee amount</Text>
            <AmountEditor
              amountModel={amountModel}
              amount={amount}
              onModelChange={onAmountModelChange}
              onAmountChange={onAmountChange}
            />
          </Stack>
        </Box>
      )}

      {pricingSource === 'labor_hours' && (
        <Box padding="16" background="secondary" rounding="12">
          <Stack itemsSpacing="8">
            <Text size="footnote" color="secondary" weight="medium">Labor hours</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                value={hours}
                onChange={(e) => {
                  const num = parseFloat(e.target.value);
                  if (!isNaN(num)) onHoursChange(num);
                }}
                style={{ ...INPUT_STYLE, width: '80px', fontSize: '16px', fontWeight: 600 }}
              />
              <Text size="body" weight="semibold" color="secondary">hrs</Text>
            </div>
            <Text size="caption" color="tertiary">
              {hours} hrs x ${shopRate}/hr = <strong>${(hours * shopRate).toFixed(2)}</strong>
            </Text>
          </Stack>
        </Box>
      )}

      {pricingSource === 'stepped' && (
        <Box padding="16" background="secondary" rounding="12">
          <Stack itemsSpacing="12">
            <Stack itemsSpacing="8">
              <Text size="footnote" color="secondary" weight="medium">Price varies by</Text>
              <Dropdown
                options={bracketFieldOptions}
                value={bracketField}
                onSelectionChange={(val) => onBracketFieldChange(val)}
                size="medium"
                buttonVariant="outline"
              />
            </Stack>
            <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
              <Text size="caption" weight="medium">Tier amounts are labor hours</Text>
              <Switch isSelected={bracketIsLabor} onChange={onBracketIsLaborChange} />
            </Group>
            <BracketEditor
              brackets={brackets}
              onChange={onBracketsChange}
              unitLabel={BRACKET_FIELD_UNITS[bracketField] ?? ''}
              isLabor={bracketIsLabor}
              shopRate={shopRate}
            />
          </Stack>
        </Box>
      )}

      {pricingSource === 'markup' && (
        <Box padding="16" background="secondary" rounding="12">
          <Stack itemsSpacing="12">
            <Stack itemsSpacing="8">
              <Text size="footnote" color="secondary" weight="medium">Markup type</Text>
              <SegmentedControl
                size="small"
                items={[
                  { value: 'flat', label: 'Flat $' },
                  { value: 'percentage', label: '% of cost' },
                ]}
                value={markupType}
                onChange={(val) => onMarkupTypeChange(val as 'flat' | 'percentage')}
              />
            </Stack>
            <Stack itemsSpacing="8">
              <Text size="footnote" color="secondary" weight="medium">
                {markupType === 'flat' ? 'Flat markup amount' : 'Markup percentage'}
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {markupType === 'flat' && <Text size="body" weight="semibold" color="secondary">$</Text>}
                <input
                  type="text"
                  value={markupAmount}
                  onChange={(e) => {
                    const num = parseFloat(e.target.value);
                    if (!isNaN(num)) onMarkupAmountChange(num);
                  }}
                  style={{ ...INPUT_STYLE, width: '120px', fontSize: '16px', fontWeight: 600 }}
                />
                {markupType === 'percentage' && <Text size="body" weight="semibold" color="secondary">%</Text>}
              </div>
            </Stack>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Rule modal (V2: split into Conditions + Pricing Source)
// ---------------------------------------------------------------------------
function RuleModal({
  rule,
  ekhoFieldName,
  shopRate,
  onSave,
  onClose,
}: {
  rule: Partial<FeeRule> | null;
  ekhoFieldName: string;
  shopRate: number;
  onSave: (rule: FeeRule) => void;
  onClose: () => void;
}) {
  const isEditing = rule?.id != null;

  // Conditions state
  const [conditions, setConditions] = useState<ConditionFilter[]>(rule?.conditions ?? []);

  // Pricing source state
  const [pricingSource, setPricingSource] = useState<PricingSource>(rule?.pricingSource ?? 'fixed');

  // DMS
  const [dmsFieldName, setDmsFieldName] = useState(rule?.dmsFieldName ?? '');
  const [dmsIsLabor, setDmsIsLabor] = useState(rule?.dmsIsLabor ?? false);

  // Ekho
  const [ekhoIsLabor, setEkhoIsLabor] = useState(rule?.ekhoIsLabor ?? false);

  // Fixed
  const [amountModel, setAmountModel] = useState<AmountModel>(rule?.amountModel ?? 'flat');
  const [amount, setAmount] = useState(rule?.amount ?? 0);

  // Labor hours
  const [hours, setHours] = useState(rule?.hours ?? 0);

  // Stepped
  const [brackets, setBrackets] = useState<SteppedBracket[]>(
    rule?.brackets ?? [{ from: 0, to: 25, amount: 0 }, { from: 25, to: 50, amount: 199 }, { from: 50, to: null, amount: 349 }]
  );
  const [bracketField, setBracketField] = useState(rule?.bracketField ?? 'delivery_distance');
  const [bracketIsLabor, setBracketIsLabor] = useState(rule?.bracketIsLabor ?? false);

  // Markup
  const [markupType, setMarkupType] = useState<'flat' | 'percentage'>(rule?.markupType ?? 'percentage');
  const [markupAmount, setMarkupAmount] = useState(rule?.amount ?? 0);

  const handleSave = () => {
    const newRule: FeeRule = {
      id: rule?.id ?? `r_${Date.now()}`,
      conditions,
      pricingSource,
    };

    switch (pricingSource) {
      case 'dms_field':
        newRule.dmsFieldName = dmsFieldName;
        if (dmsIsLabor) newRule.dmsIsLabor = true;
        break;
      case 'ekho_per_unit':
        newRule.ekhoFieldName = ekhoFieldName;
        if (ekhoIsLabor) newRule.ekhoIsLabor = true;
        break;
      case 'fixed':
        newRule.amountModel = amountModel;
        newRule.amount = amount;
        break;
      case 'labor_hours':
        newRule.hours = hours;
        break;
      case 'stepped':
        newRule.brackets = brackets;
        newRule.bracketField = bracketField;
        if (bracketIsLabor) newRule.bracketIsLabor = true;
        break;
      case 'markup':
        newRule.markupType = markupType;
        newRule.amount = markupAmount;
        break;
    }

    onSave(newRule);
  };

  return (
    <Modal
      title={isEditing ? 'Edit rule' : 'Add rule'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onPress={onClose}>Cancel</Button>
          <Button variant="filled" onPress={handleSave}>
            {isEditing ? 'Save' : 'Add rule'}
          </Button>
        </>
      }
    >
      <Stack itemsSpacing="24">
        {/* Section 1: Conditions */}
        <ConditionsEditor
          conditions={conditions}
          onChange={setConditions}
          pricingSource={pricingSource}
          dmsFieldName={dmsFieldName}
          bracketField={bracketField}
        />

        <Divider />

        {/* Section 2: Fee Calculation */}
        <PricingSourceEditor
          pricingSource={pricingSource}
          onSourceChange={setPricingSource}
          ekhoFieldName={ekhoFieldName}
          shopRate={shopRate}
          dmsFieldName={dmsFieldName}
          onDmsFieldNameChange={setDmsFieldName}
          dmsIsLabor={dmsIsLabor}
          onDmsIsLaborChange={setDmsIsLabor}
          ekhoIsLabor={ekhoIsLabor}
          onEkhoIsLaborChange={setEkhoIsLabor}
          amountModel={amountModel}
          amount={amount}
          onAmountModelChange={setAmountModel}
          onAmountChange={setAmount}
          hours={hours}
          onHoursChange={setHours}
          brackets={brackets}
          onBracketsChange={setBrackets}
          bracketField={bracketField}
          onBracketFieldChange={setBracketField}
          bracketIsLabor={bracketIsLabor}
          onBracketIsLaborChange={setBracketIsLabor}
          markupType={markupType}
          onMarkupTypeChange={setMarkupType}
          markupAmount={markupAmount}
          onMarkupAmountChange={setMarkupAmount}
        />
      </Stack>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Fallback modal (unchanged from V1)
// ---------------------------------------------------------------------------
function FallbackModal({
  fallback,
  shopRate,
  onSave,
  onClose,
}: {
  fallback: FallbackConfig;
  shopRate: number;
  onSave: (f: FallbackConfig) => void;
  onClose: () => void;
}) {
  const [isLabor, setIsLabor] = useState(fallback.isLabor ?? false);
  const [amountModel, setAmountModel] = useState<AmountModel>(fallback.amountModel);
  const [amount, setAmount] = useState(fallback.amount);
  const [hours, setHours] = useState(fallback.hours ?? 0);

  const handleSave = () => {
    const fb: FallbackConfig = { amountModel, amount };
    if (isLabor) {
      fb.isLabor = true;
      fb.hours = hours;
    }
    onSave(fb);
  };

  return (
    <Modal
      title="Edit fallback"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onPress={onClose}>Cancel</Button>
          <Button variant="filled" onPress={handleSave}>Save</Button>
        </>
      }
    >
      <Stack itemsSpacing="20">
        <Text size="bodySmall" color="secondary">
          The fallback applies when no rule in the priority list matches.
        </Text>

        <Box padding="16" background="secondary" rounding="10">
          <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
            <Stack itemsSpacing="2">
              <Text size="bodySmall" weight="semibold">Labor hours</Text>
              <Text size="caption" color="tertiary">
                Use labor hours instead of a fixed amount
              </Text>
            </Stack>
            <Switch isSelected={isLabor} onChange={setIsLabor} />
          </Group>
        </Box>

        {isLabor ? (
          <Box padding="16" background="secondary" rounding="12">
            <Stack itemsSpacing="8">
              <Text size="bodySmall" weight="semibold">Labor hours</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => {
                    const num = parseFloat(e.target.value);
                    if (!isNaN(num)) setHours(num);
                  }}
                  style={{ ...INPUT_STYLE, width: '80px', fontSize: '16px', fontWeight: 600 }}
                />
                <Text size="body" weight="semibold" color="secondary">hrs</Text>
              </div>
              <Text size="caption" color="tertiary">
                {hours} hrs x ${shopRate}/hr = <strong>${(hours * shopRate).toFixed(2)}</strong>
              </Text>
            </Stack>
          </Box>
        ) : (
          <AmountEditor
            amountModel={amountModel}
            amount={amount}
            onModelChange={setAmountModel}
            onAmountChange={setAmount}
          />
        )}
      </Stack>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Condition chips (displayed on rule rows in the priority list)
// ---------------------------------------------------------------------------
function ConditionChips({ chips }: { chips: { label: string; implicit: boolean }[] }) {
  if (chips.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '2px' }}>
      {chips.map((chip, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 500,
            fontFamily: 'var(--rev-fontFamily)',
            lineHeight: '16px',
            ...(chip.implicit
              ? {
                  background: 'transparent',
                  color: 'var(--rev-color-textTertiary)',
                  border: '1px dashed color-mix(in oklch, var(--rev-color-textTertiary) 40%, transparent)',
                }
              : {
                  background: 'color-mix(in oklch, var(--rev-color-textPrimary) 8%, transparent)',
                  color: 'var(--rev-color-textPrimary)',
                  border: '1px solid transparent',
                }),
          }}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Priority list (numbered column + bordered items, drag-to-reorder)
// ---------------------------------------------------------------------------
function PriorityList({
  items,
  onEdit,
  onDelete,
  onEditFallback,
  onReorder,
}: {
  items: { chips: { label: string; implicit: boolean }[]; sublabel?: string; isFallback?: boolean; ruleId?: string }[];
  onEdit: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
  onEditFallback: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const ruleCount = items.filter((it) => !it.isFallback).length;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
    setTimeout(() => {
      dragNodeRef.current?.style.setProperty('opacity', '0.4');
    }, 0);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.removeProperty('opacity');
    }
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    if (index < ruleCount) {
      setOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && index < ruleCount && dragIndex !== index) {
      onReorder(dragIndex, index);
    }
    if (dragNodeRef.current) {
      dragNodeRef.current.style.removeProperty('opacity');
    }
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current = null;
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '24px 1fr',
        gap: '0 8px',
      }}
    >
      {items.map((item, i) => {
        const isDragging = dragIndex === i;
        const isDropTarget = overIndex === i && dragIndex !== null && !isDragging;

        return (
          <Fragment key={item.ruleId ?? 'fallback'}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text size="bodySmall" weight="semibold" color="secondary">{i + 1}</Text>
            </div>

            <div
              draggable={!item.isFallback}
              onDragStart={(e) => !item.isFallback && handleDragStart(e, i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              style={(() => {
                const bdr = '1px solid color-mix(in oklch, var(--rev-color-textPrimary) 10%, transparent)';
                const isFirst = i === 0;
                const isLast = i === items.length - 1;
                return {
                  background: isDropTarget
                    ? 'color-mix(in oklch, var(--rev-color-textPrimary) 4%, var(--rev-color-backgroundPrimary))'
                    : 'var(--rev-color-backgroundPrimary)',
                  padding: '12px',
                  borderLeft: bdr,
                  borderRight: bdr,
                  borderTop: isFirst ? bdr : (isDropTarget ? '2px solid var(--rev-color-textPrimary)' : 'none'),
                  borderBottom: isLast ? bdr : bdr,
                  ...(isFirst ? { borderTopLeftRadius: '12px', borderTopRightRadius: '12px' } : {}),
                  ...(isLast ? { borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' } : {}),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 150ms ease',
                  opacity: isDragging ? 0.4 : 1,
                };
              })()}
            >
              {item.isFallback ? (
                <div style={{ width: '24px', height: '24px' }} />
              ) : (
                <span
                  style={{
                    cursor: 'grab',
                    padding: '4px',
                    color: 'var(--rev-color-textSecondary)',
                    display: 'flex',
                    alignItems: 'center',
                    userSelect: 'none',
                  }}
                >
                  <DragHandleIcon />
                </span>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                {item.isFallback ? (
                  <Text size="bodySmall">Fallback</Text>
                ) : (
                  <ConditionChips chips={item.chips} />
                )}
                {item.sublabel && (
                  <Text size="footnote" color="secondary">{item.sublabel}</Text>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => {
                    if (item.isFallback) onEditFallback();
                    else if (item.ruleId) onEdit(item.ruleId);
                  }}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--rev-borderRadius-8)',
                    color: 'var(--rev-color-textSecondary)',
                    transition: 'background 150ms ease',
                  }}
                >
                  <PencilIcon />
                </button>
                {!item.isFallback && (
                  <button
                    onClick={() => item.ruleId && onDelete(item.ruleId)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--rev-borderRadius-8)',
                      color: 'var(--rev-color-textSecondary)',
                      transition: 'background 150ms ease',
                    }}
                  >
                    <BinIcon />
                  </button>
                )}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fallback sublabel helper
// ---------------------------------------------------------------------------
function getFallbackSublabel(fb: FallbackConfig, shopRate: number): string {
  if (fb.isLabor && fb.hours != null) {
    return `${fb.hours} hrs x $${shopRate}/hr = $${(fb.hours * shopRate).toFixed(0)}`;
  }
  if (fb.amountModel === 'flat') return `$${fb.amount} flat fee`;
  return `${fb.amount}% ${AMOUNT_MODEL_LABELS[fb.amountModel].replace('% ', '').toLowerCase()}`;
}

// ---------------------------------------------------------------------------
// Main FeeSection component
// ---------------------------------------------------------------------------
export function FeeSection({
  fee: initialFee,
  sectionRef,
  shopRate = 75,
}: {
  fee: FeeConfig;
  sectionRef?: React.Ref<HTMLDivElement>;
  shopRate?: number;
}) {
  const [fee, setFee] = useState(initialFee);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initialFee));
  const [modalState, setModalState] = useState<
    | { type: 'closed' }
    | { type: 'add_rule' }
    | { type: 'edit_rule'; ruleId: string }
    | { type: 'edit_fallback' }
  >({ type: 'closed' });

  const isDirty = JSON.stringify(fee) !== savedSnapshot;

  const handleSave = () => {
    setSavedSnapshot(JSON.stringify(fee));
  };

  const handleClear = () => {
    setFee(JSON.parse(savedSnapshot));
  };

  const updateFee = (partial: Partial<FeeConfig>) => {
    setFee((prev) => ({ ...prev, ...partial }));
  };

  // Build rules list items with chips
  const priorityItems: { chips: { label: string; implicit: boolean }[]; sublabel?: string; isFallback?: boolean; ruleId?: string }[] = [];

  fee.rules.forEach((rule) => {
    const chips = getRuleChips(rule);
    priorityItems.push({
      chips: chips.length > 0 ? chips : [{ label: 'All vehicles', implicit: false }],
      sublabel: getRuleSublabel(rule, shopRate),
      ruleId: rule.id,
    });
  });

  priorityItems.push({
    chips: [],
    sublabel: getFallbackSublabel(fee.fallback, shopRate),
    isFallback: true,
  });

  // Modal handlers
  const handleSaveRule = (rule: FeeRule) => {
    setFee((prev) => {
      const existingIdx = prev.rules.findIndex((r) => r.id === rule.id);
      if (existingIdx >= 0) {
        const updated = [...prev.rules];
        updated[existingIdx] = rule;
        return { ...prev, rules: updated };
      }
      return { ...prev, rules: [...prev.rules, rule] };
    });
    setModalState({ type: 'closed' });
  };

  const handleDeleteRule = (ruleId: string) => {
    setFee((prev) => ({
      ...prev,
      rules: prev.rules.filter((r) => r.id !== ruleId),
    }));
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setFee((prev) => {
      const updated = [...prev.rules];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { ...prev, rules: updated };
    });
  };

  const handleSaveFallback = (fb: FallbackConfig) => {
    updateFee({ fallback: fb });
    setModalState({ type: 'closed' });
  };

  const editingRule =
    modalState.type === 'edit_rule'
      ? fee.rules.find((r) => r.id === modalState.ruleId) ?? null
      : null;

  return (
    <div ref={sectionRef} id={`section-${fee.id}`}>
      <Box padding="24" background="secondary" rounding="12">
        <div style={{ opacity: fee.enabled ? 1 : 0.45, pointerEvents: fee.enabled ? 'auto' : 'none', transition: 'opacity 200ms ease' }}>
        <Stack itemsSpacing="16">
          <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
            <Text size="bodySmall" weight="semibold">{fee.label}</Text>
            <div style={{ pointerEvents: 'auto' }}>
              <Switch
                isSelected={fee.enabled}
                onChange={(val) => updateFee({ enabled: val })}
              />
            </div>
          </Group>

          <Divider />

          <Stack itemsSpacing="8">
            <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
              <Text size="bodySmall" weight="semibold">Rules</Text>
              <button
                onClick={() => setModalState({ type: 'add_rule' })}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'var(--rev-fontFamily)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: 'var(--rev-borderRadius-full)',
                  background: 'var(--rev-color-carbonGray)',
                  color: 'white',
                }}
              >
                Add rule
              </button>
            </Group>
            <Text size="bodySmall" color="secondary">
              Checked top to bottom. First match is used. Drag to reorder.
            </Text>
            <PriorityList
              items={priorityItems}
              onEdit={(ruleId) => setModalState({ type: 'edit_rule', ruleId })}
              onDelete={handleDeleteRule}
              onEditFallback={() => setModalState({ type: 'edit_fallback' })}
              onReorder={handleReorder}
            />
          </Stack>

          {isDirty && (
            <>
              <Divider />
              <Group itemsAlignX="end" itemsSpacing="8" noWrap>
                <Button variant="secondary" size="small" onPress={handleClear}>Clear</Button>
                <Button variant="filled" size="small" onPress={handleSave}>Save</Button>
              </Group>
            </>
          )}
        </Stack>
        </div>
      </Box>

      {(modalState.type === 'add_rule' || modalState.type === 'edit_rule') && (
        <RuleModal
          rule={modalState.type === 'edit_rule' ? editingRule : null}
          ekhoFieldName={fee.ekhoFieldName}
          shopRate={shopRate}
          onSave={handleSaveRule}
          onClose={() => setModalState({ type: 'closed' })}
        />
      )}

      {modalState.type === 'edit_fallback' && (
        <FallbackModal
          fallback={fee.fallback}
          shopRate={shopRate}
          onSave={handleSaveFallback}
          onClose={() => setModalState({ type: 'closed' })}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment fee section (simpler, no rules/DMS)
// ---------------------------------------------------------------------------
export function PaymentFeeItem({
  config: initialConfig,
}: {
  config: { id: string; label: string; description: string; enabled: boolean; model: 'flat' | 'percentage'; amount: number };
}) {
  const [config, setConfig] = useState(initialConfig);

  return (
    <div
      style={{
        padding: '16px',
        background: 'var(--rev-color-backgroundPrimary)',
        borderRadius: 'var(--rev-borderRadius-10)',
        border: '1px solid color-mix(in oklch, var(--rev-color-textPrimary) 10%, transparent)',
        opacity: config.enabled ? 1 : 0.5,
        transition: 'all 200ms ease',
      }}
    >
      <Stack itemsSpacing="12">
        <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
          <Stack itemsSpacing="2">
            <Text size="bodySmall" weight="semibold">{config.label}</Text>
            <Text size="footnote" color="secondary">{config.description}</Text>
          </Stack>
          <Switch
            isSelected={config.enabled}
            onChange={(val) => setConfig((prev) => ({ ...prev, enabled: val }))}
          />
        </Group>

        {config.enabled && (
          <Group itemsSpacing="12" itemsAlignY="end" noWrap>
            <div style={{ width: '160px' }}>
              <SegmentedControl
                size="small"
                items={[
                  { value: 'flat', label: 'Flat' },
                  { value: 'percentage', label: '%' },
                ]}
                value={config.model}
                onChange={(val) =>
                  setConfig((prev) => ({ ...prev, model: val as 'flat' | 'percentage' }))
                }
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {config.model === 'flat' && (
                <Text size="bodySmall" color="tertiary">$</Text>
              )}
              <input
                type="text"
                value={config.amount}
                onChange={(e) => {
                  const num = parseFloat(e.target.value);
                  if (!isNaN(num)) setConfig((prev) => ({ ...prev, amount: num }));
                }}
                style={{
                  width: '80px',
                  fontFamily: 'var(--rev-fontFamily)',
                  fontSize: '13px',
                  lineHeight: '18px',
                  padding: '8px 12px',
                  borderRadius: 'var(--rev-borderRadius-10)',
                  border: '1px solid var(--rev-color-separatorTertiary)',
                  background: '#fff',
                  color: 'var(--rev-color-textPrimary)',
                  outline: 'none',
                }}
              />
              {config.model === 'percentage' && (
                <Text size="bodySmall" color="tertiary">%</Text>
              )}
            </div>
          </Group>
        )}
      </Stack>
    </div>
  );
}
