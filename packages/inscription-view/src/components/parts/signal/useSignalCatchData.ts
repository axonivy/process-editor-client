import type { SignalCatchData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { Consumer, DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, useDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useSignalCatchData(): ConfigDataContext<SignalCatchData> & {
  update: DataUpdater<SignalCatchData>;
  updateSignal: Consumer<string>;
  resetData: () => void;
} {
  const { setData } = useDataContext();
  const { setConfig, ...config } = useConfigDataContext();

  const updateSignal = (signalCode: string) => {
    setData(
      produce(draft => {
        if (draft.name === draft.config.signalCode) {
          draft.name = signalCode;
        }
        draft.config.signalCode = signalCode;
      })
    );
  };

  const update: DataUpdater<SignalCatchData> = (field, value) => {
    setConfig(
      produce((draft: SignalCatchData) => {
        draft[field] = value;
      })
    );
  };

  const resetData = () =>
    setConfig(
      produce(draft => {
        draft.signalCode = config.initConfig.signalCode;
        draft.attachToBusinessCase = config.initConfig.attachToBusinessCase;
      })
    );

  return { ...config, update, updateSignal, resetData };
}
