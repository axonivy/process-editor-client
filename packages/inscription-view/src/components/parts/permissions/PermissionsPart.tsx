import { useTranslation } from 'react-i18next';
import { usePartDirty, usePartState, type PartProps } from '../../../components/editors/part/usePart';
import Checkbox from '../../widgets/checkbox/Checkbox';
import Collapsible from '../../widgets/collapsible/Collapsible';
import { usePermissionsData } from './usePermissionsData';
import type { PermissionsData } from '@axonivy/process-editor-inscription-protocol';

export function usePermissionsPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, reset } = usePermissionsData();
  const compareData = (data: PermissionsData) => [data.permissions];
  const state = usePartState(compareData(defaultConfig), compareData(config), []);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: t('part.permission.title'), state, reset: { dirty, action: () => reset() }, content: <PermissionsPart /> };
}

const PermissionsPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update } = usePermissionsData();
  return (
    <Collapsible
      label={t('part.permission.title')}
      defaultOpen={config.permissions.view.allowed !== defaultConfig.permissions.view.allowed}
    >
      <Checkbox
        label={t('part.permission.allowProcessViewer')}
        value={config.permissions.view.allowed}
        onChange={change => update('allowed', change)}
      />
    </Collapsible>
  );
};
