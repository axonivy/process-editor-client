import { PathCollapsible } from '../../common/path/PathCollapsible';
import { PathFieldset } from '../../common/path/PathFieldset';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import type { PrioritySelectProps } from './PrioritySelect';
import PrioritySelect from './PrioritySelect';

export const PriorityCollapsible = (props: PrioritySelectProps) => (
  <PathCollapsible label='Priority' path='priority' defaultOpen={props.priority?.level !== 'NORMAL'}>
    <ValidationFieldset>
      <PrioritySelect {...props} />
    </ValidationFieldset>
  </PathCollapsible>
);

export const PriorityPart = (props: PrioritySelectProps) => (
  <PathFieldset label='Priority' path='priority'>
    <PrioritySelect {...props} />
  </PathFieldset>
);
