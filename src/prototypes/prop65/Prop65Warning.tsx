import { useState } from 'react';
import { Text, Stack, useMediaQuery, Note } from '../../rev';
import { PROP_65_WARNING_TEXT, PROP_65_URL } from './mock-data';
import type { DealerInfo } from './mock-data';
import { useHideNotes } from './context';

// ---------------------------------------------------------------------------
// Prop 65 Warning Component
//
// Per 27 CCR §25602(b): A "WARNING" hyperlink on the product display page
// that opens to show the full safe harbor text. Only shown for CA dealers.
// ---------------------------------------------------------------------------

export function Prop65Warning({ dealer, buyerIsCA = false }: { dealer: DealerInfo; buyerIsCA?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isPhone = useMediaQuery('(max-width: 640px)');
  const hideNotes = useHideNotes();

  // Prop 65 applies when the dealer is in CA OR the buyer is in CA.
  // A non-CA dealer shipping to a CA buyer must still comply.
  if (!dealer.isCA && !buyerIsCA) return null;

  return (
    <div
      style={{
        padding: isPhone ? '16px 0' : '20px 0',
      }}
    >
      {!expanded ? (
        // Collapsed state: WARNING link
        <div style={{ position: 'relative' }}>
          {!hideNotes && (
            <Note pin={{ top: -8, left: 0 }} align="right">
              <strong>Collapsed state: &ldquo;WARNING&rdquo; hyperlink</strong><br /><br />
              The link text must be the word &ldquo;WARNING&rdquo; per 27 CCR &sect;25602(b).
              This is a legal requirement for online Prop 65 compliance, not a design choice.
              The regulation specifically requires &ldquo;a hyperlink using the word
              &lsquo;WARNING&rsquo; in all capital letters on the product display page.&rdquo;
              Styled as underlined text to be clearly clickable while remaining unobtrusive,
              matching patterns used by Amazon and AutoZone.
            </Note>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '16px',
                color: 'var(--rev-color-textTertiary)',
              }}
            >
              warning
            </span>
            <a
              href="#prop65"
              onClick={(e) => {
                e.preventDefault();
                setExpanded(true);
              }}
              style={{
                fontFamily: 'var(--rev-fontFamily)',
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: 600,
                color: 'var(--rev-color-textSecondary)',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
                cursor: 'pointer',
              }}
            >
              WARNING
            </a>
            <Text size="footnote" color="tertiary">
              (California Proposition 65)
            </Text>
          </div>
        </div>
      ) : (
        // Expanded state: full warning text
        <div style={{ position: 'relative' }}>
          {!hideNotes && (
            <Note pin={{ top: -8, left: 0 }} align="right">
              <strong>Expanded state: safe harbor text</strong><br /><br />
              This is the exact safe harbor warning language from 27 CCR &sect;25607.17
              for &ldquo;passenger vehicle or off-highway motor vehicle&rdquo; exposures.
              Using this exact text provides legal safe harbor protection for the dealer,
              meaning they cannot be sued for inadequate warning as long as this text is
              displayed. The text is static (no dynamic variables). The
              P65Warnings.ca.gov/passenger-vehicle link is part of the safe harbor
              and must be included.
            </Note>
          )}
          <div
            style={{
              background: 'var(--rev-color-backgroundSecondary)',
              borderRadius: 'var(--rev-borderRadius-12)',
              padding: isPhone ? '12px' : '16px',
              border: '1px solid var(--rev-color-separatorTertiary)',
            }}
          >
            <Stack itemsSpacing="8">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '16px',
                      color: '#b45309',
                    }}
                  >
                    warning
                  </span>
                  <Text size="bodySmall" weight="bold" style={{ color: '#b45309' }}>
                    WARNING
                  </Text>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--rev-borderRadius-full)',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px', color: 'var(--rev-color-textTertiary)' }}
                  >
                    close
                  </span>
                </button>
              </div>
              <Text size="footnote" color="secondary" style={{ lineHeight: '18px' }}>
                {PROP_65_WARNING_TEXT}
              </Text>
              <a
                href={PROP_65_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--rev-fontFamily)',
                  fontSize: '11px',
                  lineHeight: '16px',
                  color: 'var(--rev-color-textSecondary)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                For more information go to P65Warnings.ca.gov/passenger-vehicle
              </a>
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
}
