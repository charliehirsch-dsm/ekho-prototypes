/**
 * CarthageRouter: Routes for the Carthage prototype shell.
 *
 * Production Carthage uses createBrowserRouter (incompatible with the
 * prototype's BrowserRouter), so we use Routes/Route like AdminRouter.
 *
 * Routes:
 *   /carthage           -> SRP (SearchResultsPage)
 *   /carthage/listings/:id -> VDP (VehicleDetailsPage)
 *
 * All routes are wrapped in the production AppLayout which provides
 * TopBarLayout + StoreFooter + GlobalModals.
 *
 * NOTE: We use @carthage/ prefixed imports (not @pages/@common) because
 * these shell files live in the prototype project, not in apps/carthage/src.
 * The scoped alias plugin only activates for files inside CARTHAGE_SRC.
 */

import { Routes, Route } from 'react-router-dom';

import type { ReactNode } from 'react';

import AppLayout from '@carthage/pages/layout/AppLayout';
import SearchResultsPage from '@carthage/pages/routes/search-results/index';
import VehicleDetailsPage from '@carthage/pages/routes/vehicle-details/index';

export function CarthageRouter(): ReactNode {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<SearchResultsPage />} />
        <Route path="listings/:id" element={<VehicleDetailsPage />} />
      </Route>
    </Routes>
  );
}
