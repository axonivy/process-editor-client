import type { WsErrorData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useWsErrorData(): ConfigDataContext<WsErrorData> & {
  update: DataUpdater<WsErrorData>;
  resetData: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<WsErrorData> = (field, value) => {
    setConfig(
      produce((draft: WsErrorData) => {
        draft[field] = value;
      })
    );
  };

  const resetData = () =>
    setConfig(
      produce(draft => {
        draft.exceptionHandler = config.initConfig.exceptionHandler;
      })
    );

  return {
    ...config,
    update,
    resetData
  };
}
