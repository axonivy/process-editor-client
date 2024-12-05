import type { ProgramStartData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../../context/useDataContext';

export function useProgramStartData(): ConfigDataContext<ProgramStartData> & {
  update: DataUpdater<ProgramStartData>;
  updatePermission: DataUpdater<ProgramStartData['permission']>;
  reset: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ProgramStartData> = (field, value) => {
    setConfig(
      produce((draft: ProgramStartData) => {
        draft[field] = value;
      })
    );
  };

  const updatePermission: DataUpdater<ProgramStartData['permission']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.permission[field] = value;
      })
    );
  };

  const reset = () =>
    setConfig(
      produce(draft => {
        draft.javaClass = config.initConfig.javaClass;
        draft.permission = config.initConfig.permission;
      })
    );

  return {
    ...config,
    update,
    updatePermission,
    reset
  };
}
