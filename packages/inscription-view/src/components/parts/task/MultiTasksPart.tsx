import type { TaskData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import Task from './task/Task';
import { useMutliTaskData } from './useTaskData';
import { useValidations } from '../../../context/useValidation';
import { Tabs, type Tab } from '../../widgets/tab/Tab';
import { mergePaths, PathContext } from '../../../context/usePath';
import { TaskDataContextInstance } from '../../../context/useDataContext';
import EmptyWidget from '../../widgets/empty/EmptyWidget';
import { useTranslation } from 'react-i18next';

export function useMultiTasksPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, resetTasks } = useMutliTaskData();
  const validations = useValidations(['tasks']);
  const compareData = (data: TaskData) => [data.tasks];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: t('part.task.tasks'), state, reset: { dirty, action: () => resetTasks() }, content: <MultiTasksPart /> };
}

const MultiTasksPart = () => {
  const { t } = useTranslation();
  const { config } = useMutliTaskData();
  const validations = useValidations(['tasks']);

  const tabs: Tab[] =
    config.tasks?.map<Tab>((task, index) => {
      const taskId = task.id ?? '';
      const taskVals = validations.filter(val => val.path.startsWith(mergePaths('tasks', [index])));
      return {
        id: taskId,
        name: taskId,
        messages: taskVals,
        content: (
          <PathContext path='tasks'>
            <TaskDataContextInstance.Provider value={index}>
              <PathContext path={index}>
                <Task />
              </PathContext>
            </TaskDataContextInstance.Provider>
          </PathContext>
        )
      };
    }) ?? [];

  if (tabs.length === 0) {
    return <EmptyWidget message={t('part.task.noTaskMessage')} />;
  }
  return <Tabs tabs={tabs} />;
};
