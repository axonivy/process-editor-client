import type { QueryData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import type { ConfigDataContext } from '../../../context';
import { useConfigDataContext } from '../../../context';

export function useQueryData(): ConfigDataContext<QueryData> & {
  update: DataUpdater<QueryData['query']>;
  updateSql: DataUpdater<QueryData['query']['sql']>;
  reset: () => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<QueryData['query']> = (field, value) => {
    setConfig(
      produce((draft: QueryData) => {
        draft.query[field] = value;
      })
    );
  };

  const updateSql: DataUpdater<QueryData['query']['sql']> = (field, value) => {
    setConfig(
      produce((draft: QueryData) => {
        draft.query.sql[field] = value;
      })
    );
  };

  const reset = () =>
    setConfig(
      produce(draft => {
        draft.query = config.initConfig.query;
      })
    );

  return {
    ...config,
    update,
    updateSql,
    reset
  };
}
