import type { RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useRestErrorData(): ConfigDataContext<RestResponseData> & {
  update: DataUpdater<RestResponseData['response']>;
  resetData: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<RestResponseData['response']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.response[field] = value;
      })
    );
  };

  const resetData = () =>
    setConfig(
      produce(draft => {
        draft.response.clientError = config.initConfig.response.clientError;
        draft.response.statusError = config.initConfig.response.statusError;
      })
    );

  return {
    ...config,
    update,
    resetData
  };
}
