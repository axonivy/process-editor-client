import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext, useDataContext } from '../../../context';
import type { StartData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { Consumer, DataUpdater } from '../../../types/lambda';

export function useStartData(synchParams?: boolean): ConfigDataContext<StartData> & {
  update: DataUpdater<StartData['input']>;
  updateSignature: Consumer<string>;
  resetData: () => void;
} {
  const { setData } = useDataContext();
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<StartData['input']> = (field, value) => {
    setData(
      produce(draft => {
        const synchName = draft.name === nameSyncher(draft.config);
        draft.config.input[field] = value;
        if (synchName) {
          draft.name = nameSyncher(draft.config);
        }
      })
    );
  };

  const nameSyncher = (data: StartData) => {
    if (synchParams) {
      return `${data.signature}(${data.input.params
        .filter(param => param.name.length > 0)
        .map(param => param.type.substring(param.type.lastIndexOf('.') + 1))
        .join(',')})`;
    }
    return data.signature;
  };

  const updateSignature = (signature: string) =>
    setData(
      produce(draft => {
        const synchName = draft.name === nameSyncher(draft.config);
        draft.config.signature = signature;
        if (synchName) {
          draft.name = nameSyncher(draft.config);
        }
      })
    );

  const resetData = () =>
    setConfig(
      produce(draft => {
        draft.signature = config.initConfig.signature;
        draft.input = config.initConfig.input;
      })
    );

  return {
    ...config,
    update,
    updateSignature,
    resetData
  };
}
