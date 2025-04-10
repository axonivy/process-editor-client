import { hotkeyText } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type KnownHotkey = { hotkey: string; label: string };

export const useKnownHotkeys = () => {
  const { t } = useTranslation();
  const openHelp = useMemo<KnownHotkey>(() => {
    const hotkey = 'F1';
    return { hotkey, label: t('common.hotkey.help', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);
  return { openHelp };
};
