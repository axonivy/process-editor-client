import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext } from '../../../context';
import type { EndPageData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';

export function useEndPageData(): ConfigDataContext<EndPageData> & {
  update: DataUpdater<EndPageData>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<EndPageData> = (field, value) => {
    setConfig(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  return { ...config, update };
}
