import type { CallData, DialogCallData, ProcessCallData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useCallData(): ConfigDataContext<CallData> & {
  update: DataUpdater<CallData['call']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<CallData['call']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.call[field] = value;
      })
    );
  };

  return { ...config, update };
}

export function useDialogCallData(): ConfigDataContext<DialogCallData> & {
  update: DataUpdater<DialogCallData>;
  resetData: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<DialogCallData> = (field, value) => {
    setConfig(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  const resetData = () =>
    setConfig(
      produce(draft => {
        draft.dialog = config.initConfig.dialog;
        draft.call = config.initConfig.call;
      })
    );

  return { ...config, update, resetData };
}

export function useProcessCallData(): ConfigDataContext<ProcessCallData> & {
  update: DataUpdater<ProcessCallData>;
  resetData: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ProcessCallData> = (field, value) => {
    setConfig(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  const resetData = () =>
    setConfig(
      produce(draft => {
        draft.processCall = config.initConfig.processCall;
        draft.call = config.initConfig.call;
      })
    );

  return { ...config, update, resetData };
}
