import type { TaskData } from '@axonivy/process-editor-inscription-protocol';
import type { Tab } from '../../widgets';
import { EmptyWidget, Tabs } from '../../widgets';
import { PathContext, TaskDataContextInstance, mergePaths, useValidations } from '../../../context';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import Task from './task/Task';
import { useMutliTaskData } from './useTaskData';

export function useMultiTasksPart(): PartProps {
  const { config, defaultConfig, initConfig, resetTasks } = useMutliTaskData();
  const validations = useValidations(['tasks']);
  const compareData = (data: TaskData) => [data.tasks];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Tasks', state, reset: { dirty, action: () => resetTasks() }, content: <MultiTasksPart /> };
}

const MultiTasksPart = () => {
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

  return <>{tabs.length > 0 ? <Tabs tabs={tabs} /> : <EmptyWidget message='There is no (Task) output flow connected.' />}</>;
};
