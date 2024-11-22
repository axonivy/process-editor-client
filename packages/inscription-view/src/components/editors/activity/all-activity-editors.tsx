import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { workflowActivityEditors } from './workflow';
import { bpmnActivityEditors } from './bpmn';
import { interfaceActivityEditors } from './interface';
import type { KnownEditor } from '../InscriptionEditor';

export const activityEditors = new Map<ElementType, KnownEditor>([
  ...workflowActivityEditors,
  ...interfaceActivityEditors,
  ...bpmnActivityEditors
]);
