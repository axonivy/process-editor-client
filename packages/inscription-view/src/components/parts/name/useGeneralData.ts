import type { GeneralData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import { useDataContext } from '../../../context/useDataContext';

export function useGeneralData(): {
  data: GeneralData;
  initData: GeneralData;
  update: DataUpdater<GeneralData>;
  resetData: () => void;
} {
  const { data, initData, setData } = useDataContext();

  const update: DataUpdater<GeneralData> = (field, value) =>
    setData(
      produce((draft: GeneralData) => {
        draft[field] = value;
      })
    );

  const resetData = () =>
    setData(
      produce(draft => {
        draft.name = initData.name;
        draft.description = initData.description;
        draft.docs = initData.docs;
        draft.tags = initData.tags;
      })
    );

  return { data, initData, update, resetData };
}
