import type { WsErrorData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_EXCEPTIONS } from '@axonivy/process-editor-inscription-protocol';
import { useValidations } from '../../../context';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useWsErrorData } from './useWsErrorData';
import { ExceptionSelect, PathCollapsible, ValidationFieldset } from '../common';

export function useWsErrorPart(): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useWsErrorData();
  const validations = useValidations(['exceptionHandler']);
  const compareData = (data: WsErrorData) => [data];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Error', state: state, reset: { dirty, action: () => resetData() }, content: <WsErrorPart /> };
}

const WsErrorPart = () => {
  const { config, defaultConfig, update } = useWsErrorData();

  return (
    <PathCollapsible label='Error' defaultOpen={config.exceptionHandler !== defaultConfig.exceptionHandler} path='exceptionHandler'>
      <ValidationFieldset>
        <ExceptionSelect
          value={config.exceptionHandler}
          onChange={change => update('exceptionHandler', change)}
          staticExceptions={[IVY_EXCEPTIONS.webservice, IVY_EXCEPTIONS.ignoreException]}
        />
      </ValidationFieldset>
    </PathCollapsible>
  );
};