import type { RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import { PathContext, useValidations } from '../../../context';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { ValidationCollapsible } from '../common';
import { RestError } from './rest-response/RestError';
import { useRestErrorData } from './useRestErrorData';

export function useRestErrorPart(): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useRestErrorData();
  const validations = useValidations(['response']);
  const filteredErrorValidations = validations.filter(item => !item.path.startsWith('response.entity'));
  const compareData = (data: RestResponseData) => [data.response.clientError, data.response.statusError];
  const state = usePartState(compareData(defaultConfig), compareData(config), filteredErrorValidations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Error', state: state, reset: { dirty, action: () => resetData() }, content: <RestErrorPart /> };
}

const RestErrorPart = () => {
  const { config, defaultConfig, update } = useRestErrorData();

  return (
    <PathContext path='response'>
      <ValidationCollapsible
        label='Error'
        defaultOpen={
          config.response.clientError !== defaultConfig.response.clientError ||
          config.response.statusError !== defaultConfig.response.statusError
        }
        paths={['clientError', 'statusError']}
      >
        <RestError
          label='On Error (Connection, Timeout, etc.)'
          value={config.response.clientError}
          onChange={change => update('clientError', change)}
          path='clientError'
        />
        <RestError
          label='On Status Code not successful (2xx)'
          value={config.response.statusError}
          onChange={change => update('statusError', change)}
          path='statusError'
        />
      </ValidationCollapsible>
    </PathContext>
  );
};
