import type { WfExpiry } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../../types/lambda';
import type { PriorityUpdater } from '../priority/PrioritySelect';
import type { ResponsibleUpdater } from '../../common/responsible/ResponsibleSelect';
import { useTaskDataContext } from '../../../../context/useDataContext';

export function useExpiryData(): {
  expiry: WfExpiry;
  defaultExpiry: WfExpiry;
  update: DataUpdater<WfExpiry>;
  updateResponsible: ResponsibleUpdater;
  updatePriority: PriorityUpdater;
} {
  const { task, defaultTask, setTask } = useTaskDataContext();

  const update: DataUpdater<WfExpiry> = (field, value) => {
    setTask(
      produce(draft => {
        draft.expiry[field] = value;
      })
    );
  };

  const updateResponsible: ResponsibleUpdater = (field, value) => {
    setTask(
      produce(draft => {
        draft.expiry.responsible[field] = value;
      })
    );
  };

  const updatePriority: PriorityUpdater = (field, value) => {
    setTask(
      produce(draft => {
        draft.expiry.priority[field] = value;
      })
    );
  };

  return {
    expiry: task.expiry,
    defaultExpiry: defaultTask.expiry,
    update,
    updateResponsible,
    updatePriority
  };
}
