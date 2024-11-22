import type { ConditionData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext } from '../../../context';

export function useConditionData(): ConfigDataContext<ConditionData> & {
  update: DataUpdater<ConditionData>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ConditionData> = (field, value) => {
    setConfig(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  return { ...config, update };
}
