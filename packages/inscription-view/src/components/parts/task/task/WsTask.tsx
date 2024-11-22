import { useTaskData } from '../useTaskData';
import Information from '../../common/info/Information';
import TaskCode from '../code/TaskCode';
import CustomFieldTable from '../../common/customfield/CustomFieldTable';
import { PriorityCollapsible } from '../priority/PriorityPart';

const WsTask = () => {
  const { task, defaultTask, update, updatePriority } = useTaskData();
  return (
    <>
      <Information config={task} defaultConfig={defaultTask} update={update} />
      <PriorityCollapsible priority={task.priority} updatePriority={updatePriority} />
      <CustomFieldTable data={task.customFields} onChange={change => update('customFields', change)} type='TASK' />
      <TaskCode />
    </>
  );
};

export default WsTask;
