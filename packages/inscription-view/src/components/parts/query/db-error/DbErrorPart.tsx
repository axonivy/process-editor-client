import { IVY_EXCEPTIONS, type DbErrorData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../../../components/editors/part/usePart';
import { useValidations } from '../../../../context';
import { ExceptionSelect, PathCollapsible, ValidationFieldset } from '../../common';
import { useDbErrorData } from './useDbErrorData';

export function useDbErrorPart(): PartProps {
  const { config, defaultConfig, initConfig, reset } = useDbErrorData();
  const exceptionVal = useValidations(['exceptionHandler']);
  const compareData = (data: DbErrorData) => [data];
  const state = usePartState(compareData(defaultConfig), compareData(config), exceptionVal);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Error', state: state, reset: { dirty, action: () => reset() }, content: <QueryPart /> };
}

const QueryPart = () => {
  const { config, defaultConfig, updateException } = useDbErrorData();

  return (
    <PathCollapsible label='Error' defaultOpen={config.exceptionHandler !== defaultConfig.exceptionHandler} path='exceptionHandler'>
      <ValidationFieldset>
        <ExceptionSelect
          value={config.exceptionHandler}
          onChange={change => updateException(change)}
          staticExceptions={[IVY_EXCEPTIONS.database, IVY_EXCEPTIONS.ignoreException]}
        />
      </ValidationFieldset>
    </PathCollapsible>
  );
};
