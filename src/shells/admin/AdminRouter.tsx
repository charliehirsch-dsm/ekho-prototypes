/**
 * AdminRouter: Mirrors the production Admin Portal router structure.
 * All routes use placeholder pages instead of real page components.
 */

import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { PRIMARY_SP_ID } from '../../sandbox/fixtures';

// Page placeholders
import { OrdersPlaceholder } from './pages/OrdersPlaceholder';
import { InventoryPlaceholder } from './pages/InventoryPlaceholder';
import { LeadsPlaceholder } from './pages/LeadsPlaceholder';
import { ConversationsPlaceholder } from './pages/ConversationsPlaceholder';
import { PreordersPlaceholder } from './pages/PreordersPlaceholder';
import { DiscountsPlaceholder } from './pages/DiscountsPlaceholder';
import { AnalyticsPlaceholder } from './pages/AnalyticsPlaceholder';
import { ReportsPlaceholder } from './pages/ReportsPlaceholder';
import { UsagePlaceholder } from './pages/UsagePlaceholder';
import { SettingsPlaceholder } from './pages/SettingsPlaceholder';
import { PlanDetailsPlaceholder } from './pages/PlanDetailsPlaceholder';
import { GenericPlaceholder } from './pages/GenericPlaceholder';

interface AdminRouterProps {
  layout: ReactNode;
}

export function AdminRouter({ layout }: AdminRouterProps): ReactNode {
  const sp = PRIMARY_SP_ID;

  return (
    <Routes>
      {/* Default redirect to orders */}
      <Route index element={<Navigate to={`${sp}/orders/all`} replace />} />

      {/* Main layout with sidebar + topbar wrapping all portal routes */}
      <Route element={layout}>
        {/* Orders */}
        <Route path={`${sp}/orders`} element={<Navigate to={`/admin/${sp}/orders/all`} replace />} />
        <Route path={`${sp}/orders/:tabId`} element={<OrdersPlaceholder />} />
        <Route path={`${sp}/orders/:tabId/:orderId/:detailsTab`} element={<OrdersPlaceholder />} />

        {/* Preorders */}
        <Route path={`${sp}/preorders`} element={<Navigate to={`/admin/${sp}/preorders/all`} replace />} />
        <Route path={`${sp}/preorders/:tabId`} element={<PreordersPlaceholder />} />
        <Route path={`${sp}/preorders/:tabId/:preorderId/:detailsTab`} element={<PreordersPlaceholder />} />

        {/* Inventory */}
        <Route path={`${sp}/inventory`} element={<InventoryPlaceholder />} />
        <Route path={`${sp}/inventory/:inventoryItemId/:tab`} element={<InventoryPlaceholder />} />
        <Route path={`${sp}/inventory/accessories`} element={<GenericPlaceholder title="Accessories" />} />
        <Route path={`${sp}/inventory/accessories/:accessoryId/:tab`} element={<GenericPlaceholder title="Accessory Detail" />} />

        {/* Discounts */}
        <Route path={`${sp}/discounts`} element={<Navigate to={`/admin/${sp}/discounts/all`} replace />} />
        <Route path={`${sp}/discounts/:tabId`} element={<DiscountsPlaceholder />} />
        <Route path={`${sp}/discounts/:tabId/:discountId/:detailsTab`} element={<DiscountsPlaceholder />} />

        {/* Leads */}
        <Route path={`${sp}/leads`} element={<Navigate to={`/admin/${sp}/leads/all/table`} replace />} />
        <Route path={`${sp}/leads/:tabId`} element={<LeadsPlaceholder />} />
        <Route path={`${sp}/leads/:tabId/:viewType`} element={<LeadsPlaceholder />} />
        <Route path={`${sp}/leads/:tabId/:leadId/:detailsTab`} element={<LeadsPlaceholder />} />

        {/* Conversations */}
        <Route path={`${sp}/conversations`} element={<ConversationsPlaceholder />} />
        <Route path={`${sp}/conversations/:conversationId`} element={<ConversationsPlaceholder />} />

        {/* Analytics */}
        <Route path={`${sp}/analytics`} element={<AnalyticsPlaceholder />} />

        {/* Reports */}
        <Route path={`${sp}/reports`} element={<ReportsPlaceholder />} />
        <Route path={`${sp}/reports/orders`} element={<GenericPlaceholder title="Reports: Orders" />} />
        <Route path={`${sp}/reports/payments`} element={<GenericPlaceholder title="Reports: Payments" />} />

        {/* Usage */}
        <Route path={`${sp}/usage`} element={<UsagePlaceholder />} />

        {/* Plan Details */}
        <Route path={`${sp}/plan-details`} element={<PlanDetailsPlaceholder />} />

        {/* Settings */}
        <Route path={`${sp}/settings`} element={<SettingsPlaceholder />} />
        <Route path={`${sp}/settings/personal/*`} element={<GenericPlaceholder title="Personal Settings" />} />
        <Route path={`${sp}/settings/account/*`} element={<GenericPlaceholder title="Account Settings" />} />
        <Route path={`${sp}/settings/products/*`} element={<GenericPlaceholder title="Product Settings" />} />
        <Route path={`${sp}/settings/resource/*`} element={<GenericPlaceholder title="Resource Settings" />} />

        {/* Catch-all */}
        <Route path="*" element={<GenericPlaceholder title="Page Not Found" />} />
      </Route>
    </Routes>
  );
}
