import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext } from '../../../context';
import type { WebServiceProcessData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';

export function useWebServiceProcessData(): ConfigDataContext<WebServiceProcessData> & {
  update: DataUpdater<WebServiceProcessData>;
  reset: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<WebServiceProcessData> = (field, value) => {
    setConfig(
      produce((draft: WebServiceProcessData) => {
        draft[field] = value;
      })
    );
  };

  const reset = () =>
    setConfig(
      produce(draft => {
        draft.wsAuth = config.initConfig.wsAuth;
        draft.wsTypeName = config.initConfig.wsTypeName;
      })
    );

  return {
    ...config,
    update,
    reset
  };
}
