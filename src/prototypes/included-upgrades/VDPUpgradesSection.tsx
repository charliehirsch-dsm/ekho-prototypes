import { useState } from 'react';
import { Text, Stack, Group, Divider, useMediaQuery } from '../../rev';
import type { ModificationEntry } from './mock-data';

// ---------------------------------------------------------------------------
// Lightbox (full-screen image viewer with navigation)
// ---------------------------------------------------------------------------
function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
      </button>

      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div
          style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
          <Text size="bodySmall" style={{ color: 'white' }}>{currentIndex + 1} / {images.length}</Text>
          <button
            onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ImageSection — matches production AccessoryProductListing.scss exactly
// Horizontal: 165px wide, 4:3, margin-left 20px, borderRadius-12, inner ring, count badge
// Vertical: 100% wide, 4:3, no margin
// ---------------------------------------------------------------------------
function ImageSection({
  images,
  productName,
  layout,
}: {
  images: string[];
  productName: string;
  layout: 'horizontal' | 'vertical';
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    if (layout === 'vertical') {
      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 'var(--rev-borderRadius-12)',
              overflow: 'hidden',
              background: 'var(--rev-color-backgroundSecondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '32px', color: 'var(--rev-color-textTertiary)' }}
            >
              image
            </span>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'var(--rev-borderRadius-12)',
                border: '1px solid var(--rev-color-separatorTertiary)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <button
        onClick={() => setLightboxOpen(true)}
        style={{
          position: 'relative',
          width: layout === 'horizontal' ? '165px' : '100%',
          height: 'auto',
          aspectRatio: '4 / 3',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          outline: 'none',
          marginLeft: layout === 'horizontal' ? '20px' : 0,
        }}
      >
        <div
          style={{
            width: layout === 'horizontal' ? '165px' : '100%',
            height: 'auto',
            aspectRatio: '4 / 3',
            borderRadius: 'var(--rev-borderRadius-12)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src={images[0]}
            alt={productName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Inner border ring (matches production ::after) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'var(--rev-borderRadius-12)',
              border: '1px solid var(--rev-color-separatorTertiary)',
              pointerEvents: 'none',
            }}
          />
        </div>
        {/* Count badge (matches production .count-badge) */}
        {images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '6px',
              height: '24px',
              padding: '0 6px',
              borderRadius: 'var(--rev-borderRadius-8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(2px)',
              background: 'rgba(0,0,0,0.4)',
            }}
          >
            <Text size="bodySmall" style={{ color: 'white' }}>{images.length}+</Text>
          </div>
        )}
      </button>

      {lightboxOpen && (
        <Lightbox images={images} initialIndex={0} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// CheckCircle icon (matches production CheckCircleFilled16)
// ---------------------------------------------------------------------------
function CheckCircleFilled() {
  return (
    <div style={{ display: 'flex', flex: 'none', width: '16px', height: '16px' }}>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '16px', color: 'var(--rev-color-textSuccess, #22c55e)' }}
      >
        check_circle
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Adornment — matches production AccessoryProductListing Adornment
// For included upgrades: shows "Included" with check icon (like "Pre-installed")
// ---------------------------------------------------------------------------
function Adornment({ price }: { price: number }) {
  return (
    <Group itemsSpacing="4" noWrap itemsAlignX="start" itemsAlignY="center">
      <CheckCircleFilled />
      <Text size="bodySmall">
        {price > 0
          ? `Included \u00B7 +$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          : 'Included'}
      </Text>
    </Group>
  );
}

// ---------------------------------------------------------------------------
// Horizontal row — matches production AccessoryProductListing [data-layout='horizontal']
// Structure: padding 12px 0, flex column with 16px row-gap
//   .horizontal-card-content: flex, justify-content: space-between
//     .text-content: flex column, 8px row-gap
//       [name + description]
//       [adornment]
//     [image-section]
//   <Divider />
// ---------------------------------------------------------------------------
function UpgradeRowHorizontal({ entry }: { entry: ModificationEntry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '16px',
        padding: '12px 0',
      }}
    >
      {/* horizontal-card-content */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        {/* text-content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '8px',
          }}
        >
          <Stack itemsSpacing="2">
            <Text size="body" weight="semibold">{entry.title}</Text>
            {entry.description && (
              <Text size="footnote" color="secondary">{entry.description}</Text>
            )}
          </Stack>
          <Adornment price={entry.price} />
        </div>

        {/* image */}
        <div>
          <ImageSection images={entry.images} productName={entry.title} layout="horizontal" />
        </div>
      </div>
      <Divider />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vertical card — matches production AccessoryProductListing [data-layout='vertical']
// max-width: 169px, image top, text below with 8px padding-inline
// ---------------------------------------------------------------------------
function UpgradeCardVertical({ entry }: { entry: ModificationEntry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '16px',
        maxWidth: '169px',
        flexShrink: 0,
      }}
    >
      <ImageSection images={entry.images} productName={entry.title} layout="vertical" />
      <Stack itemsSpacing="8" style={{ paddingInline: '8px' }}>
        <Text size="body" weight="semibold">{entry.title}</Text>
        <Adornment price={entry.price} />
        {entry.description && (
          <Text size="footnote" color="secondary">{entry.description}</Text>
        )}
      </Stack>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VDP Included Upgrades Section
// Matches production VehicleDetailsAccessories structure:
//   Stack itemsSpacing={16}
//     Group (title + tag)
//     Box (description)
//     ContentSlider (compact) or grid (desktop)
// ---------------------------------------------------------------------------
export function VDPUpgradesSection({
  modifications,
}: {
  modifications: ModificationEntry[];
}) {
  const isCompact = useMediaQuery('(max-width: 980px)');

  if (modifications.length === 0) return null;

  const totalValue = modifications.reduce((sum, m) => sum + m.price, 0);
  const pricedCount = modifications.filter((m) => m.price > 0).length;

  return (
    <div id="included-upgrades">
    <Stack itemsSpacing="16">
      {/* Header — clean heading, matches design */}
      <Text size="heading">Included upgrades</Text>

      {/* Content */}
      {isCompact ? (
        // Compact: horizontal scroll (matches production ContentSlider)
        <div
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            paddingBottom: '4px',
          }}
        >
          {modifications.map((mod) => (
            <UpgradeCardVertical key={mod.id} entry={mod} />
          ))}
        </div>
      ) : (
        // Desktop: 2-column grid (matches production .vehicle-details-accessories__grid)
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: '16px',
            rowGap: '16px',
          }}
        >
          {modifications.map((mod) => (
            <UpgradeRowHorizontal key={mod.id} entry={mod} />
          ))}
        </div>
      )}
    </Stack>
    </div>
  );
}
