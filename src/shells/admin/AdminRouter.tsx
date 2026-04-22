/**
 * AdminRouter: Routes to production page components.
 *
 * Uses a Routes-based router (compatible with BrowserRouter in main.tsx)
 * that imports the real production page components from the monorepo.
 * Auth guards are stubbed via Vite aliases, data comes from MSW.
 *
 * Routes use :servicesProviderId as a dynamic param so production hooks
 * (useCurrentServicesProviderId, useCurrentServicesProvider, etc.) work
 * correctly via useParams().
 */

import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { PRIMARY_SP_ID } from '../../sandbox/fixtures/dealers';

// Production layout components (AppLayout imports AppSideNav + AppTopBar)
import { AppLayout } from '@app/components/AppLayout';

// Production page components
import InventoryPage from '@pages/routes/inventory';
import OrdersPage from '@pages/routes/orders';
import LeadsPage from '@pages/routes/leads';
import ConversationsPage from '@pages/routes/conversations';
import PreordersPage from '@pages/routes/preorders';
import DiscountsPage from '@pages/routes/discounts';
import AnalyticsPage from '@pages/routes/analytics';
import ReportsPage from '@pages/routes/reports';
import ReportsOrdersPage from '@pages/routes/reports_orders';
import ReportsPaymentsPage from '@pages/routes/reports_payment_reconciliation';
import UsagePage from '@pages/routes/usage';
import PlanDetails from '@pages/routes/plan_details';
import SettingsPage from '@pages/routes/settings';
import AccessoriesPage from '@pages/routes/accessories';

// Settings sub-pages — layouts
import AccountSettingsLayout from '@pages/routes/settings/layouts/AccountSettingsLayout';
import PersonalSettingsLayout from '@pages/routes/settings/layouts/PersonalSettingsLayout';
import ProductSettingsLayout from '@pages/routes/settings/layouts/ProductSettingsLayout';
import ResourceSettingsLayout from '@pages/routes/settings/layouts/ResourceSettingsLayout';

// Settings sub-pages — production feature components
import { PersonalSettingsPage } from '@features/personal-settings/components/PersonalSettingsPage';
import { BusinessDetailsForms } from '@features/account-management/components/business-details-forms/BusinessDetailsForms';
import { BankAccountForm } from '@features/account-management/components/bank-account/BankAccountForm';
import { ConfigMgmtWithFees } from './ConfigMgmtWithFees';
import { WebsiteSettingsPage } from '@features/website/components/WebsiteSettingsPage';
import { SalesAgentSettingsPage } from '@features/sales-agent/components/SalesAgentSettingsPage';
import { IntegrationsSettingsPage } from '@features/integrations/components/IntegrationsSettingsPage';
import { InventorySettingsPage } from '@features/inventory/components/InventorySettingsPage';
import { KnowledgeSettingsPage } from '@features/knowledge/KnowledgeSettingsPage';

export function AdminRouter(): ReactNode {
  return (
    <Routes>
      {/* All SP-scoped routes nest under :servicesProviderId so useParams() works */}
      <Route path=":servicesProviderId" element={<AppLayout />}>
        {/* Default: redirect bare /:spId to orders */}
        <Route index element={<Navigate to="orders/all" replace />} />

        {/* Orders */}
        <Route path="orders" element={<Navigate to="all" replace />} />
        <Route path="orders/:tabId" element={<OrdersPage />}>
          <Route index element={null} />
          <Route path=":orderId/:detailsTab" element={null} />
        </Route>

        {/* Preorders */}
        <Route path="preorders" element={<Navigate to="all" replace />} />
        <Route path="preorders/:tabId" element={<PreordersPage />}>
          <Route index element={null} />
          <Route path=":preorderId/:detailsTab" element={null} />
        </Route>

        {/* Inventory */}
        <Route path="inventory" element={<InventoryPage />}>
          <Route index element={null} />
          <Route path=":inventoryItemId/:tab" element={null} />
        </Route>

        {/* Accessories */}
        <Route path="inventory/accessories" element={<AccessoriesPage />}>
          <Route index element={null} />
          <Route path=":accessoryId/:tab" element={null} />
        </Route>

        {/* Discounts */}
        <Route path="discounts" element={<Navigate to="all" replace />} />
        <Route path="discounts/:tabId" element={<DiscountsPage />}>
          <Route index element={null} />
          <Route path=":discountId/:detailsTab" element={null} />
        </Route>

        {/* Leads */}
        <Route path="leads" element={<Navigate to="all/table" replace />} />
        <Route path="leads/:tabId" element={<LeadsPage />}>
          <Route index element={null} />
          <Route path=":viewType" element={null} />
          <Route path=":leadId/:detailsTab" element={null} />
        </Route>

        {/* Conversations */}
        <Route path="conversations" element={<ConversationsPage />}>
          <Route index element={null} />
          <Route path=":conversationId" element={null} />
        </Route>

        {/* Analytics */}
        <Route path="analytics" element={<AnalyticsPage />} />

        {/* Reports */}
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/orders" element={<ReportsOrdersPage />} />
        <Route path="reports/payments" element={<ReportsPaymentsPage />} />

        {/* Usage */}
        <Route path="usage" element={<UsagePage />} />

        {/* Plan Details */}
        <Route path="plan-details" element={<PlanDetails />} />

        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/personal" element={<PersonalSettingsLayout />}>
          <Route path="details" element={<PersonalSettingsPage />} />
        </Route>
        <Route path="settings/account" element={<AccountSettingsLayout />}>
          <Route path="business-details" element={<BusinessDetailsForms />} />
          <Route path="bank-account" element={<BankAccountForm />} />
          <Route path="team" element={null} />
        </Route>
        <Route path="settings/products" element={<ProductSettingsLayout />}>
          <Route path="website" element={<ConfigMgmtWithFees />} />
          <Route path="website-page" element={<WebsiteSettingsPage />} />
          <Route path="sales-agent" element={<SalesAgentSettingsPage />} />
        </Route>
        <Route path="settings/resource" element={<ResourceSettingsLayout />}>
          <Route path="integrations" element={<IntegrationsSettingsPage />} />
          <Route path="inventory" element={<InventorySettingsPage />} />
          <Route path="knowledge/*" element={<KnowledgeSettingsPage />} />
        </Route>

        {/* Catch-all within SP scope */}
        <Route path="*" element={<Navigate to="orders/all" replace />} />
      </Route>

      {/* Fallback: redirect unknown paths to the default SP's orders page */}
      <Route path="*" element={<Navigate to={`/${PRIMARY_SP_ID}/orders/all`} replace />} />
    </Routes>
  );
}
