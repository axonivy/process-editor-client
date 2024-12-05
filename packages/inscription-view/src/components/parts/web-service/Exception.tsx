import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useWebServiceData } from './useWebServiceData';
import { deepEqual } from '../../../utils/equals';
import { PathCollapsible } from '../common/path/PathCollapsible';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { PathFieldset } from '../common/path/PathFieldset';
import { ScriptInput } from '../../widgets/code-editor/ScriptInput';

export const Exception = () => {
  const { config, defaultConfig, updateException } = useWebServiceData();

  return (
    <PathCollapsible path='exception' label='Exception' defaultOpen={!deepEqual(config.exception, defaultConfig.exception)}>
      <Checkbox label='Use exception handling' value={config.exception.enabled} onChange={change => updateException('enabled', change)} />
      <PathFieldset label='Condition' path='condition'>
        <ScriptInput
          value={config.exception.condition}
          onChange={change => updateException('condition', change)}
          type={IVY_SCRIPT_TYPES.BOOLEAN}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
      <PathFieldset label='Message' path='message'>
        <ScriptInput
          value={config.exception.message}
          onChange={change => updateException('message', change)}
          type={IVY_SCRIPT_TYPES.STRING}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
    </PathCollapsible>
  );
};
