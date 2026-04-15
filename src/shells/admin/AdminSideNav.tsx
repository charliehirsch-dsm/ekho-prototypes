/**
 * AdminSideNav: Recreates the Admin Portal side navigation using Rev NavigationMenu.
 * Mirrors the production AppSideNav with the same sections and items.
 */

import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  NavigationMenu,
  NavigationMenuButton,
  type NavigationMenuItem,
} from '../../rev';

import { PRIMARY_SP_ID } from '../../sandbox/fixtures';

/** Navigation item definitions matching production sections */
const NAV_SECTIONS = [
  {
    title: 'SALES',
    items: [
      { id: 'orders', label: 'Orders', icon: <NavIcon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />, basePath: 'orders' },
      { id: 'preorders', label: 'Preorders', icon: <NavIcon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />, basePath: 'preorders' },
      { id: 'inventory', label: 'Inventory', icon: <NavIcon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />, basePath: 'inventory', hasSubmenu: true },
      { id: 'discounts', label: 'Discounts', icon: <NavIcon d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />, basePath: 'discounts' },
    ],
  },
  {
    title: 'LEADS',
    items: [
      { id: 'leads', label: 'CRM', icon: <NavIcon d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />, basePath: 'leads' },
      { id: 'conversations', label: 'Sales Agent', icon: <NavIcon d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />, basePath: 'conversations' },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { id: 'reports', label: 'Reports', icon: <NavIcon d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />, basePath: 'reports' },
      { id: 'usage', label: 'Usage', icon: <NavIcon d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />, basePath: 'usage' },
      { id: 'analytics', label: 'Analytics', icon: <NavIcon d="M3 3v18h18M9 17V9m4 8V5m4 12v-4" />, basePath: 'analytics' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'plan-details', label: 'Plan Details', icon: <NavIcon d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />, basePath: 'plan-details' },
      { id: 'settings', label: 'Settings', icon: <NavIcon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />, basePath: 'settings' },
    ],
  },
] as const;

interface AdminSideNavProps {
  isOpen: boolean;
}

export function AdminSideNav({ isOpen }: AdminSideNavProps): ReactNode {
  const navigate = useNavigate();
  const location = useLocation();
  const spId = PRIMARY_SP_ID;

  const isSelected = useCallback(
    (basePath: string): boolean => {
      const fullPath = `/admin/${spId}/${basePath}`;
      return location.pathname === fullPath || location.pathname.startsWith(`${fullPath}/`);
    },
    [spId, location.pathname],
  );

  const menuItems = useMemo((): NavigationMenuItem[] => {
    const items: NavigationMenuItem[] = [];

    NAV_SECTIONS.forEach((section, sectionIdx) => {
      items.push({ type: 'title', title: section.title });

      section.items.forEach(item => {
        if ('hasSubmenu' in item && item.hasSubmenu) {
          const inventoryPath = `/admin/${spId}/inventory`;
          const accessoriesPath = `/admin/${spId}/inventory/accessories`;
          const isOnAccessories = location.pathname.startsWith(accessoriesPath);
          const isOnVehicles = location.pathname.startsWith(inventoryPath) && !isOnAccessories;

          items.push({
            type: 'group',
            title: item.label,
            icon: item.icon,
            items: [
              <NavigationMenuButton
                key="vehicles"
                isSelected={isOnVehicles}
                onPress={() => navigate(`/admin/${spId}/inventory`)}
              >
                Vehicles
              </NavigationMenuButton>,
              <NavigationMenuButton
                key="accessories"
                isSelected={isOnAccessories}
                onPress={() => navigate(`/admin/${spId}/inventory/accessories`)}
              >
                Accessories
              </NavigationMenuButton>,
            ],
          });
          return;
        }

        items.push({
          type: 'button',
          button: (
            <NavigationMenuButton
              icon={item.icon}
              isSelected={isSelected(item.basePath)}
              onPress={() => navigate(`/admin/${spId}/${item.basePath}`)}
            >
              {item.label}
            </NavigationMenuButton>
          ),
        });
      });

      if (sectionIdx < NAV_SECTIONS.length - 1) {
        items.push({ type: 'divider' });
      }
    });

    return items;
  }, [isSelected, navigate, spId, location.pathname]);

  return (
    <nav className={`admin-side-nav ${!isOpen ? 'admin-side-nav--closed' : ''}`}>
      <div className="admin-side-nav-content">
        <NavigationMenu items={menuItems} itemsSpacing="2" ariaLabel="Main navigation" />
      </div>
    </nav>
  );
}

/** Lightweight SVG icon wrapper for nav items */
function NavIcon({ d }: { d: string }): ReactNode {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
