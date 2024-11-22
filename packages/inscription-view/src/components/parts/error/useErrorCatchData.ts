import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext, useDataContext } from '../../../context';
import type { ErrorCatchData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { Consumer } from '../../../types/lambda';

export function useErrorCatchData(): ConfigDataContext<ErrorCatchData> & {
  updateError: Consumer<string>;
} {
  const { setData } = useDataContext();
  const config = useConfigDataContext();

  const updateError = (errorCode: string) => {
    setData(
      produce(draft => {
        if (draft.name === draft.config.errorCode) {
          draft.name = errorCode;
        }
        draft.config.errorCode = errorCode;
      })
    );
  };

  return { ...config, updateError };
}
