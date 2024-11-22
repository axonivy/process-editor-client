import { ScriptArea } from '../../../../components/widgets';
import { PathCollapsible, ValidationFieldset } from '../../common';
import { useTaskData } from '../useTaskData';
import useMaximizedCodeEditor from '../../../browser/useMaximizedCodeEditor';

const TaskCode = () => {
  const { task, update } = useTaskData();

  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <PathCollapsible label='Code' defaultOpen={task.code.length > 0} path='code' controls={[maximizeCode]}>
      <ValidationFieldset>
        <ScriptArea
          maximizeState={maximizeState}
          value={task.code}
          onChange={change => update('code', change)}
          browsers={['attr', 'func', 'type']}
        />
      </ValidationFieldset>
    </PathCollapsible>
  );
};

export default TaskCode;
