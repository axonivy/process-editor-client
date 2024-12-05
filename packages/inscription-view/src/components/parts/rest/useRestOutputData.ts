import type { RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useRestOutputData(): ConfigDataContext<RestResponseData> & {
  updateEntity: DataUpdater<RestResponseData['response']['entity']>;
  resetData: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const updateEntity: DataUpdater<RestResponseData['response']['entity']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.response.entity[field] = value;
      })
    );
  };

  const resetData = () =>
    setConfig(
      produce(draft => {
        draft.response.entity = config.initConfig.response.entity;
      })
    );

  return {
    ...config,
    updateEntity,
    resetData
  };
}
