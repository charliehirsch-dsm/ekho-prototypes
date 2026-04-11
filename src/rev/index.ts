/**
 * Rev Design System barrel for prototypes.
 * Re-exports real Rev components from source, excluding organisms/sections
 * that depend on external services (Firebase, Google Maps, Stripe, etc.).
 */

// ─── Layouts ──────────────────────────────────────────────────────────────
export * from '@rev-source/layouts/Alignment/alignment';
export * from '@rev-source/layouts/Box';
export * from '@rev-source/layouts/Group';
export * from '@rev-source/layouts/Section';
export * from '@rev-source/layouts/Spacing/spacing';
export * from '@rev-source/layouts/Stack';

// ─── Atoms ────────────────────────────────────────────────────────────────
export * from '@rev-source/atoms/Badge';
export * from '@rev-source/atoms/Breadcrumbs';
export * from '@rev-source/atoms/Button';
export * from '@rev-source/atoms/Callout';
export * from '@rev-source/atoms/Card';
export * from '@rev-source/atoms/Checkbox';
export * from '@rev-source/atoms/CheckboxGroup';
export * from '@rev-source/atoms/Chip';
export * from '@rev-source/atoms/DateInput';
export * from '@rev-source/atoms/Divider';
export * from '@rev-source/atoms/Dropzone';
export * from '@rev-source/atoms/Empty';
export * from '@rev-source/atoms/EmptySearchResults';
export * from '@rev-source/atoms/FileButton';
export * from '@rev-source/atoms/Image';
export * from '@rev-source/atoms/LabelledList';
export * from '@rev-source/atoms/LabelPrice';
export * from '@rev-source/atoms/Link';
export * from '@rev-source/atoms/ListViewGroup';
export * from '@rev-source/atoms/ListViewRow';
export { Note as RevNote } from '@rev-source/atoms/Note';
export * from '@rev-source/atoms/RadioGroup';
export * from '@rev-source/atoms/SegmentedControl';
export * from '@rev-source/atoms/Skeleton';
export * from '@rev-source/atoms/Slider';
export * from '@rev-source/atoms/Spinner';
export * from '@rev-source/atoms/SteppedProgressBar';
export * from '@rev-source/atoms/Switch';
export * from '@rev-source/atoms/Tabs';
export * from '@rev-source/atoms/Tag';
export * from '@rev-source/atoms/Text';
export * from '@rev-source/atoms/TextArea';
export * from '@rev-source/atoms/TextInput';
export * from '@rev-source/atoms/TimeInput';
export * from '@rev-source/atoms/ToggleButton';
export * from '@rev-source/atoms/ToggleGroup';
export * from '@rev-source/molecules/EmbeddedVideoPlayer/EmbeddedVideoPlayer';

// ─── Molecules ─────────────────────────────────────────────────────────────
export * from '@rev-source/molecules/Accordion';
export * from '@rev-source/molecules/ActionMenu';
export * from '@rev-source/molecules/BankInfo/BankInfo';
export * from '@rev-source/molecules/Carousel';
export * from '@rev-source/molecules/ContentSlider';
export * from '@rev-source/molecules/Drawer';
export * from '@rev-source/molecules/Dropdown';
export * from '@rev-source/molecules/Form';
export * from '@rev-source/molecules/Kanban/KanbanBoard';
export * from '@rev-source/molecules/Lightbox';
export * from '@rev-source/molecules/LoadingPage';
export * from '@rev-source/molecules/NavigationMenu';
export * from '@rev-source/molecules/OldAddressInput';
export * from '@rev-source/molecules/OrderFooter';
export * from '@rev-source/molecules/Pagination';
export * from '@rev-source/molecules/Popover';
export * from '@rev-source/molecules/Popup';
export * from '@rev-source/molecules/RichDescription';
export * from '@rev-source/molecules/SearchInput';
export * from '@rev-source/molecules/Sheet';
export * from '@rev-source/molecules/Table/Table';
export * from '@rev-source/molecules/TitleGroup';
export * from '@rev-source/molecules/ToggleCard/ToggleCard';
export * from '@rev-source/molecules/ToggleCard/ToggleCardDescriptionBlock';
export * from '@rev-source/molecules/ToggleCard/ToggleCardGroup';
export * from '@rev-source/molecules/ToggleCard/ToggleCardHeader';
export * from '@rev-source/molecules/ToggleCard/ToggleCardRadioContent';
export * from '@rev-source/molecules/Tooltip/ContentWithTooltip';
export * from '@rev-source/molecules/Tooltip/Tooltip';
export * from '@rev-source/molecules/TopBar';

// Toast: re-export types and provider, but NOT the bare toast function
// (the compat toast from ./compat supports both old and new API)
export {
  ToastProvider,
  Toast,
  type ToastVariant,
  type ToastContent,
  type ToastOptions,
  type ToastPlacement,
  type ToastProviderProps,
  type ToastProps,
} from '@rev-source/molecules/Toast';

// ─── Types ──────────────────────────────────────────────────────────────
export * from '@rev-source/_constants/types';

// ─── Hooks ──────────────────────────────────────────────────────────────
export * from '@rev-source/hooks/useAsyncDebounce';
export * from '@rev-source/hooks/useDebouncedValue';
export * from '@rev-source/hooks/useSizeClass';

// ─── Icons ──────────────────────────────────────────────────────────────
export { default as CheckCircleFilled16 } from '@rev-source/icons/CheckCircleFilled16';
export * from '@rev-source/icons/DraftCircleFilled16';
export * from '@rev-source/icons/HiddenCircleFilled16';
export { default as InfoCircleFilled14 } from '@rev-source/icons/InfoCircleFilled14';
export * from '@rev-source/icons/MediaPlaceholder22';
export * from '@rev-source/icons/RightChevron';
export { default as SuccessGraphic } from '@rev-source/icons/SuccessGraphic';
export * from '@rev-source/icons/WarningIcon';

// ─── Utils ──────────────────────────────────────────────────────────────
export * from '@rev-source/utils/viewTransitionHelper';

// ─── Prototype utilities ────────────────────────────────────────────────
export { useMediaQuery, ViewportWidthContext } from './useMediaQuery';
export { NotesProvider, Note, NotesToggle } from './PrototypeNotes';

// ─── Prototype compat (toast.success/error/info, ToastContainer, AccordionSection)
export { toast, ToastContainer, AccordionSection } from './compat';
