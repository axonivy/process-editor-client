/* eslint-disable react/jsx-key */
import { IvyIcons } from '@axonivy/ui-icons';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import NameEditor from '../NameEditor';
import type { KnownEditor } from '../InscriptionEditor';

export const bpmnActivityEditors = new Map<ElementType, KnownEditor>([
  ['GenericBpmnElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.SubActivities }],
  ['UserBpmnElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.User }],
  ['ManualBpmnElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.Manual }],
  ['ScriptBpmnElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.Script }],
  ['ServiceBpmnElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.SettingsOutline }],
  ['RuleBpmnElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.Rule }],
  ['SendBpmnElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.Send }],
  ['ReceiveBpmnElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.Receive }]
]);
