import type { OutputData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { Consumer, DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useOutputData(): ConfigDataContext<OutputData> & {
  update: DataUpdater<OutputData['output']>;
  updateSudo: Consumer<boolean>;
  resetCode: () => void;
  resetOutput: Consumer<boolean | undefined>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<OutputData['output']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.output[field] = value;
      })
    );
  };

  const updateSudo = (sudo: boolean) =>
    setConfig(
      produce(draft => {
        draft.sudo = sudo;
      })
    );

  const resetCode = () =>
    setConfig(
      produce(draft => {
        draft.output.code = config.initConfig.output.code;
      })
    );

  const resetOutput = (resetSudo?: boolean) =>
    setConfig(
      produce(draft => {
        draft.output.map = config.initConfig.output.map;
        draft.output.code = config.initConfig.output.code;
        if (resetSudo) {
          draft.sudo = config.initConfig.sudo;
        }
      })
    );

  return {
    ...config,
    update,
    updateSudo,
    resetCode,
    resetOutput
  };
}
