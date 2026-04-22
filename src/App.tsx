import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { ToastContainer } from './rev';
import { SandboxLauncher } from './sandbox/SandboxLauncher';
import { PrototypesIndex } from './prototypes/PrototypesIndex';

// Lazy-load app shells so import failures in one don't block the other.
// e.g. if AdminRouter has a stale import, Carthage still renders fine.
const AdminShell = lazy(() => import('./shells/admin/AdminShell').then(m => ({ default: m.AdminShell })));
const CarthageShell = lazy(() => import('./shells/carthage/CarthageShell').then(m => ({ default: m.CarthageShell })));

// Standalone prototype imports (legacy routes)
import { FeesPrototype } from './prototypes/fees/FeesPrototype';
import { IncludedUpgradesPrototype } from './prototypes/included-upgrades/IncludedUpgradesPrototype';
import { TagsPrototype } from './prototypes/inventory-tags/TagsPrototype';
import { Prop65Prototype } from './prototypes/prop65/Prop65Prototype';
import { RecallsPrototype } from './prototypes/recalls/RecallsPrototype';

function App() {
  return (
    <>
      <Routes>
        {/* Sandbox launcher */}
        <Route path="/" element={<SandboxLauncher />} />

        {/* Carthage shell: dealer website (SRP + VDP) */}
        <Route path="/carthage/*" element={
          <Suspense fallback={<div>Loading Carthage...</div>}>
            <CarthageShell />
          </Suspense>
        } />

        {/* Admin shell as catch-all: production components navigate to absolute
            paths like /${spId}/orders/all, so the shell must mount at root.
            React Router ranks more-specific routes higher, so /prototypes/*
            still matches before the splat. */}
        <Route path="*" element={
          <Suspense fallback={<div>Loading Admin Portal...</div>}>
            <AdminShell />
          </Suspense>
        } />

        {/* Standalone prototype listing */}
        <Route path="/prototypes" element={<PrototypesIndex />} />

        {/* Individual prototype routes (legacy, still work) */}
        <Route path="/prototypes/fees" element={<FeesPrototype />} />
        <Route path="/prototypes/included-upgrades" element={<IncludedUpgradesPrototype />} />
        <Route path="/prototypes/inventory-tags" element={<TagsPrototype />} />
        <Route path="/prototypes/prop65" element={<Prop65Prototype />} />
        <Route path="/prototypes/recalls" element={<RecallsPrototype />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
