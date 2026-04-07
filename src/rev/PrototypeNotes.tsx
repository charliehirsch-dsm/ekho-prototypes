import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/* =============================================================================
   Prototype Notes — Floating annotation stickies for prototypes
   Small numbered pins that expand on click to show implementation notes.
   Global toggle to show/hide all notes at once.
   ============================================================================= */

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface NotesContextValue {
  visible: boolean;
  toggle: () => void;
  nextId: () => number;
}

const NotesContext = createContext<NotesContextValue>({
  visible: true,
  toggle: () => {},
  nextId: () => 0,
});

// ---------------------------------------------------------------------------
// Provider — wrap your prototype with this
// ---------------------------------------------------------------------------
export function NotesProvider({ children, defaultVisible = true }: { children: ReactNode; defaultVisible?: boolean }) {
  const [visible, setVisible] = useState(defaultVisible);
  const [counter, setCounter] = useState(0);

  const toggle = useCallback(() => setVisible((v) => !v), []);
  const nextId = useCallback(() => {
    setCounter((c) => c + 1);
    return counter + 1;
  }, [counter]);

  return (
    <NotesContext.Provider value={{ visible, toggle, nextId }}>
      {children}
    </NotesContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Note — a floating annotation pin + expandable callout
// ---------------------------------------------------------------------------
interface NoteProps {
  /** The annotation text */
  children: ReactNode;
  /** Pin position relative to the parent (requires parent position: relative) */
  pin?: { top?: number | string; right?: number | string; bottom?: number | string; left?: number | string };
  /** Display inline in the flow instead of absolutely positioned */
  inline?: boolean;
  /** Custom label instead of auto-number */
  label?: string;
  /** Which side the callout expands toward. Default "right" (callout opens to the right of pin). */
  align?: 'left' | 'right';
}

export function Note({ children, pin, inline, label, align = 'right' }: NoteProps) {
  const { visible } = useContext(NotesContext);
  const [expanded, setExpanded] = useState(false);
  const [autoLabel] = useState(() => label ?? '');

  if (!visible) return null;

  const pinStyle: CSSProperties = inline
    ? { position: 'relative', display: 'inline-flex', verticalAlign: 'top', zIndex: 50 }
    : {
        position: 'absolute',
        zIndex: 50,
        ...(pin?.top !== undefined ? { top: pin.top } : {}),
        ...(pin?.right !== undefined ? { right: pin.right } : {}),
        ...(pin?.bottom !== undefined ? { bottom: pin.bottom } : {}),
        ...(pin?.left !== undefined ? { left: pin.left } : {}),
      };

  return (
    <div style={pinStyle}>
      {/* Pin circle */}
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          border: '2px solid #f59e0b',
          background: expanded ? '#f59e0b' : '#fffbeb',
          color: expanded ? 'white' : '#b45309',
          fontSize: '11px',
          fontWeight: 700,
          fontFamily: 'var(--rev-fontFamily, system-ui)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          transition: 'all 150ms ease',
          padding: 0,
          lineHeight: 1,
          flexShrink: 0,
        }}
        title="Prototype note"
      >
        {autoLabel || (
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            sticky_note_2
          </span>
        )}
      </button>

      {/* Expanded callout */}
      {expanded && (
        <>
          <div
            onClick={() => setExpanded(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
          />
          <div
            style={{
              position: 'absolute',
              top: '28px',
              ...(align === 'left' ? { right: '0' } : { left: '0' }),
              minWidth: '240px',
              maxWidth: '320px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: '#fffbeb',
              border: '1px solid #fde68a',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '12px',
              lineHeight: '17px',
              color: '#78350f',
              fontFamily: 'var(--rev-fontFamily, system-ui)',
              zIndex: 51,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// NotesToggle — floating button to show/hide all notes
// ---------------------------------------------------------------------------
export function NotesToggle() {
  const { visible, toggle } = useContext(NotesContext);

  return (
    <button
      onClick={toggle}
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        height: '36px',
        padding: '0 14px',
        borderRadius: '18px',
        border: '1px solid #fde68a',
        background: visible ? '#f59e0b' : '#fffbeb',
        color: visible ? 'white' : '#b45309',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'var(--rev-fontFamily, system-ui)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 9998,
        transition: 'all 150ms ease',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
        sticky_note_2
      </span>
      {visible ? 'Hide notes' : 'Show notes'}
    </button>
  );
}
