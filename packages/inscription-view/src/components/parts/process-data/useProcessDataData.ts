import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext } from '../../../context';
import type { ProcessDataData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';

export function useProcessDataData(): ConfigDataContext<ProcessDataData> & {
  update: DataUpdater<ProcessDataData>;
  reset: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ProcessDataData> = (field, value) => {
    setConfig(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  const reset = () =>
    setConfig(
      produce(draft => {
        draft.data = config.initConfig.data;
      })
    );

  return {
    ...config,
    update,
    reset
  };
}
