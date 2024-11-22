import type { DbErrorData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { Consumer } from '../../../../types/lambda';
import type { ConfigDataContext } from '../../../../context';
import { useConfigDataContext } from '../../../../context';

export function useDbErrorData(): ConfigDataContext<DbErrorData> & {
  updateException: Consumer<string>;
  reset: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const updateException = (value: string) => {
    setConfig(
      produce(draft => {
        draft.exceptionHandler = value;
      })
    );
  };

  const reset = () =>
    setConfig(
      produce(draft => {
        draft.exceptionHandler = config.initConfig.exceptionHandler;
      })
    );

  return {
    ...config,
    updateException,
    reset
  };
}
