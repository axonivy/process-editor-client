import type { StartPermission } from '@axonivy/process-editor-inscription-protocol';
import { IVY_EXCEPTIONS } from '@axonivy/process-editor-inscription-protocol';
import RoleSelect from '../responsible/RoleSelect';
import { deepEqual } from '../../../../utils/equals';
import { PathFieldset } from '../path/PathFieldset';
import { PathCollapsible } from '../path/PathCollapsible';
import ExceptionSelect from '../exception-handler/ExceptionSelect';
import type { DataUpdater } from '../../../../types/lambda';
import Checkbox from '../../../widgets/checkbox/Checkbox';

interface PermissionProps {
  anonymousFieldActive: boolean;
  config: StartPermission;
  defaultConfig: StartPermission;
  updatePermission: DataUpdater<StartPermission>;
}

export const Permission = ({ anonymousFieldActive, config, defaultConfig, updatePermission }: PermissionProps) => {
  return (
    <PathCollapsible path='permission' label='Permission' defaultOpen={!deepEqual(config, defaultConfig)}>
      {anonymousFieldActive && (
        <Checkbox label='Allow anonymous' value={config.anonymous} onChange={change => updatePermission('anonymous', change)} />
      )}
      <PathFieldset label='Role' path='role'>
        <RoleSelect value={config.role} onChange={change => updatePermission('role', change)} />
      </PathFieldset>      
      <PathFieldset label='Violation error' path='error'>
        <ExceptionSelect
          value={config.error}
          onChange={change => updatePermission('error', change)}
          staticExceptions={[IVY_EXCEPTIONS.security, IVY_EXCEPTIONS.ignoreException]}
        />
      </PathFieldset>
    </PathCollapsible>
  );
};
