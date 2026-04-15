/**
 * ConversationsPlaceholder: Shows a 3-column conversations layout.
 */

import type { ReactNode } from 'react';
import { Stack, Text, Badge, Card, Divider } from '../../../rev';
import { MOCK_CONVERSATIONS } from '../../../sandbox/fixtures';

export function ConversationsPlaceholder(): ReactNode {
  const selectedConvo = MOCK_CONVERSATIONS[0];

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 120px)', margin: '-24px' }}>
      {/* Conversation list (left panel) */}
      <div style={{ width: 320, borderRight: '1px solid var(--rev-color-controlOutline)', overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '16px' }}>
          <Text size="body" weight="bold">Sales Agent Inbox</Text>
        </div>
        <Divider />
        {MOCK_CONVERSATIONS.map(convo => (
          <div
            key={convo.id}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--rev-color-controlOutline)',
              backgroundColor: convo.id === selectedConvo.id ? 'var(--rev-color-backgroundSecondary)' : undefined,
              cursor: 'pointer',
            }}
          >
            <Stack itemsSpacing="4">
              <Text size="bodySmall" weight="semibold">{convo.buyerName}</Text>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Text size="bodySmall" color="secondary">
                  {convo.messages[convo.messages.length - 1]?.content.slice(0, 60)}...
                </Text>
              </div>
              <Badge appearance={convo.status === 'active' ? 'positive' : 'neutral'} size="small">{convo.channel}</Badge>
            </Stack>
          </div>
        ))}
      </div>

      {/* Message thread (center panel) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--rev-color-controlOutline)' }}>
          <Text size="body" weight="bold">{selectedConvo.buyerName}</Text>
          <Text size="bodySmall" color="secondary">{selectedConvo.subject}</Text>
        </div>
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          <Stack itemsSpacing="12">
            {selectedConvo.messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  maxWidth: '70%',
                  alignSelf: msg.sender === 'buyer' ? 'flex-start' : 'flex-end',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Card>
                  <Stack itemsSpacing="4" padding={{ all: 12 }}>
                    <Text size="bodySmall" weight="semibold" color="secondary">{msg.senderName}</Text>
                    <Text size="bodySmall">{msg.content}</Text>
                  </Stack>
                </Card>
              </div>
            ))}
          </Stack>
        </div>
      </div>

      {/* Contact info (right panel) */}
      <div style={{ width: 260, borderLeft: '1px solid var(--rev-color-controlOutline)', padding: '16px', flexShrink: 0 }}>
        <Stack itemsSpacing="16">
          <Text size="body" weight="bold">Contact</Text>
          <Stack itemsSpacing="8">
            <Text size="bodySmall" weight="semibold">{selectedConvo.buyerName}</Text>
            <Text size="bodySmall" color="secondary">Lead: {selectedConvo.leadId}</Text>
            <Text size="bodySmall" color="secondary">Channel: {selectedConvo.channel}</Text>
          </Stack>
        </Stack>
      </div>
    </div>
  );
}
