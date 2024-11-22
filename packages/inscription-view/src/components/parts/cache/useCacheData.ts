import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext } from '../../../context';
import type { CacheData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';

export function useCacheData(): ConfigDataContext<CacheData> & {
  update: DataUpdater<CacheData['cache']>;
  updateGroup: DataUpdater<CacheData['cache']['group']>;
  updateEntry: DataUpdater<CacheData['cache']['entry']>;
  reset: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<CacheData['cache']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.cache[field] = value;
      })
    );
  };

  const updateGroup: DataUpdater<CacheData['cache']['group']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.cache.group[field] = value;
      })
    );
  };

  const updateEntry: DataUpdater<CacheData['cache']['entry']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.cache.entry[field] = value;
      })
    );
  };

  const reset = () =>
    setConfig(
      produce(draft => {
        draft.cache = config.initConfig.cache;
      })
    );

  return {
    ...config,
    update,
    updateGroup,
    updateEntry,
    reset
  };
}
