import { Routes, Route } from 'react-router-dom';

import { ToastContainer } from './rev';
import { SandboxLauncher } from './sandbox/SandboxLauncher';
import { PrototypesIndex } from './prototypes/PrototypesIndex';
import { AdminShell } from './shells/admin/AdminShell';

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

        {/* App shells */}
        <Route path="/admin/*" element={<AdminShell />} />
        {/* Future shells:
        <Route path="/checkout/*" element={<CheckoutShell />} />
        <Route path="/buyer/*" element={<BuyerShell />} />
        <Route path="/carthage/*" element={<CarthageShell />} />
        <Route path="/grader/*" element={<GraderShell />} />
        <Route path="/ops/*" element={<OpsShell />} />
        <Route path="/ai-agent/*" element={<AIAgentShell />} />
        <Route path="/corporate/*" element={<CorporateShell />} />
        */}

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
