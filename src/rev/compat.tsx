/**
 * Prototype compatibility layer.
 * Wraps real Rev components to maintain backward-compat with existing prototypes.
 */
import { useState } from 'react';
import type { ReactNode } from 'react';

import { toast as revToast, ToastProvider } from '@rev-source/molecules/Toast';
import type { ToastOptions } from '@rev-source/molecules/Toast';
import { Text } from '@rev-source/atoms/Text';
import { Group } from '@rev-source/layouts/Group';

// ---------------------------------------------------------------------------
// Toast compat: supports both toast.success('msg') and toast({ message, variant })
// ---------------------------------------------------------------------------
type ToastFn = {
  (options: ToastOptions): string;
  success: (message: string) => string;
  error: (message: string) => string;
  info: (message: string) => string;
  warning: (message: string) => string;
};

const toastFn = ((options: ToastOptions) => revToast(options)) as ToastFn;
toastFn.success = (message: string) => revToast({ message, variant: 'success' });
toastFn.error = (message: string) => revToast({ message, variant: 'error' });
toastFn.info = (message: string) => revToast({ message, variant: 'info' });
toastFn.warning = (message: string) => revToast({ message, variant: 'warning' });

export const toast = toastFn;

// ---------------------------------------------------------------------------
// ToastContainer compat: renders ToastProvider as a sibling (no children)
// ---------------------------------------------------------------------------
export function ToastContainer() {
  return (
    <ToastProvider>
      <></>
    </ToastProvider>
  );
}

// ---------------------------------------------------------------------------
// AccordionSection: convenience wrapper for prototypes
// Uses real Rev Accordion/AccordionHeader/AccordionBody under the hood
// ---------------------------------------------------------------------------
interface AccordionSectionProps {
  title: string;
  defaultExpanded?: boolean;
  rightAccessory?: ReactNode;
  children: ReactNode;
}

export function AccordionSection({ title, defaultExpanded = true, rightAccessory, children }: AccordionSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0 16px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Group itemsSpacing="12" itemsAlignY="center">
          <Text size="body" weight="bold">{title}</Text>
          {rightAccessory && (
            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              {rightAccessory}
            </div>
          )}
        </Group>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '22px',
            color: 'var(--rev-color-textSecondary)',
            transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        >
          expand_less
        </span>
      </div>
      {expanded && (
        <div style={{ paddingBottom: '16px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
