import './PrioritySelect.css';
import { useMemo } from 'react';
import type { WfPriority, WfLevel, WfTask } from '@axonivy/process-editor-inscription-protocol';
import { PRIORITY_LEVEL, IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import type { DataUpdater } from '../../../../types/lambda';
import { Field, Flex } from '@axonivy/ui-components';
import type { SelectItem } from '../../../widgets/select/Select';
import Select from '../../../widgets/select/Select';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';

const DEFAULT_PRIORITY: SelectItem & { value: WfLevel } = { label: PRIORITY_LEVEL.NORMAL, value: 'NORMAL' };

export type PriorityUpdater = DataUpdater<WfTask['priority']>;

export type PrioritySelectProps = { priority?: WfPriority; updatePriority: PriorityUpdater };

const PrioritySelect = ({ priority, updatePriority }: PrioritySelectProps) => {
  const priorityItems = useMemo<SelectItem[]>(() => Object.entries(PRIORITY_LEVEL).map(([value, label]) => ({ label, value })), []);
  const selectedLevel = useMemo<SelectItem>(
    () => priorityItems.find(e => e.value === priority?.level) ?? DEFAULT_PRIORITY,
    [priority?.level, priorityItems]
  );

  return (
    <Flex direction='row' gap={2} className='priority-select'>
      <Select value={selectedLevel} onChange={item => updatePriority('level', item.value as WfLevel)} items={priorityItems} />
      {(selectedLevel.value as WfLevel) === 'SCRIPT' && (
        <Field>
          <ScriptInput
            type={IVY_SCRIPT_TYPES.INT}
            value={priority?.script ?? ''}
            onChange={change => updatePriority('script', change)}
            browsers={['attr', 'func', 'type']}
          />
        </Field>
      )}
    </Flex>
  );
};

export default PrioritySelect;
