import React, { useState, useRef, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/* =============================================================================
   Rev Component Library (Prototype Edition)
   Lightweight recreations of the Rev design system components.
   These match Rev's visual output without the full React Aria internals.
   ============================================================================= */

// ---------------------------------------------------------------------------
// Spacing helper
// ---------------------------------------------------------------------------
type RevSpacing = '0' | '2' | '4' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '64' | '80';

function sp(value: RevSpacing | undefined): string {
  if (!value) return '0px';
  return `var(--rev-spacing-${value})`;
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------
type TextSize = 'display300' | 'display200' | 'display100' | 'title300' | 'title200' | 'title100' | 'heading' | 'body' | 'bodyMedium' | 'bodySmall' | 'footnote' | 'caption';
type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'success' | 'destructive' | 'disabled' | 'invertPrimary';

const textSizeMap: Record<TextSize, CSSProperties> = {
  display300: { fontSize: '36px', lineHeight: '37px', letterSpacing: '-0.3px' },
  display200: { fontSize: '32px', lineHeight: '37px', letterSpacing: '-0.3px' },
  display100: { fontSize: '28px', lineHeight: '33px', letterSpacing: '-0.3px' },
  title300: { fontSize: '26px', lineHeight: '31px', letterSpacing: '-0.3px' },
  title200: { fontSize: '24px', lineHeight: '29px', letterSpacing: '-0.3px' },
  title100: { fontSize: '22px', lineHeight: '27px', letterSpacing: '-0.3px' },
  heading: { fontSize: '20px', lineHeight: '25px', letterSpacing: '-0.2px' },
  body: { fontSize: '16px', lineHeight: '20px' },
  bodyMedium: { fontSize: '14px', lineHeight: '19px' },
  bodySmall: { fontSize: '13px', lineHeight: '18px' },
  footnote: { fontSize: '12px', lineHeight: '17px', letterSpacing: '0.15px' },
  caption: { fontSize: '10px', lineHeight: '14px', letterSpacing: '0.2px' },
};

const textColorMap: Record<TextColor, string> = {
  primary: 'var(--rev-color-textPrimary)',
  secondary: 'var(--rev-color-textSecondary)',
  tertiary: 'var(--rev-color-textTertiary)',
  quaternary: 'var(--rev-color-textQuaternary)',
  success: 'var(--rev-color-textSuccess)',
  destructive: 'var(--rev-color-textDestructive)',
  disabled: 'var(--rev-color-textDisabled)',
  invertPrimary: 'var(--rev-color-textInvertPrimary)',
};

interface TextProps {
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  as?: 'span' | 'p' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4';
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Text({ size = 'body', weight, color = 'primary', as: Tag = 'span', children, style, className }: TextProps) {
  return (
    <Tag
      className={className}
      style={{
        ...textSizeMap[size],
        fontWeight: weight ? `var(--rev-fontWeight-${weight})` : undefined,
        color: textColorMap[color],
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// Stack (vertical layout)
// ---------------------------------------------------------------------------
interface StackProps {
  itemsSpacing?: RevSpacing;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Stack({ itemsSpacing = '0', children, style, className }: StackProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: sp(itemsSpacing),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Group (horizontal layout)
// ---------------------------------------------------------------------------
interface GroupProps {
  itemsSpacing?: RevSpacing;
  itemsAlignX?: 'start' | 'center' | 'end' | 'space-between';
  itemsAlignY?: 'start' | 'center' | 'end' | 'stretch';
  noWrap?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

const alignXMap: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
};

const alignYMap: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

export function Group({ itemsSpacing = '0', itemsAlignX = 'start', itemsAlignY = 'center', noWrap, children, style, className }: GroupProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: sp(itemsSpacing),
        justifyContent: alignXMap[itemsAlignX],
        alignItems: alignYMap[itemsAlignY],
        flexWrap: noWrap ? 'nowrap' : 'wrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Box
// ---------------------------------------------------------------------------
type BoxBackground = 'primary' | 'secondary' | 'tertiary';
type BoxRounding = '0' | '8' | '10' | '12' | '16' | '20' | '24' | 'full';

interface BoxPadding {
  top?: RevSpacing;
  right?: RevSpacing;
  bottom?: RevSpacing;
  left?: RevSpacing;
}

interface BoxProps {
  background?: BoxBackground;
  rounding?: BoxRounding;
  padding?: RevSpacing | BoxPadding;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

const bgMap: Record<BoxBackground, string> = {
  primary: 'var(--rev-color-backgroundPrimary)',
  secondary: 'var(--rev-color-backgroundSecondary)',
  tertiary: 'var(--rev-color-backgroundTertiary)',
};

export function Box({ background, rounding, padding, children, style, className }: BoxProps) {
  let paddingStyle: CSSProperties = {};
  if (typeof padding === 'string') {
    paddingStyle = { padding: sp(padding) };
  } else if (typeof padding === 'object') {
    paddingStyle = {
      paddingTop: padding.top ? sp(padding.top) : undefined,
      paddingRight: padding.right ? sp(padding.right) : undefined,
      paddingBottom: padding.bottom ? sp(padding.bottom) : undefined,
      paddingLeft: padding.left ? sp(padding.left) : undefined,
    };
  }

  return (
    <div
      className={className}
      style={{
        background: background ? bgMap[background] : undefined,
        borderRadius: rounding ? `var(--rev-borderRadius-${rounding})` : undefined,
        ...paddingStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
type ButtonVariant = 'filled' | 'secondary' | 'ghost' | 'destructive';

interface ButtonProps {
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  children: ReactNode;
  type?: 'button' | 'submit';
  style?: CSSProperties;
}

export function Button({ variant = 'filled', onPress, disabled, children, type = 'button', style }: ButtonProps) {
  const baseStyle: CSSProperties = {
    fontFamily: 'var(--rev-fontFamily)',
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: 'var(--rev-fontWeight-semibold)' as unknown as number,
    padding: '8px 16px',
    borderRadius: 'var(--rev-borderRadius-10)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `background var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)`,
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles: Record<ButtonVariant, CSSProperties> = {
    filled: {
      background: 'var(--rev-color-carbonGray)',
      color: 'var(--rev-color-textInvertPrimary)',
    },
    secondary: {
      background: 'var(--rev-color-backgroundSecondary)',
      color: 'var(--rev-color-textPrimary)',
      boxShadow: 'var(--rev-boxShadow-elevation0)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--rev-color-textPrimary)',
    },
    destructive: {
      background: 'var(--rev-color-negativeBg)',
      color: 'white',
    },
  };

  return (
    <button
      type={type}
      onClick={onPress}
      disabled={disabled}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
export function Divider({ spacing = '0' }: { spacing?: RevSpacing }) {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid var(--rev-color-separatorTertiary)',
        marginTop: sp(spacing),
        marginBottom: sp(spacing),
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
type BadgeVariant = 'positive' | 'negative' | 'warning' | 'information' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const badgeColorMap: Record<BadgeVariant, { bg: string; fg: string }> = {
  positive: { bg: 'var(--rev-color-successLight)', fg: 'var(--rev-color-successBold)' },
  negative: { bg: 'var(--rev-color-errorLight)', fg: 'var(--rev-color-errorBold)' },
  warning: { bg: 'var(--rev-color-warningLight)', fg: 'var(--rev-color-warningBold)' },
  information: { bg: 'var(--rev-color-infoLight)', fg: 'var(--rev-color-infoBold)' },
  neutral: { bg: 'var(--rev-color-accentNeutralLight)', fg: 'var(--rev-color-accentNeutralBold)' },
};

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  const colors = badgeColorMap[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 'var(--rev-borderRadius-full)',
        background: colors.bg,
        color: colors.fg,
        fontSize: '12px',
        lineHeight: '17px',
        letterSpacing: '0.15px',
        fontWeight: 'var(--rev-fontWeight-semibold)' as unknown as number,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Callout
// ---------------------------------------------------------------------------
type CalloutVariant = 'neutral' | 'info' | 'warning' | 'error' | 'success';

interface CalloutProps {
  variant?: CalloutVariant;
  message: string;
  appearance?: 'filled' | 'outline';
}

const calloutStyles: Record<CalloutVariant, { bg: string; border: string; icon: string; iconColor: string }> = {
  neutral: { bg: 'var(--rev-color-accentNeutralLight)', border: 'var(--rev-color-separatorTertiary)', icon: 'info', iconColor: 'var(--rev-color-accentNeutralBold)' },
  info: { bg: 'var(--rev-color-infoLight)', border: 'var(--rev-color-infoBase)', icon: 'info', iconColor: 'var(--rev-color-infoBold)' },
  warning: { bg: 'var(--rev-color-warningLight)', border: 'var(--rev-color-warningBase)', icon: 'warning', iconColor: 'var(--rev-color-warningBold)' },
  error: { bg: 'var(--rev-color-errorLight)', border: 'var(--rev-color-errorBase)', icon: 'error', iconColor: 'var(--rev-color-errorBold)' },
  success: { bg: 'var(--rev-color-successLight)', border: 'var(--rev-color-successBase)', icon: 'check_circle', iconColor: 'var(--rev-color-successBold)' },
};

export function Callout({ variant = 'neutral', message, appearance = 'filled' }: CalloutProps) {
  const s = calloutStyles[variant];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: 'var(--rev-borderRadius-10)',
        background: appearance === 'filled' ? s.bg : 'transparent',
        border: appearance === 'outline' ? `1px solid ${s.border}` : `1px solid transparent`,
        fontSize: '13px',
        lineHeight: '18px',
        color: 'var(--rev-color-textPrimary)',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '18px', color: s.iconColor, flexShrink: 0, marginTop: '1px' }}
      >
        {s.icon}
      </span>
      <span>{message}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Accordion / AccordionSection
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
            <div onClick={(e) => e.stopPropagation()}>
              {rightAccessory}
            </div>
          )}
        </Group>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '22px',
            color: 'var(--rev-color-textSecondary)',
            transition: 'transform var(--rev-duration-moderato) var(--rev-timingFunction-slowThenZoom)',
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

// ---------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------
interface DropdownOption {
  id: string;
  label: string;
  description?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onSelectionChange?: (value: string) => void;
  placeholder?: string;
  isClearable?: boolean;
}

export function Dropdown({ options, value, onSelectionChange, placeholder = 'Select...', isClearable }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.id === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--rev-color-textInputBackground)',
          borderRadius: 'var(--rev-borderRadius-10)',
          border: isOpen ? '1px solid var(--rev-color-carbonGray)' : '1px solid var(--rev-color-separatorTertiary)',
          cursor: 'pointer',
          fontSize: '13px',
          lineHeight: '18px',
          minHeight: '36px',
          transition: 'border-color var(--rev-duration-allegro)',
        }}
      >
        <span style={{ color: selectedOption ? 'var(--rev-color-textPrimary)' : 'var(--rev-color-textDisabled)' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Group itemsSpacing="4" itemsAlignY="center" noWrap>
          {isClearable && selectedOption && (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px', color: 'var(--rev-color-textTertiary)' }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectionChange?.('');
              }}
            >
              close
            </span>
          )}
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: '18px',
              color: 'var(--rev-color-textSecondary)',
              transition: 'transform var(--rev-duration-allegro)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            expand_more
          </span>
        </Group>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--rev-color-backgroundPrimary)',
            borderRadius: 'var(--rev-borderRadius-12)',
            boxShadow: 'var(--rev-boxShadow-elevation3)',
            border: '1px solid var(--rev-color-separatorTertiary)',
            zIndex: 100,
            overflow: 'hidden',
            animation: 'revFadeIn var(--rev-duration-allegro) var(--rev-timingFunction-slowThenZoom)',
          }}
        >
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => {
                onSelectionChange?.(option.id);
                setIsOpen(false);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                lineHeight: '18px',
                background: option.id === value ? 'var(--rev-color-menuHighlightOpaque)' : 'transparent',
                transition: 'background var(--rev-duration-presto)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLDivElement).style.background = 'var(--rev-color-menuHighlight)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLDivElement).style.background =
                  option.id === value ? 'var(--rev-color-menuHighlightOpaque)' : 'transparent';
              }}
            >
              <Stack itemsSpacing="2">
                <Text size="bodySmall">{option.label}</Text>
                {option.description && (
                  <Text size="footnote" color="secondary">{option.description}</Text>
                )}
              </Stack>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
interface TabItem {
  id: string;
  content: string;
}

interface TabsProps {
  items: TabItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export function Tabs({ items, selectedKey, onSelect }: TabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid var(--rev-color-separatorTertiary)',
      }}
    >
      {items.map((item) => {
        const isActive = item.id === selectedKey;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            style={{
              fontFamily: 'var(--rev-fontFamily)',
              fontSize: '13px',
              lineHeight: '18px',
              fontWeight: isActive ? 'var(--rev-fontWeight-semibold)' as unknown as number : 'var(--rev-fontWeight-regular)' as unknown as number,
              color: isActive ? 'var(--rev-color-textPrimary)' : 'var(--rev-color-textSecondary)',
              padding: '10px 16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: isActive ? '2px solid var(--rev-color-carbonGray)' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'color var(--rev-duration-allegro), border-color var(--rev-duration-allegro)',
            }}
          >
            {item.content}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
interface ToastState {
  message: string;
  variant: 'success' | 'error' | 'info';
  visible: boolean;
}

let toastCallback: ((state: ToastState) => void) | null = null;

export function registerToast(cb: (state: ToastState) => void) {
  toastCallback = cb;
}

export const toast = {
  success: (message: string) => toastCallback?.({ message, variant: 'success', visible: true }),
  error: (message: string) => toastCallback?.({ message, variant: 'error', visible: true }),
  info: (message: string) => toastCallback?.({ message, variant: 'info', visible: true }),
};

const toastVariantStyles: Record<string, CSSProperties> = {
  success: { background: 'var(--rev-color-successBold)', color: 'white' },
  error: { background: 'var(--rev-color-errorBold)', color: 'white' },
  info: { background: 'var(--rev-color-carbonGray)', color: 'white' },
};

export function ToastContainer() {
  const [state, setState] = useState<ToastState>({ message: '', variant: 'info', visible: false });

  useEffect(() => {
    registerToast((newState) => {
      setState(newState);
      setTimeout(() => setState((s) => ({ ...s, visible: false })), 3000);
    });
  }, []);

  if (!state.visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 20px',
        borderRadius: 'var(--rev-borderRadius-10)',
        boxShadow: 'var(--rev-boxShadow-elevation4)',
        fontSize: '13px',
        fontWeight: 'var(--rev-fontWeight-semibold)' as unknown as number,
        zIndex: 9999,
        animation: 'revSlideUp var(--rev-duration-moderato) var(--rev-timingFunction-curveOut)',
        ...toastVariantStyles[state.variant],
      }}
    >
      {state.message}
    </div>
  );
}
