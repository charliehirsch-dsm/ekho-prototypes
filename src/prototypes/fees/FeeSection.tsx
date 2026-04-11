import { Fragment, useRef, useState } from 'react';
import { Stack, Text, Group, Switch, SegmentedControl, Divider, Dropdown, Box, Button } from '../../rev';
import type {
  FeeConfig,
  FeeModel,
  FeeRule,
  RuleType,
  AmountModel,
  InventoryAttribute,
  OrderAttribute,
  PaymentMethod,
  FallbackConfig,
  SteppedBracket,
} from './mock-data';
import {
  MODEL_LABELS,
  RULE_TYPE_LABELS,
  AMOUNT_MODEL_LABELS,
  INVENTORY_ATTRIBUTE_LABELS,
  INVENTORY_ATTRIBUTE_VALUES,
  BRACKETED_INVENTORY_ATTRIBUTES,
  INVENTORY_BRACKET_UNITS,
  ORDER_ATTRIBUTE_LABELS,
  US_STATES,
  PAYMENT_METHOD_LABELS,
  getRuleLabel,
  getRuleSublabel,
} from './mock-data';

// ---------------------------------------------------------------------------
// Inline SVG icons (matching production CTA pattern)
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
    <Box padding="16" background="secondary" rounding="12">
      <Stack itemsSpacing="8">
        <Text size="bodySmall" weight="semibold">Fee amount</Text>
        <Dropdown
          options={modelOptions}
          value={amountModel}
          onSelectionChange={(val) => onModelChange(val as AmountModel)}
          size="medium"
          buttonVariant="outline"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {!isPercentage && (
            <Text size="body" weight="semibold" color="secondary">$</Text>
          )}
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const num = parseFloat(e.target.value);
              if (!isNaN(num)) onAmountChange(num);
            }}
            style={{ ...INPUT_STYLE, width: '120px', fontSize: '16px', fontWeight: 600 }}
          />
          {isPercentage && (
            <Text size="body" weight="semibold" color="secondary">%</Text>
          )}
        </div>
        {isPercentage && (
          <Text size="caption" color="tertiary">
            {AMOUNT_MODEL_LABELS[amountModel].toLowerCase()}
          </Text>
        )}
      </Stack>
    </Box>
  );
}

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
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: 'relative',
          width: '480px',
          maxHeight: '80vh',
          background: 'var(--rev-color-backgroundPrimary)',
          borderRadius: 'var(--rev-borderRadius-16, 16px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
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
        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
        {/* Footer */}
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
// Rule modal
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Bracket editor for stepped delivery distance
// ---------------------------------------------------------------------------
function BracketEditor({
  brackets,
  onChange,
}: {
  brackets: SteppedBracket[];
  onChange: (brackets: SteppedBracket[]) => void;
}) {
  const handleUpdate = (index: number, field: keyof SteppedBracket, value: number | null) => {
    const updated = brackets.map((b, i) => (i === index ? { ...b, [field]: value } : b));
    // Auto-sync: next bracket's "from" = this bracket's "to"
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
    // Fix gaps: set next bracket's "from" to previous bracket's "to"
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
      <Text size="footnote" color="secondary" weight="medium">Distance brackets</Text>
      {brackets.map((bracket, i) => {
        const isLast = i === brackets.length - 1;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'var(--rev-color-backgroundSecondary)',
              borderRadius: 'var(--rev-borderRadius-10)',
            }}
          >
            <input
              type="text"
              value={bracket.from}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) handleUpdate(i, 'from', num);
              }}
              style={{ ...COMPACT_INPUT, background: 'var(--rev-color-backgroundSecondary)', border: 'none', color: 'var(--rev-color-textSecondary)' }}
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
            <Text size="caption" color="tertiary">mi</Text>
            <div style={{ flex: 1 }} />
            <Text size="caption" color="tertiary">$</Text>
            <input
              type="text"
              value={bracket.amount}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) handleUpdate(i, 'amount', num);
              }}
              style={COMPACT_INPUT}
            />
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
        + Add bracket
      </button>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Inventory bracket editor (for inventory_age, cc, etc.)
// ---------------------------------------------------------------------------
function InventoryBracketEditor({
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
    <Box padding="16" background="secondary" rounding="12">
      <Stack itemsSpacing="12">
        <Text size="footnote" color="secondary" weight="medium">
          {isLabor ? 'Labor hours by bracket' : 'Fee by bracket'}
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
                background: 'var(--rev-color-backgroundPrimary)',
                borderRadius: 'var(--rev-borderRadius-10)',
                flexWrap: 'nowrap',
              }}
            >
              {/* Range side */}
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
                <Text size="caption" color="tertiary">{unitLabel.trim()}</Text>
              </div>
              <div style={{ flex: 1 }} />
              {/* Value side */}
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
          + Add bracket
        </button>
        {isLabor && (
          <Text size="caption" color="tertiary">
            Hours multiplied by ${shopRate}/hr shop labor rate
          </Text>
        )}
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Delivery distance amount editor (with fee model + brackets)
// ---------------------------------------------------------------------------
function DeliveryDistanceAmountEditor({
  feeModel,
  amount,
  brackets,
  onModelChange,
  onAmountChange,
  onBracketsChange,
  markupType,
  onMarkupTypeChange,
}: {
  feeModel: FeeModel;
  amount: number;
  brackets: SteppedBracket[];
  onModelChange: (m: FeeModel) => void;
  onAmountChange: (n: number) => void;
  onBracketsChange: (b: SteppedBracket[]) => void;
  markupType: 'flat' | 'percentage';
  onMarkupTypeChange: (t: 'flat' | 'percentage') => void;
}) {
  const DELIVERY_MODELS: FeeModel[] = ['flat', 'per_mile', 'stepped', 'markup'];
  const modelOptions = DELIVERY_MODELS.map((m) => ({
    id: m,
    label: MODEL_LABELS[m],
  }));

  const isMarkupFlat = feeModel === 'markup' && markupType === 'flat';
  const isMarkupPct = feeModel === 'markup' && markupType === 'percentage';

  const amountLabel =
    feeModel === 'per_mile' ? 'Rate per mile' :
    isMarkupFlat ? 'Flat markup amount' :
    isMarkupPct ? 'Markup percentage' :
    'Amount';

  const prefix = isMarkupPct ? undefined : '$';
  const suffix = isMarkupPct ? '%' : feeModel === 'per_mile' ? '/mi' : undefined;

  return (
    <Stack itemsSpacing="16">
      <Stack itemsSpacing="8">
        <Text size="footnote" color="secondary" weight="medium">Fee model</Text>
        <Dropdown
          options={modelOptions}
          value={feeModel}
          onSelectionChange={(val) => onModelChange(val as FeeModel)}
          size="medium"
          buttonVariant="outline"
        />
      </Stack>
      {feeModel === 'stepped' ? (
        <BracketEditor brackets={brackets} onChange={onBracketsChange} />
      ) : feeModel === 'markup' ? (
        <Stack itemsSpacing="12">
          <Stack itemsSpacing="8">
            <Text size="footnote" color="secondary" weight="medium">Markup type</Text>
            <SegmentedControl
              size="small"
              items={[
                { value: 'flat', label: 'Flat' },
                { value: 'percentage', label: '%' },
              ]}
              value={markupType}
              onChange={(val) => onMarkupTypeChange(val as 'flat' | 'percentage')}
            />
          </Stack>
          <Stack itemsSpacing="8">
            <Text size="footnote" color="secondary" weight="medium">{amountLabel}</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {prefix && <Text size="bodySmall" color="tertiary">{prefix}</Text>}
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  const num = parseFloat(e.target.value);
                  if (!isNaN(num)) onAmountChange(num);
                }}
                style={{ ...INPUT_STYLE, width: '120px' }}
              />
              {suffix && <Text size="bodySmall" color="tertiary">{suffix}</Text>}
            </div>
          </Stack>
        </Stack>
      ) : (
        <Stack itemsSpacing="8">
          <Text size="footnote" color="secondary" weight="medium">{amountLabel}</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {prefix && <Text size="bodySmall" color="tertiary">{prefix}</Text>}
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) onAmountChange(num);
              }}
              style={{ ...INPUT_STYLE, width: '120px' }}
            />
            {suffix && <Text size="bodySmall" color="tertiary">{suffix}</Text>}
          </div>
        </Stack>
      )}
    </Stack>
  );
}

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

  const [isLabor, setIsLabor] = useState(rule?.isLabor ?? false);
  const [ruleType, setRuleType] = useState<RuleType>(rule?.type ?? 'dms');
  const [dmsFieldName, setDmsFieldName] = useState(rule?.dmsFieldName ?? '');
  const [inventoryAttribute, setInventoryAttribute] = useState<InventoryAttribute>(
    rule?.inventoryAttribute ?? 'vehicle_condition'
  );
  const [attributeValue, setAttributeValue] = useState<string>(rule?.attributeValue ?? '');
  const [orderAttribute, setOrderAttribute] = useState<OrderAttribute>(
    rule?.orderAttribute ?? 'delivery_distance'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    rule?.paymentMethod ?? 'card'
  );
  const [states, setStates] = useState<string[]>(rule?.states ?? []);
  const [feeModel, setFeeModel] = useState<FeeModel>(rule?.feeModel ?? 'flat');
  const [markupType, setMarkupType] = useState<'flat' | 'percentage'>(rule?.markupType ?? 'percentage');
  const [brackets, setBrackets] = useState<SteppedBracket[]>(
    rule?.brackets ?? [{ from: 0, to: 25, amount: 0 }, { from: 25, to: 50, amount: 199 }, { from: 50, to: null, amount: 349 }]
  );
  const [amountModel, setAmountModel] = useState<AmountModel>(rule?.amountModel ?? 'flat');
  const [amount, setAmount] = useState(rule?.amount ?? 0);
  const [hours, setHours] = useState(rule?.hours ?? 0);

  const ruleTypeOptions = (Object.keys(RULE_TYPE_LABELS) as RuleType[]).map((k) => ({
    id: k,
    label: RULE_TYPE_LABELS[k],
  }));

  const inventoryOptions = (Object.keys(INVENTORY_ATTRIBUTE_LABELS) as InventoryAttribute[]).map((k) => ({
    id: k,
    label: INVENTORY_ATTRIBUTE_LABELS[k],
  }));

  const orderOptions = (Object.keys(ORDER_ATTRIBUTE_LABELS) as OrderAttribute[]).map((k) => ({
    id: k,
    label: ORDER_ATTRIBUTE_LABELS[k],
  }));

  const paymentMethodOptions = (Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((k) => ({
    id: k,
    label: PAYMENT_METHOD_LABELS[k],
  }));

  const isDeliveryDistance = !isLabor && ruleType === 'order_attributes' && orderAttribute === 'delivery_distance';
  const isPaymentOption = !isLabor && ruleType === 'order_attributes' && orderAttribute === 'payment_option';
  const isDeliveryState = !isLabor && ruleType === 'order_attributes' && orderAttribute === 'delivery_state';

  const handleSave = () => {
    const newRule: FeeRule = {
      id: rule?.id ?? `r_${Date.now()}`,
      type: ruleType,
    };

    if (isLabor) newRule.isLabor = true;

    if (ruleType === 'dms') {
      newRule.dmsFieldName = dmsFieldName;
    } else if (ruleType === 'ekho_single_unit') {
      newRule.ekhoFieldName = ekhoFieldName;
    } else if (ruleType === 'inventory_attributes') {
      newRule.inventoryAttribute = inventoryAttribute;
      if (BRACKETED_INVENTORY_ATTRIBUTES.has(inventoryAttribute)) {
        newRule.brackets = brackets;
        if (isLabor) newRule.isLabor = true;
      } else {
        if (attributeValue) newRule.attributeValue = attributeValue;
        if (isLabor) {
          newRule.hours = hours;
        } else {
          newRule.amountModel = amountModel;
          newRule.amount = amount;
        }
      }
    } else if (ruleType === 'order_attributes') {
      newRule.orderAttribute = orderAttribute;
      if (isLabor) {
        newRule.hours = hours;
      } else if (isPaymentOption) {
        newRule.paymentMethod = paymentMethod;
        newRule.amountModel = amountModel;
        newRule.amount = amount;
      } else if (isDeliveryState) {
        newRule.states = states;
        newRule.feeModel = feeModel;
        newRule.amount = amount;
        if (feeModel === 'markup') {
          newRule.markupType = markupType;
        } else {
          newRule.amountModel = amountModel;
        }
      } else if (isDeliveryDistance) {
        newRule.feeModel = feeModel;
        newRule.amount = amount;
        if (feeModel === 'stepped') {
          newRule.brackets = brackets;
        }
        if (feeModel === 'markup') {
          newRule.markupType = markupType;
        }
      } else {
        newRule.amountModel = amountModel;
        newRule.amount = amount;
      }
    }

    onSave(newRule);
  };

  // Hours editor shared between labor inventory/order attribute rules
  const laborHoursEditor = (
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
  );

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
      <Stack itemsSpacing="20">
        {/* Labor toggle */}
        <Box padding="16" background="secondary" rounding="10">
          <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
            <Stack itemsSpacing="2">
              <Text size="bodySmall" weight="semibold">Labor hours</Text>
              <Text size="caption" color="tertiary">
                Map labor hours instead of a fee amount
              </Text>
            </Stack>
            <Switch isSelected={isLabor} onChange={setIsLabor} />
          </Group>
        </Box>

        {/* Rule type */}
        <Stack itemsSpacing="8">
          <Text size="footnote" color="secondary" weight="medium">Source / driver</Text>
          <Dropdown
            options={ruleTypeOptions}
            value={ruleType}
            onSelectionChange={(val) => setRuleType(val as RuleType)}
            size="medium"
            buttonVariant="outline"
          />
        </Stack>

        <Divider />

        {/* Type-specific configuration */}
        {ruleType === 'dms' && (
          <Stack itemsSpacing="8">
            <Text size="footnote" color="secondary" weight="medium">DMS field name</Text>
            <input
              type="text"
              value={dmsFieldName}
              onChange={(e) => setDmsFieldName(e.target.value)}
              placeholder={isLabor ? 'e.g., assembly_hrs, labor_hrs' : 'e.g., doc_fee, setup_fee'}
              style={INPUT_STYLE}
            />
            <Text size="caption" color="tertiary">
              {isLabor
                ? `The DMS field that contains the labor hours for this vehicle. Fee = hours x $${shopRate}/hr shop rate.`
                : 'The field name in your DMS that contains this fee amount per vehicle. If the field is blank or missing for a given vehicle, this rule will be skipped and the next rule in the priority list will be evaluated.'}
            </Text>
          </Stack>
        )}

        {ruleType === 'ekho_single_unit' && (
          <Stack itemsSpacing="8">
            <Text size="footnote" color="secondary" weight="medium">Ekho field</Text>
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
            <Text size="caption" color="tertiary">
              {isLabor
                ? `Per-vehicle labor hours set in the inventory drawer. Fee = hours x $${shopRate}/hr shop rate.`
                : 'This value is set per vehicle in the inventory drawer.'}
            </Text>
          </Stack>
        )}

        {ruleType === 'inventory_attributes' && (() => {
          const isBracketed = BRACKETED_INVENTORY_ATTRIBUTES.has(inventoryAttribute);
          const valueOptions = INVENTORY_ATTRIBUTE_VALUES[inventoryAttribute];
          const unitLabel = INVENTORY_BRACKET_UNITS[inventoryAttribute] ?? '';
          return (
          <>
            <Stack itemsSpacing="8">
              <Text size="footnote" color="secondary" weight="medium">Attribute</Text>
              <Dropdown
                options={inventoryOptions}
                value={inventoryAttribute}
                onSelectionChange={(val) => {
                  setInventoryAttribute(val as InventoryAttribute);
                  setAttributeValue('');
                }}
                size="medium"
                buttonVariant="outline"
              />
            </Stack>
            {isBracketed ? (
              <>
                <InventoryBracketEditor
                  brackets={brackets}
                  onChange={setBrackets}
                  unitLabel={unitLabel}
                  isLabor={isLabor}
                  shopRate={shopRate}
                />
              </>
            ) : (
              <>
                {valueOptions && (
                  <Stack itemsSpacing="8">
                    <Text size="footnote" color="secondary" weight="medium">Match value</Text>
                    <Dropdown
                      options={Object.entries(valueOptions).map(([k, v]) => ({ id: k, label: v }))}
                      value={attributeValue}
                      onSelectionChange={(val) => setAttributeValue(val)}
                      size="medium"
                      buttonVariant="outline"
                      placeholder="Select value..."
                    />
                  </Stack>
                )}
                {isLabor ? laborHoursEditor : (
                  <AmountEditor
                    amountModel={amountModel}
                    amount={amount}
                    onModelChange={setAmountModel}
                    onAmountChange={setAmount}
                  />
                )}
              </>
            )}
          </>
          );
        })()}

        {ruleType === 'order_attributes' && (
          <>
            <Stack itemsSpacing="8">
              <Text size="footnote" color="secondary" weight="medium">Attribute</Text>
              <Dropdown
                options={orderOptions}
                value={orderAttribute}
                onSelectionChange={(val) => setOrderAttribute(val as OrderAttribute)}
                size="medium"
                buttonVariant="outline"
              />
            </Stack>
            {isLabor ? laborHoursEditor : isPaymentOption ? (
              <>
                <Stack itemsSpacing="8">
                  <Text size="footnote" color="secondary" weight="medium">Payment method</Text>
                  <Dropdown
                    options={paymentMethodOptions}
                    value={paymentMethod}
                    onSelectionChange={(val) => setPaymentMethod(val as PaymentMethod)}
                    size="medium"
                    buttonVariant="outline"
                  />
                </Stack>
                <Stack itemsSpacing="8">
                  <Text size="footnote" color="secondary" weight="medium">Fee type</Text>
                  <Dropdown
                    options={(Object.keys(AMOUNT_MODEL_LABELS) as AmountModel[]).map((k) => ({
                      id: k,
                      label: AMOUNT_MODEL_LABELS[k],
                    }))}
                    value={amountModel}
                    onSelectionChange={(val) => setAmountModel(val as AmountModel)}
                    size="medium"
                    buttonVariant="outline"
                  />
                </Stack>
                <Box padding="16" background="secondary" rounding="12">
                  <Stack itemsSpacing="8">
                    <Text size="bodySmall" weight="semibold">Fee amount</Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {amountModel === 'flat' && <Text size="body" weight="semibold" color="tertiary">$</Text>}
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => {
                          const num = parseFloat(e.target.value);
                          if (!isNaN(num)) setAmount(num);
                        }}
                        style={{ ...INPUT_STYLE, width: '120px', fontSize: '16px', fontWeight: 600 }}
                      />
                      {amountModel !== 'flat' && <Text size="body" weight="semibold" color="tertiary">%</Text>}
                    </div>
                    {amountModel !== 'flat' && (
                      <Text size="caption" color="tertiary">
                        {AMOUNT_MODEL_LABELS[amountModel].toLowerCase()}
                      </Text>
                    )}
                  </Stack>
                </Box>
              </>
            ) : isDeliveryState ? (
              <>
                <Stack itemsSpacing="8">
                  <Text size="footnote" color="secondary" weight="medium">States</Text>
                  <Dropdown
                    options={US_STATES.filter((s) => !states.includes(s.id))}
                    placeholder="Add a state..."
                    onSelectionChange={(val) => {
                      if (val && !states.includes(val)) setStates([...states, val]);
                    }}
                    size="medium"
                    buttonVariant="outline"
                  />
                  {states.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {states.map((s) => (
                        <span
                          key={s}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            background: 'var(--rev-color-backgroundSecondary)',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: 'var(--rev-color-textPrimary)',
                          }}
                        >
                          {s}
                          <button
                            onClick={() => setStates(states.filter((x) => x !== s))}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              fontSize: '14px',
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
                <Box padding="16" background="secondary" rounding="12">
                  <Stack itemsSpacing="8">
                    <Text size="bodySmall" weight="semibold">Fee amount</Text>
                    <Stack itemsSpacing="8">
                      <Text size="footnote" color="secondary" weight="medium">Fee model</Text>
                      <SegmentedControl
                        size="small"
                        items={[
                          { value: 'flat', label: 'Flat fee' },
                          { value: 'markup', label: 'Markup on cost' },
                        ]}
                        value={feeModel === 'markup' ? 'markup' : 'flat'}
                        onChange={(val) => setFeeModel(val as FeeModel)}
                      />
                    </Stack>
                    {feeModel === 'markup' ? (
                      <>
                        <SegmentedControl
                          size="small"
                          items={[
                            { value: 'percentage', label: '% of cost' },
                            { value: 'flat', label: 'Flat $' },
                          ]}
                          value={markupType}
                          onChange={(val) => setMarkupType(val as 'flat' | 'percentage')}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {markupType === 'flat' && <Text size="body" weight="semibold" color="secondary">$</Text>}
                          <input
                            type="text"
                            value={amount}
                            onChange={(e) => {
                              const num = parseFloat(e.target.value);
                              if (!isNaN(num)) setAmount(num);
                            }}
                            style={{ ...INPUT_STYLE, width: '120px', fontSize: '16px', fontWeight: 600 }}
                          />
                          {markupType === 'percentage' && <Text size="body" weight="semibold" color="secondary">%</Text>}
                        </div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Text size="body" weight="semibold" color="secondary">$</Text>
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => {
                            const num = parseFloat(e.target.value);
                            if (!isNaN(num)) setAmount(num);
                          }}
                          style={{ ...INPUT_STYLE, width: '120px', fontSize: '16px', fontWeight: 600 }}
                        />
                      </div>
                    )}
                  </Stack>
                </Box>
              </>
            ) : isDeliveryDistance ? (
              <DeliveryDistanceAmountEditor
                feeModel={feeModel}
                amount={amount}
                brackets={brackets}
                markupType={markupType}
                onModelChange={setFeeModel}
                onAmountChange={setAmount}
                onBracketsChange={setBrackets}
                onMarkupTypeChange={setMarkupType}
              />
            ) : (
              <AmountEditor
                amountModel={amountModel}
                amount={amount}
                onModelChange={setAmountModel}
                onAmountChange={setAmount}
              />
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Fallback modal
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

        {/* Labor toggle */}
        <Box padding="16" background="secondary" rounding="10">
          <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
            <Stack itemsSpacing="2">
              <Text size="bodySmall" weight="semibold">Labor hours</Text>
              <Text size="caption" color="tertiary">
                Fallback to labor hours instead of a fee amount
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
// Priority list (numbered column + bordered items, drag-to-reorder)
// ---------------------------------------------------------------------------
function PriorityList({
  items,
  onEdit,
  onDelete,
  onEditFallback,
  onReorder,
}: {
  items: { label: string; sublabel?: string; isFallback?: boolean; ruleId?: string }[];
  onEdit: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
  onEditFallback: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  // Only rules (not fallback) count for drag boundaries
  const ruleCount = items.filter((it) => !it.isFallback).length;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    // Make the drag image slightly transparent
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
    // Need a timeout so the dragged element renders before we style it
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
    // Only allow dropping onto rule positions (not fallback)
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
            {/* Number cell — sits in left column, auto-matches row height */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text size="bodySmall" weight="semibold" color="secondary">{i + 1}</Text>
            </div>

            {/* Rule row */}
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
              {/* Drag handle or placeholder */}
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
                <Text size="bodySmall">{item.label}</Text>
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

  // Build rules list items
  const priorityItems: { label: string; sublabel?: string; isFallback?: boolean; ruleId?: string }[] = [];

  fee.rules.forEach((rule) => {
    priorityItems.push({
      label: getRuleLabel(rule),
      sublabel: getRuleSublabel(rule, shopRate),
      ruleId: rule.id,
    });
  });

  priorityItems.push({
    label: 'Fallback',
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

  // Get rule for edit modal
  const editingRule =
    modalState.type === 'edit_rule'
      ? fee.rules.find((r) => r.id === modalState.ruleId) ?? null
      : null;

  return (
    <div ref={sectionRef} id={`section-${fee.id}`}>
      <Box padding="24" background="secondary" rounding="12">
        <div style={{ opacity: fee.enabled ? 1 : 0.45, pointerEvents: fee.enabled ? 'auto' : 'none', transition: 'opacity 200ms ease' }}>
        <Stack itemsSpacing="16">
          {/* Card header */}
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

          {/* Rules */}
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
              The first matching rule wins. Drag to reorder.
            </Text>
            <PriorityList
              items={priorityItems}
              onEdit={(ruleId) => setModalState({ type: 'edit_rule', ruleId })}
              onDelete={handleDeleteRule}
              onEditFallback={() => setModalState({ type: 'edit_fallback' })}
              onReorder={handleReorder}
            />
          </Stack>

          {/* Save / Clear bar (visible when dirty) */}
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

      {/* Rule modal */}
      {(modalState.type === 'add_rule' || modalState.type === 'edit_rule') && (
        <RuleModal
          rule={modalState.type === 'edit_rule' ? editingRule : null}
          ekhoFieldName={fee.ekhoFieldName}
          shopRate={shopRate}
          onSave={handleSaveRule}
          onClose={() => setModalState({ type: 'closed' })}
        />
      )}

      {/* Fallback modal */}
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
