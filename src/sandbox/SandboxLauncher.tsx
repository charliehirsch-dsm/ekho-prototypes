/**
 * SandboxLauncher: Landing page for the Ekho Sandbox.
 * Lets you pick which app shell to load, which user role to simulate,
 * and which data scenario to use.
 */

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';

import {
  Stack, Group, Text, Card, Button, Badge, Divider, RadioGroup,
} from '../rev';

const SHELLS = [
  { id: 'admin', name: 'Admin Portal', description: 'Dealer dashboard: orders, inventory, leads, settings', status: 'ready' as const, route: '/admin' },
  { id: 'checkout', name: 'Checkout', description: 'Buyer-facing purchase flow: browse, configure, buy', status: 'planned' as const, route: '/checkout' },
  { id: 'buyer', name: 'Buyer Portal', description: 'Post-purchase portal: order status, documents, payments', status: 'planned' as const, route: '/buyer' },
  { id: 'carthage', name: 'Carthage', description: 'Dealer website: vehicle search, VDP, prequalification', status: 'planned' as const, route: '/carthage' },
  { id: 'grader', name: 'Grader', description: 'Trade-in grading tool: scan, analyze, results', status: 'planned' as const, route: '/grader' },
  { id: 'ops', name: 'Ops Portal', description: 'Internal operations dashboard', status: 'planned' as const, route: '/ops' },
  { id: 'ai-agent', name: 'AI Sales Agent', description: 'Chat widget that embeds on dealer sites', status: 'planned' as const, route: '/ai-agent' },
  { id: 'corporate', name: 'Corporate Website', description: 'Marketing site: homepage, OEM/dealer landing pages', status: 'planned' as const, route: '/corporate' },
] as const;

const ROLES = [
  { value: 'dealer_admin', label: 'Dealer Admin' },
  { value: 'dealer_user', label: 'Dealer User' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'ops_admin', label: 'Ops Admin' },
] as const;

const SCENARIOS = [
  { value: 'activeDealer', label: 'Active Dealer', description: 'Inventory, orders, leads' },
  { value: 'emptyStore', label: 'Empty Store', description: 'New dealer, no data' },
  { value: 'highVolume', label: 'High Volume', description: 'Enterprise dealer' },
] as const;

function ShellCard({ shell, onLaunch }: { shell: typeof SHELLS[number]; onLaunch: () => void }): ReactNode {
  const isReady = shell.status === 'ready';

  return (
    <Card>
      <Stack itemsSpacing="12" padding={{ all: 20 }}>
        <Group itemsSpacing="8" itemsAlignY="center">
          <Text size="body" weight="bold">{shell.name}</Text>
          <Badge appearance={isReady ? 'positive' : 'neutral'}>{isReady ? 'Ready' : 'Planned'}</Badge>
        </Group>
        <Text size="bodySmall" color="secondary">{shell.description}</Text>
        <Button
          size="small"
          variant={isReady ? 'filled' : 'secondary'}
          isDisabled={!isReady}
          onPress={onLaunch}
        >
          {isReady ? 'Launch' : 'Coming Soon'}
        </Button>
      </Stack>
    </Card>
  );
}

export function SandboxLauncher(): ReactNode {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('dealer_admin');
  const [selectedScenario, setSelectedScenario] = useState('activeDealer');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
      <Stack itemsSpacing="32">
        {/* Header */}
        <Stack itemsSpacing="8">
          <Text size="title200" weight="bold">Ekho Sandbox</Text>
          <Text size="body" color="secondary">
            Launch any Ekho app shell with mock data. Pick a shell, choose your role and scenario, then start prototyping.
          </Text>
        </Stack>

        {/* Configuration */}
        <Group itemsSpacing="24">
          <Group.Item grow>
            <Stack itemsSpacing="8">
              <Text size="bodySmall" weight="semibold" color="secondary">USER ROLE</Text>
              <RadioGroup
                value={selectedRole}
                onChange={(v) => setSelectedRole(v)}
                items={ROLES.map(r => ({ value: r.value, label: r.label }))}
              />
            </Stack>
          </Group.Item>
          <Group.Item grow>
            <Stack itemsSpacing="8">
              <Text size="bodySmall" weight="semibold" color="secondary">DATA SCENARIO</Text>
              <RadioGroup
                value={selectedScenario}
                onChange={(v) => setSelectedScenario(v)}
                items={SCENARIOS.map(s => ({ value: s.value, label: `${s.label} - ${s.description}` }))}
              />
            </Stack>
          </Group.Item>
        </Group>

        <Divider />

        {/* App Shells Grid */}
        <Stack itemsSpacing="12">
          <Text size="body" weight="semibold">App Shells</Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {SHELLS.map(shell => (
              <ShellCard
                key={shell.id}
                shell={shell}
                onLaunch={() => navigate(`${shell.route}?role=${selectedRole}&scenario=${selectedScenario}`)}
              />
            ))}
          </div>
        </Stack>

        <Divider />

        {/* Legacy Prototypes Link */}
        <Stack itemsSpacing="8">
          <Text size="body" weight="semibold">Standalone Prototypes</Text>
          <Text size="bodySmall" color="secondary">
            Feature prototypes that run without a shell context.
          </Text>
          <Button size="small" variant="secondary" onPress={() => navigate('/prototypes')}>
            View Prototypes
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}
