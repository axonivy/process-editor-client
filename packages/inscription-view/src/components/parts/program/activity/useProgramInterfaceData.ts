import type { ProgramInterfaceStartData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../../context/useDataContext';

export function useProgramInterfaceData(): ConfigDataContext<ProgramInterfaceStartData> & {
  update: DataUpdater<ProgramInterfaceStartData>;
  updateTimeout: DataUpdater<ProgramInterfaceStartData['timeout']>;
  resetJavaClass: () => void;
  resetError: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ProgramInterfaceStartData> = (field, value) => {
    setConfig(
      produce((draft: ProgramInterfaceStartData) => {
        draft[field] = value;
      })
    );
  };

  const updateTimeout: DataUpdater<ProgramInterfaceStartData['timeout']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.timeout[field] = value;
      })
    );
  };

  const resetJavaClass = () =>
    setConfig(
      produce(draft => {
        draft.javaClass = config.initConfig.javaClass;
      })
    );

  const resetError = () =>
    setConfig(
      produce(draft => {
        draft.exceptionHandler = config.initConfig.exceptionHandler;
        draft.timeout = config.initConfig.timeout;
      })
    );

  return {
    ...config,
    update,
    updateTimeout,
    resetJavaClass,
    resetError
  };
}
