import type { WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext } from '../../../context';

export function useWsRequestData(): ConfigDataContext<WsRequestData> & {
  update: DataUpdater<WsRequestData>;
  updateOperation: DataUpdater<WsRequestData['operation']>;
  resetData: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<WsRequestData> = (field, value) => {
    setConfig(
      produce((draft: WsRequestData) => {
        draft[field] = value;
      })
    );
  };

  const updateOperation: DataUpdater<WsRequestData['operation']> = (field, value) => {
    setConfig(
      produce((draft: WsRequestData) => {
        draft.operation[field] = value;
      })
    );
  };

  const resetData = () =>
    setConfig(
      produce(draft => {
        draft.clientId = config.initConfig.clientId;
        draft.properties = config.initConfig.properties;
        draft.operation = config.initConfig.operation;
      })
    );

  return {
    ...config,
    update,
    updateOperation,
    resetData
  };
}
