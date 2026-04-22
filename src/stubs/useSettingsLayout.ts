/**
 * Stub: useSettingsLayout
 *
 * Production version uses useMatches() which requires createBrowserRouter.
 * This stub reads the URL path to determine the current settings section
 * and returns the same interface.
 */

import { useLocation, useNavigate } from 'react-router-dom';

import { useCurrentServicesProviderId } from '@common/hooks/useCurrentServicesProviderId';
import { useProductGating } from '@common/hooks/useProductGating';
import { paths } from '@config/paths';

import type { BreadcrumbItem } from '@ekhodealer/ekho-common/rev';

export interface SettingsRouteHandle {
  settingsTitle?: string;
  section?: string;
  trailingContent?: 'program-selector' | 'activation-status';
  useTableLayout?: boolean;
  hardRedirectWhenLocked?: boolean;
}

export interface GatedSettingsRouteHandle extends SettingsRouteHandle {
  section: string;
}

/**
 * Map URL path segments to settings metadata.
 * Production gets this from route handle objects; we derive it from the URL.
 */
const SETTINGS_SECTIONS: Record<string, { title: string; section: string; handle?: Partial<SettingsRouteHandle> }> = {
  'personal': { title: 'Personal', section: 'personal/details' },
  'account': { title: 'Account', section: 'account/business-details' },
  'products': { title: 'Products', section: 'products/website' },
  'resource': { title: 'Resources', section: 'resource/integrations' },
};

const SETTINGS_SUBSECTIONS: Record<string, { title: string; section: string; handle?: Partial<SettingsRouteHandle> }> = {
  'details': { title: 'Personal Details', section: 'personal/details' },
  'business-details': { title: 'Business Details', section: 'account/business-details' },
  'bank-account': { title: 'Bank Account', section: 'account/bank-account' },
  'team': { title: 'Team', section: 'account/team', handle: { useTableLayout: true } },
  'website': { title: 'Sales', section: 'products/website' },
  'website-page': { title: 'Website', section: 'products/website-page' },
  'sales-agent': { title: 'Sales Agent', section: 'products/sales-agent', handle: { trailingContent: 'activation-status' } },
  'integrations': { title: 'Integrations', section: 'resource/integrations' },
  'inventory': { title: 'Inventory', section: 'resource/inventory' },
  'knowledge': { title: 'Knowledge', section: 'resource/knowledge' },
};

export function useSettingsLayout(): {
  spId: string;
  title: string | undefined;
  section: string | undefined;
  handle: SettingsRouteHandle | undefined;
  breadcrumbItems: BreadcrumbItem[];
  isLocked: boolean;
  gatedModuleId: string | undefined;
} {
  const spId = useCurrentServicesProviderId();
  const navigate = useNavigate();
  const location = useLocation();
  const { getSettingsSectionGate } = useProductGating();

  // Parse settings path: /:spId/settings/:category/:subsection
  const segments = location.pathname.split('/').filter(Boolean);
  const settingsIdx = segments.indexOf('settings');
  const category = settingsIdx >= 0 ? segments[settingsIdx + 1] : undefined;
  const subsection = settingsIdx >= 0 ? segments[settingsIdx + 2] : undefined;

  // Find matching metadata
  const subMatch = subsection ? SETTINGS_SUBSECTIONS[subsection] : undefined;
  const catMatch = category ? SETTINGS_SECTIONS[category] : undefined;
  const match = subMatch ?? catMatch;

  const title = match?.title;
  const section = match?.section;
  const handle: SettingsRouteHandle | undefined = match
    ? { settingsTitle: title, section, ...match.handle }
    : undefined;

  const { locked: isLocked, moduleId: gatedModuleId } = section
    ? getSettingsSectionGate(section as never)
    : { locked: false, moduleId: undefined };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: 'settings',
      label: 'Settings',
      onActivate: () => navigate(paths.settings.getHref(spId)),
    },
    ...(title ? [{ id: 'section', label: title }] : []),
  ];

  return { spId, title, section, handle, breadcrumbItems, isLocked, gatedModuleId };
}
