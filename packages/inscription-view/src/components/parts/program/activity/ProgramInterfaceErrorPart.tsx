import type { ProgramInterfaceStartData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_EXCEPTIONS, IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../../editors/part/usePart';
import { useProgramInterfaceData } from './useProgramInterfaceData';
import { deepEqual } from '../../../../utils/equals';
import { useValidations } from '../../../../context/useValidation';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { PathContext } from '../../../../context/usePath';
import ExceptionSelect from '../../common/exception-handler/ExceptionSelect';
import { PathFieldset } from '../../common/path/PathFieldset';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';

export function useProgramInterfaceErrorPart(): PartProps {
  const { config, defaultConfig, initConfig, resetError } = useProgramInterfaceData();
  const compareData = (data: ProgramInterfaceStartData) => [data.exceptionHandler, data.timeout];
  const validation = [...useValidations(['timeout']), ...useValidations(['exceptionHandler'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Error',
    state,
    reset: { dirty, action: () => resetError() },
    content: <ProgramInterfaceErrorPart />
  };
}

const ProgramInterfaceErrorPart = () => {
  const { config, defaultConfig, update, updateTimeout } = useProgramInterfaceData();

  return (
    <>
      <PathCollapsible label='Error' path='exceptionHandler' defaultOpen={config.exceptionHandler !== defaultConfig.exceptionHandler}>
        <PathContext path='error'>
          <ExceptionSelect
            value={config.exceptionHandler}
            onChange={change => update('exceptionHandler', change)}
            staticExceptions={[IVY_EXCEPTIONS.programException, IVY_EXCEPTIONS.ignoreException]}
          />
        </PathContext>
      </PathCollapsible>

      <PathCollapsible label='Timeout' path='timeout' defaultOpen={!deepEqual(config.timeout, defaultConfig.timeout)}>
        <PathFieldset label='Seconds' path='seconds'>
          <ScriptInput
            value={config.timeout.seconds}
            onChange={change => updateTimeout('seconds', change)}
            type={IVY_SCRIPT_TYPES.DURATION}
            browsers={['attr', 'func', 'type']}
          />
        </PathFieldset>
        <PathFieldset label='Error' path='error'>
          <ExceptionSelect
            value={config.timeout.error}
            onChange={change => updateTimeout('error', change)}
            staticExceptions={[IVY_EXCEPTIONS.programTimeout, IVY_EXCEPTIONS.ignoreException]}
          />
        </PathFieldset>
      </PathCollapsible>
    </>
  );
};
