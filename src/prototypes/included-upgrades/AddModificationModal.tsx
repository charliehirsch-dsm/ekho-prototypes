import { useState } from 'react';
import { Text, Stack, Group, Button, Divider, toast, Note } from '../../rev';
import type { ModificationEntry, FieldSource, FieldSourceInfo } from './mock-data';

interface AddModificationModalProps {
  onClose: () => void;
  onSave: (entry: ModificationEntry) => void;
  existingEntry?: ModificationEntry | null;
  /** Render inline (position: absolute) instead of fixed, for embedding in DeviceFrames */
  inline?: boolean;
}

// ---------------------------------------------------------------------------
// Inline field source badge + reset button
// ---------------------------------------------------------------------------
function FieldSourceBadge({
  fieldSource,
  isDmsEntry,
  onReset,
}: {
  fieldSource: FieldSourceInfo;
  isDmsEntry?: boolean;
  onReset?: () => void;
}) {
  const isEkho = fieldSource.source === 'EKHO';
  // For DMS entries where a field was overridden: amber "Ekho override"
  // For Ekho entries (all fields are EKHO natively): neutral "Ekho"
  // For DMS-sourced fields: blue "DMS"
  const isOverridden = isEkho && isDmsEntry;

  let badgeLabel: string;
  let badgeBg: string;
  let badgeColor: string;
  let badgeBorder: string;

  if (isOverridden) {
    badgeLabel = 'Ekho override';
    badgeBg = 'var(--rev-color-warningLight, #fef3c7)';
    badgeColor = 'var(--rev-color-warningBold, #b45309)';
    badgeBorder = 'var(--rev-color-warningBase, #fde68a)';
  } else if (isEkho) {
    badgeLabel = 'Ekho';
    badgeBg = 'var(--rev-color-backgroundSecondary)';
    badgeColor = 'var(--rev-color-textTertiary)';
    badgeBorder = 'var(--rev-color-separatorTertiary)';
  } else {
    badgeLabel = 'DMS';
    badgeBg = 'var(--rev-color-informationBackground, rgba(59,130,246,0.08))';
    badgeColor = 'var(--rev-color-informationText, #3b82f6)';
    badgeBorder = 'var(--rev-color-informationBorder, rgba(59,130,246,0.2))';
  }

  return (
    <>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          padding: '1px 6px',
          borderRadius: 'var(--rev-borderRadius-full)',
          fontSize: '10px',
          lineHeight: '14px',
          fontWeight: 500,
          fontFamily: 'var(--rev-fontFamily)',
          background: badgeBg,
          color: badgeColor,
          border: `1px solid ${badgeBorder}`,
        }}
      >
        {isOverridden && (
          <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>edit</span>
        )}
        {badgeLabel}
      </span>
      {isOverridden && onReset && (
        <button
          onClick={onReset}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '10px',
            lineHeight: '14px',
            fontFamily: 'var(--rev-fontFamily)',
            color: 'var(--rev-color-informationText, #3b82f6)',
            fontWeight: 500,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>sync</span>
          Reset to DMS
        </button>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Form field wrapper
// ---------------------------------------------------------------------------
function FormField({
  label,
  required,
  children,
  charCount,
  charMin,
  charMax,
  fieldSource,
  isDmsEntry,
  onResetSource,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  charCount?: number;
  charMin?: number;
  charMax?: number;
  fieldSource?: FieldSourceInfo;
  isDmsEntry?: boolean;
  onResetSource?: () => void;
}) {
  const isUnder = charCount !== undefined && charMin !== undefined && charCount < charMin;
  const isOver = charCount !== undefined && charMax !== undefined && charCount > charMax;
  const isOverridden = fieldSource?.source === 'EKHO';

  return (
    <Stack itemsSpacing="4">
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        <Text size="bodySmall" weight="semibold">{label}</Text>
        {required && (
          <Text size="bodySmall" color="destructive">*</Text>
        )}
        {fieldSource && (
          <FieldSourceBadge fieldSource={fieldSource} isDmsEntry={isDmsEntry} onReset={isDmsEntry ? onResetSource : undefined} />
        )}
      </div>
      {children}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          {isDmsEntry && isOverridden && (
            <Text size="caption" color="tertiary" style={{ fontStyle: 'italic' }}>
              This field will no longer sync with DMS updates.
            </Text>
          )}
        </div>
        {charCount !== undefined && charMax !== undefined && (
          <Text
            size="caption"
            color={isUnder || isOver ? 'destructive' : 'tertiary'}
            style={{ flexShrink: 0 }}
          >
            {charCount}/{charMax}
            {isUnder && charMin !== undefined && ` (min ${charMin})`}
          </Text>
        )}
      </div>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Image upload area
// ---------------------------------------------------------------------------
function ImageUploadArea({ images, onAdd, onRemove }: {
  images: string[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <Stack itemsSpacing="8">
      <Group itemsSpacing="8" itemsAlignY="center">
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              width: '72px',
              height: '72px',
              borderRadius: 'var(--rev-borderRadius-8)',
              overflow: 'hidden',
              border: '1px solid var(--rev-color-separatorTertiary)',
            }}
          >
            <img
              src={img}
              alt={`Upload ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              onClick={() => onRemove(i)}
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                lineHeight: 1,
              }}
            >
              x
            </button>
          </div>
        ))}
        {images.length < 3 && (
          <button
            onClick={onAdd}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--rev-borderRadius-8)',
              border: '2px dashed var(--rev-color-separatorSecondary)',
              background: 'var(--rev-color-backgroundSecondary)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '20px', color: 'var(--rev-color-textTertiary)' }}
            >
              add_photo_alternate
            </span>
            <span style={{ fontSize: '10px', color: 'var(--rev-color-textTertiary)' }}>
              Add
            </span>
          </button>
        )}
      </Group>
      {images.length === 0 && (
        <Text size="caption" color="tertiary">
          Adding photos helps buyers see the value of modifications
        </Text>
      )}
      <Text size="caption" color="tertiary">
        Up to 3 images. JPEG, PNG accepted.
      </Text>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Input style constant
// ---------------------------------------------------------------------------
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 'var(--rev-borderRadius-8)',
  border: '1px solid var(--rev-color-separatorSecondary)',
  background: 'var(--rev-color-backgroundPrimary)',
  fontFamily: 'var(--rev-fontFamily)',
  fontSize: '13px',
  lineHeight: '18px',
  color: 'var(--rev-color-textPrimary)',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
export function AddModificationModal({ onClose, onSave, existingEntry, inline }: AddModificationModalProps) {
  const isEditing = !!existingEntry;
  const isDmsEntry = existingEntry?.source === 'dms';

  const [title, setTitle] = useState(existingEntry?.title ?? '');
  const [description, setDescription] = useState(existingEntry?.description ?? '');
  const [price, setPrice] = useState(existingEntry?.price?.toString() ?? '');
  const [brand, setBrand] = useState(existingEntry?.brand ?? '');
  const [partNumber, setPartNumber] = useState(existingEntry?.partNumber ?? '');
  const [images, setImages] = useState<string[]>(existingEntry?.images ?? []);

  // Per-field source tracking (clone from existing entry or default to EKHO for new)
  const defaultSource = (field: keyof ModificationEntry['fieldSources']): FieldSourceInfo =>
    existingEntry?.fieldSources?.[field] ?? { source: 'EKHO' as FieldSource };

  const [titleSource, setTitleSource] = useState<FieldSourceInfo>(defaultSource('title'));
  const [descSource, setDescSource] = useState<FieldSourceInfo>(defaultSource('description'));
  const [priceSource, setPriceSource] = useState<FieldSourceInfo>(defaultSource('price'));
  const [brandSource, setBrandSource] = useState<FieldSourceInfo>(defaultSource('brand'));
  const [partNumSource, setPartNumSource] = useState<FieldSourceInfo>(defaultSource('partNumber'));
  const [imagesSource, setImagesSource] = useState<FieldSourceInfo>(defaultSource('images'));

  // Mark field as Ekho-overridden when user edits a DMS field
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isDmsEntry && titleSource.source === 'DMS') {
      setTitleSource({ source: 'EKHO', originalValue: existingEntry?.title });
    }
  };
  const handleDescChange = (val: string) => {
    setDescription(val);
    if (isDmsEntry && descSource.source === 'DMS') {
      setDescSource({ source: 'EKHO', originalValue: existingEntry?.description });
    }
  };
  const handlePriceChange = (val: string) => {
    setPrice(val);
    if (isDmsEntry && priceSource.source === 'DMS') {
      setPriceSource({ source: 'EKHO', originalValue: existingEntry?.price });
    }
  };
  const handleBrandChange = (val: string) => {
    setBrand(val);
    if (isDmsEntry && brandSource.source === 'DMS') {
      setBrandSource({ source: 'EKHO', originalValue: existingEntry?.brand });
    }
  };
  const handlePartNumChange = (val: string) => {
    setPartNumber(val);
    if (isDmsEntry && partNumSource.source === 'DMS') {
      setPartNumSource({ source: 'EKHO', originalValue: existingEntry?.partNumber });
    }
  };

  // Reset to DMS handlers
  const resetTitle = () => {
    const orig = titleSource.originalValue ?? existingEntry?.fieldSources?.title?.originalValue;
    if (orig !== undefined) setTitle(String(orig));
    setTitleSource({ source: 'DMS', originalValue: orig as string });
    toast.info('Title reset to DMS. Pulling latest value from DMS.');
  };
  const resetDesc = () => {
    const orig = descSource.originalValue ?? existingEntry?.fieldSources?.description?.originalValue;
    if (orig !== undefined) setDescription(String(orig));
    setDescSource({ source: 'DMS', originalValue: orig as string });
    toast.info('Description reset to DMS. Pulling latest value from DMS.');
  };
  const resetPrice = () => {
    const orig = priceSource.originalValue ?? existingEntry?.fieldSources?.price?.originalValue;
    if (orig !== undefined) setPrice(String(orig));
    setPriceSource({ source: 'DMS', originalValue: orig as number });
    toast.info('Price reset to DMS. Pulling latest value from DMS.');
  };
  const resetBrand = () => {
    const orig = brandSource.originalValue ?? existingEntry?.fieldSources?.brand?.originalValue;
    if (orig !== undefined) setBrand(String(orig));
    setBrandSource({ source: 'DMS', originalValue: orig as string });
    toast.info('Brand reset to DMS. Pulling latest value from DMS.');
  };
  const resetPartNum = () => {
    const orig = partNumSource.originalValue ?? existingEntry?.fieldSources?.partNumber?.originalValue;
    if (orig !== undefined) setPartNumber(String(orig));
    setPartNumSource({ source: 'DMS', originalValue: orig as string });
    toast.info('Part number reset to DMS. Pulling latest value from DMS.');
  };

  const canSave =
    title.length >= 3 &&
    title.length <= 40 &&
    description.length >= 10 &&
    description.length <= 140;

  const handleSave = () => {
    const entry: ModificationEntry = {
      id: existingEntry?.id ?? `mod-${Date.now()}`,
      source: existingEntry?.source ?? 'ekho',
      title,
      description,
      price: parseFloat(price) || 0,
      images,
      brand: brand || undefined,
      partNumber: partNumber || undefined,
      fieldSources: {
        title: titleSource,
        description: descSource,
        price: priceSource,
        brand: brandSource,
        partNumber: partNumSource,
        images: imagesSource,
      },
    };
    onSave(entry);
    toast.success(isEditing ? 'Modification updated' : 'Modification added');
    onClose();
  };

  const handleAddImage = () => {
    const placeholders = [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=200&h=200&fit=crop',
    ];
    const nextIdx = images.length;
    if (nextIdx < 3) {
      setImages([...images, placeholders[nextIdx]]);
      if (isDmsEntry && imagesSource.source === 'DMS') {
        setImagesSource({ source: 'EKHO' });
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: inline ? 'absolute' : 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 9998,
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: inline ? 'absolute' : 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: inline ? '95%' : '480px',
          maxWidth: '95vw',
          maxHeight: inline ? '95%' : '90vh',
          background: 'var(--rev-color-backgroundPrimary)',
          borderRadius: 'var(--rev-borderRadius-16)',
          boxShadow: 'var(--rev-boxShadow-elevation5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 0' }}>
          <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Text size="body" weight="bold">
                {isEditing ? 'Edit modification' : 'Add modification'}
              </Text>
              {isEditing && (
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
                    background: isDmsEntry
                      ? 'var(--rev-color-informationBackground, rgba(59,130,246,0.08))'
                      : 'var(--rev-color-backgroundSecondary)',
                    color: isDmsEntry
                      ? 'var(--rev-color-informationText, #3b82f6)'
                      : 'var(--rev-color-textTertiary)',
                    border: isDmsEntry
                      ? '1px solid var(--rev-color-informationBorder, rgba(59,130,246,0.2))'
                      : '1px solid var(--rev-color-separatorTertiary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isDmsEntry ? 'DMS Synced' : 'Added in Ekho'}
                </span>
              )}
              {isEditing && !isDmsEntry && (
                <Note inline>
                  <strong>Ekho-sourced entries</strong> — All fields show "Ekho" source since this modification was manually added. There is no DMS data to reset to, so no "Reset to DMS" option appears.
                </Note>
              )}
            </div>
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
                style={{ fontSize: '18px', color: 'var(--rev-color-textPrimary)' }}
              >
                close
              </span>
            </button>
          </Group>
        </div>

        <Divider spacing="16" />

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
          <Stack itemsSpacing="20">
            <FormField
              label="Title"
              required
              charCount={title.length}
              charMin={3}
              charMax={40}
              fieldSource={titleSource}
              isDmsEntry={isDmsEntry}
              onResetSource={resetTitle}
            >
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Muffler, Front fender, Rims, Suspension"
                style={inputStyle}
              />
            </FormField>

            <FormField
              label="Description"
              required
              charCount={description.length}
              charMin={10}
              charMax={140}
              fieldSource={descSource}
              isDmsEntry={isDmsEntry}
              onResetSource={resetDesc}
            >
              <textarea
                value={description}
                onChange={(e) => handleDescChange(e.target.value)}
                placeholder="e.g., Yoshimura Racing exhaust, Kellanti custom rims"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </FormField>

            <FormField
              label="Price"
              fieldSource={priceSource}
              isDmsEntry={isDmsEntry}
              onResetSource={resetPrice}
            >
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '13px',
                    color: 'var(--rev-color-textSecondary)',
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  style={{ ...inputStyle, paddingLeft: '24px' }}
                />
              </div>
              <Text size="caption" color="tertiary">
                If a price is entered, it will be added to the vehicle's advertised price and appear on checkout and the bill of sale.
              </Text>
            </FormField>

            <FormField
              label="Brand"
              fieldSource={brandSource}
              isDmsEntry={isDmsEntry}
              onResetSource={resetBrand}
            >
              <input
                type="text"
                value={brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                placeholder="e.g., Yoshimura, Ohlins, Akrapovic"
                style={inputStyle}
              />
            </FormField>

            <FormField
              label="Part number"
              fieldSource={partNumSource}
              isDmsEntry={isDmsEntry}
              onResetSource={resetPartNum}
            >
              <input
                type="text"
                value={partNumber}
                onChange={(e) => handlePartNumChange(e.target.value)}
                placeholder="e.g., S-K9SO7-ASZT"
                disabled={isDmsEntry}
                style={{
                  ...inputStyle,
                  ...(isDmsEntry ? {
                    background: 'var(--rev-color-backgroundSecondary)',
                    color: 'var(--rev-color-textTertiary)',
                    cursor: 'not-allowed',
                  } : {}),
                }}
              />
            </FormField>

            <FormField
              label="Images"
              fieldSource={imagesSource}
              isDmsEntry={isDmsEntry}
              onResetSource={() => {
                setImages(existingEntry?.images ?? []);
                setImagesSource({ source: 'DMS' });
                toast.info('Images reset to DMS. Pulling latest value from DMS.');
              }}
            >
              <ImageUploadArea
                images={images}
                onAdd={handleAddImage}
                onRemove={(idx) => {
                  setImages(images.filter((_, i) => i !== idx));
                  if (isDmsEntry && imagesSource.source === 'DMS') {
                    setImagesSource({ source: 'EKHO' });
                  }
                }}
              />
            </FormField>
          </Stack>
        </div>

        <Divider spacing="16" />

        {/* Footer */}
        <div style={{ padding: '0 24px 20px' }}>
          <Group itemsAlignX="end" itemsSpacing="8">
            <Button variant="secondary" onPress={onClose}>
              Cancel
            </Button>
            <Button
              variant="filled"
              onPress={handleSave}
              style={{ opacity: canSave ? 1 : 0.5 }}
            >
              {isEditing ? 'Save changes' : 'Add modification'}
            </Button>
          </Group>
        </div>
      </div>
    </>
  );
}
