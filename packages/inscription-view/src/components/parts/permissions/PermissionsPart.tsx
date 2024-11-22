import { usePartDirty, usePartState, type PartProps } from '../../../components/editors/part/usePart';
import { Checkbox, Collapsible } from '../../../components/widgets';
import { usePermissionsData } from './usePermissionsData';
import type { PermissionsData } from '@axonivy/process-editor-inscription-protocol';

export function usePermissionsPart(): PartProps {
  const { config, defaultConfig, initConfig, reset } = usePermissionsData();
  const compareData = (data: PermissionsData) => [data.permissions];
  const state = usePartState(compareData(defaultConfig), compareData(config), []);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Permissions', state, reset: { dirty, action: () => reset() }, content: <PermissionsPart /> };
}

const PermissionsPart = () => {
  const { config, defaultConfig, update } = usePermissionsData();
  return (
    <Collapsible label='Permissions' defaultOpen={config.permissions.view.allowed !== defaultConfig.permissions.view.allowed}>
      <Checkbox
        label='Allow all workflow users to view the process on the Engine'
        value={config.permissions.view.allowed}
        onChange={change => update('allowed', change)}
      />
    </Collapsible>
  );
};
