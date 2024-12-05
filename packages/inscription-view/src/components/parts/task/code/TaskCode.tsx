import { useTaskData } from '../useTaskData';
import useMaximizedCodeEditor from '../../../browser/useMaximizedCodeEditor';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import { ScriptArea } from '../../../widgets/code-editor/ScriptArea';

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
