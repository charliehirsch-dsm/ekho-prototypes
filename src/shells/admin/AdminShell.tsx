/**
 * AdminShell: Recreates the Admin Portal layout using Rev components.
 * Provides the sidebar + topbar + content area shell for prototyping.
 */

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { SandboxProviders } from '../../sandbox/providers/SandboxProviders';
import { AdminSideNav } from './AdminSideNav';
import { AdminTopBar } from './AdminTopBar';
import { AdminRouter } from './AdminRouter';

import './AdminShell.scss';

function AdminLayout(): ReactNode {
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);

  return (
    <div className="admin-layout">
      <AdminTopBar onToggleSideNav={() => setIsSideNavOpen(prev => !prev)} />
      <div className="admin-body">
        <AdminSideNav isOpen={isSideNavOpen} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminShell(): ReactNode {
  return (
    <SandboxProviders initialRole="dealer_admin">
      <AdminRouter layout={<AdminLayout />} />
    </SandboxProviders>
  );
}
