import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext } from '../../../context';
import type { ResultData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';

export function useResultData(): ConfigDataContext<ResultData> & {
  update: DataUpdater<ResultData['result']>;
  resetData: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ResultData['result']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.result[field] = value;
      })
    );
  };

  const resetData = () =>
    setConfig(
      produce(draft => {
        draft.result = config.initConfig.result;
      })
    );

  return {
    ...config,
    update,
    resetData
  };
}
