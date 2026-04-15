/**
 * AdminTopBar: Recreates the Admin Portal top bar using Rev TopBar component.
 */

import type { ReactNode } from 'react';

import { TopBar, Button, Group } from '../../rev';
import { PRIMARY_DEALER, MOCK_DEALERS } from '../../sandbox/fixtures';

interface AdminTopBarProps {
  onToggleSideNav: () => void;
}

export function AdminTopBar({ onToggleSideNav }: AdminTopBarProps): ReactNode {
  const accountOptions = MOCK_DEALERS.map(dealer => ({
    label: dealer.id === PRIMARY_DEALER.id ? `\u2713 ${dealer.name}` : dealer.name,
    ariaLabel: `Switch to ${dealer.name}`,
    onPress: () => {},
  }));

  const topBarItems = [
    {
      id: 'accounts',
      location: 'right-side' as const,
      data: {
        type: 'DROPDOWN' as const,
        icon: null,
        label: PRIMARY_DEALER.name,
        ariaLabel: 'Switch Account',
        options: accountOptions,
      },
    },
  ];

  return (
    <TopBar
      className="admin-top-bar"
      onLogoClick={() => {}}
      items={topBarItems}
      leftOfLogoContent={
        <Group itemsSpacing="8" itemsAlignY="center" noWrap>
          <Button
            ariaLabel="Toggle side navigation"
            variant="secondary"
            size="medium"
            icon={<SplitBoxIcon />}
            onPress={onToggleSideNav}
          />
        </Group>
      }
    />
  );
}

/** Simple split-box icon matching the production SplitBox24 */
function SplitBoxIcon(): ReactNode {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
