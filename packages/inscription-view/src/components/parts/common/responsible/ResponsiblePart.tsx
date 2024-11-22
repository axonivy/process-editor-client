import type { WfActivator } from '@axonivy/process-editor-inscription-protocol';
import { deepEqual } from '../../../../utils/equals';
import { PathCollapsible } from '../path/PathCollapsible';
import { ValidationFieldset } from '../path/validation/ValidationFieldset';
import ResponsibleSelect, { type ResponsibleSelectProps } from './ResponsibleSelect';
import { PathFieldset } from '../path/PathFieldset';

type ResponsibleCollapsibleProps = ResponsibleSelectProps & { defaultResponsible: WfActivator };

export const ResponsibleCollapsible = (props: ResponsibleCollapsibleProps) => (
  <PathCollapsible label='Responsible' path='responsible' defaultOpen={!deepEqual(props.responsible, props.defaultResponsible)}>
    <ValidationFieldset>
      <ResponsibleSelect {...props} />
    </ValidationFieldset>
  </PathCollapsible>
);

export const ResponsiblePart = (props: ResponsibleSelectProps) => (
  <PathFieldset label='Responsible' path='responsible'>
    <ResponsibleSelect {...props} />
  </PathFieldset>
);
