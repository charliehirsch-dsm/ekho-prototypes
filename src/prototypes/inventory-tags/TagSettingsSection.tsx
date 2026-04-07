import { useState } from 'react';
import { Stack, Text, Group, Button, Callout, toast } from '../../rev';
import { INVENTORY_TAG_CATALOG } from './mock-data';
import type { InventoryTagKey } from './mock-data';

interface TagSetting {
  key: InventoryTagKey;
  customLabel: string;
  enabled: boolean;
}

function TagSettingRow({
  setting,
  defaultLabel,
  icon,
  description,
  onChange,
}: {
  setting: TagSetting;
  defaultLabel: string;
  icon: string;
  description: string;
  onChange: (updated: TagSetting) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr',
        gap: '12px',
        padding: '14px 16px',
        background: setting.enabled
          ? 'var(--rev-color-backgroundPrimary)'
          : 'var(--rev-color-backgroundSecondary)',
        borderRadius: 'var(--rev-borderRadius-10)',
        border: '1px solid var(--rev-color-separatorTertiary)',
        opacity: setting.enabled ? 1 : 0.5,
        transition: 'all var(--rev-duration-allegro)',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--rev-borderRadius-8)',
          background: setting.enabled
            ? 'var(--rev-color-accent5Light)'
            : 'var(--rev-color-backgroundTertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '18px',
            color: setting.enabled
              ? 'var(--rev-color-accent5Bold)'
              : 'var(--rev-color-textTertiary)',
          }}
        >
          {icon}
        </span>
      </div>

      {/* Content */}
      <Stack itemsSpacing="8">
        <Group itemsAlignX="space-between" itemsAlignY="center" noWrap>
          <Stack itemsSpacing="2">
            <Text size="bodySmall" weight="semibold">
              {defaultLabel}
            </Text>
            <Text size="footnote" color="tertiary">
              {description}
            </Text>
          </Stack>

          {/* Enable/disable toggle */}
          <button
            onClick={() =>
              onChange({ ...setting, enabled: !setting.enabled })
            }
            style={{
              width: '36px',
              height: '20px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              background: setting.enabled
                ? 'var(--rev-color-accent5Bold)'
                : 'var(--rev-color-backgroundTertiary)',
              transition: 'background var(--rev-duration-allegro)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: setting.enabled ? '18px' : '2px',
                transition: 'left var(--rev-duration-allegro)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            />
          </button>
        </Group>

        {/* Custom label input */}
        {setting.enabled && (
          <div>
            <Text
              size="footnote"
              color="secondary"
              weight="medium"
              as="label"
              style={{ display: 'block', marginBottom: '4px' }}
            >
              Display label
            </Text>
            <input
              type="text"
              value={setting.customLabel}
              placeholder={defaultLabel}
              onChange={(e) =>
                onChange({ ...setting, customLabel: e.target.value })
              }
              style={{
                width: '100%',
                fontFamily: 'var(--rev-fontFamily)',
                fontSize: '13px',
                lineHeight: '18px',
                padding: '8px 12px',
                borderRadius: 'var(--rev-borderRadius-10)',
                border: '1px solid var(--rev-color-separatorTertiary)',
                background: 'var(--rev-color-textInputBackground)',
                color: 'var(--rev-color-textPrimary)',
                outline: 'none',
                transition: 'border-color var(--rev-duration-allegro)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--rev-color-carbonGray)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor =
                  'var(--rev-color-separatorTertiary)';
              }}
            />
            {setting.customLabel && setting.customLabel !== defaultLabel && (
              <Text
                size="caption"
                color="tertiary"
                style={{ marginTop: '4px', display: 'block' }}
              >
                Default: {defaultLabel}
              </Text>
            )}
          </div>
        )}
      </Stack>
    </div>
  );
}

export function TagSettingsSection() {
  const [settings, setSettings] = useState<TagSetting[]>(
    INVENTORY_TAG_CATALOG.map((tag) => ({
      key: tag.key,
      customLabel: tag.label,
      enabled: true,
    }))
  );

  const [hasChanges, setHasChanges] = useState(false);

  function updateSetting(index: number, updated: TagSetting) {
    setSettings((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
    setHasChanges(true);
  }

  const enabledCount = settings.filter((s) => s.enabled).length;

  return (
    <Stack itemsSpacing="16">
      <Stack itemsSpacing="4">
        <Text size="body" weight="bold">
          Inventory Tags
        </Text>
        <Text size="bodySmall" color="secondary">
          Configure which tags are available and customize labels for your
          dealership. Shoppers see these as badges on listing cards and as
          filter options on the SRP.
        </Text>
      </Stack>

      <Callout
        variant="info"
        message={`${enabledCount} of 7 tags enabled. Disabled tags won't appear in the tag picker or on the SRP.`}
        appearance="outline"
      />

      <Stack itemsSpacing="8">
        {settings.map((setting, i) => {
          const def = INVENTORY_TAG_CATALOG.find((t) => t.key === setting.key)!;
          return (
            <TagSettingRow
              key={setting.key}
              setting={setting}
              defaultLabel={def.label}
              icon={def.icon}
              description={def.description}
              onChange={(updated) => updateSetting(i, updated)}
            />
          );
        })}
      </Stack>

      {hasChanges && (
        <Group itemsAlignX="end" itemsSpacing="8">
          <Button
            variant="secondary"
            onPress={() => {
              setSettings(
                INVENTORY_TAG_CATALOG.map((tag) => ({
                  key: tag.key,
                  customLabel: tag.label,
                  enabled: true,
                }))
              );
              setHasChanges(false);
              toast.info('Reset to defaults');
            }}
          >
            Reset to defaults
          </Button>
          <Button
            variant="filled"
            onPress={() => {
              setHasChanges(false);
              toast.success('Tag settings saved!');
            }}
          >
            Save settings
          </Button>
        </Group>
      )}
    </Stack>
  );
}
