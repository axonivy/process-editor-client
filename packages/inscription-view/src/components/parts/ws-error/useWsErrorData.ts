import type { WsErrorData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext } from '../../../context';

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
