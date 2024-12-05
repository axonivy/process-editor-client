import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useTaskData } from '../useTaskData';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import Checkbox from '../../../widgets/checkbox/Checkbox';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';

const TaskOptionsPart = () => {
  const { task, update } = useTaskData();

  return (
    <PathCollapsible label='Options' defaultOpen={task.skipTasklist} path='delay'>
      <Checkbox label='Skip Tasklist' value={task.skipTasklist} onChange={change => update('skipTasklist', change)} />
      <ValidationFieldset label='Delay'>
        <ScriptInput
          value={task.delay}
          onChange={change => update('delay', change)}
          browsers={['attr', 'func', 'type']}
          type={IVY_SCRIPT_TYPES.DURATION}
        />
      </ValidationFieldset>
    </PathCollapsible>
  );
};

export default TaskOptionsPart;
