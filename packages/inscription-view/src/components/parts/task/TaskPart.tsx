import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import type { TaskPersistData } from './options/usePersistOptionsData';
import { useTaskPersistData } from './options/usePersistOptionsData';
import Task from './task/Task';
import { useTaskData } from './useTaskData';
import type { WfTask } from '@axonivy/process-editor-inscription-protocol';
import RequestTask from './task/RequestTask';
import WaitTask from './task/WaitTask';
import WsTask from './task/WsTask';
import { useValidations } from '../../../context/useValidation';
import { PathContext } from '../../../context/usePath';
import EmptyWidget from '../../widgets/empty/EmptyWidget';
import { IvyIcons } from '@axonivy/ui-icons';

export function useTaskPart(options?: TaskPartProps): PartProps {
  const { task, defaultTask, initTask, resetTask } = useTaskData();
  const { config, defaultConfig, initConfig, updatePersist } = useTaskPersistData();
  let validations = useValidations(['task']);
  const isStartRequest = options?.type === 'request';
  if (isStartRequest) {
    validations = validations.filter(val => !val.path.startsWith('task.responsible')).filter(val => !val.path.startsWith('task.delay'));
  }
  const compareData = (task: WfTask, persist: TaskPersistData) => [task, isStartRequest ? persist.persistOnStart : ''];
  const state = usePartState(compareData(defaultTask, defaultConfig), compareData(task, config), validations);
  const dirty = usePartDirty(compareData(initTask, initConfig), compareData(task, config));
  const resetData = () => {
    resetTask();
    if (isStartRequest) {
      updatePersist(initConfig.persistOnStart);
    }
  };
  return {
    name: 'Task',
    state,
    reset: { dirty, action: () => resetData() },
    content: <TaskPart type={options?.type} />,
    icon: IvyIcons.UserTask
  };
}

export type TaskPartProps = {
  type?: 'request' | 'wait' | 'ws';
};

const TaskPart = ({ type }: TaskPartProps) => {
  const { defaultTask } = useTaskData();
  const task = (type: TaskPartProps['type']) => {
    switch (type) {
      case 'request':
        return <RequestTask />;
      case 'wait':
        return <WaitTask />;
      case 'ws':
        return <WsTask />;
      default:
        return <Task />;
    }
  };
  if (defaultTask) {
    return <PathContext path='task'>{task(type)}</PathContext>;
  }
  return <EmptyWidget message='There is no (Task) output flow connected.' />;
};
