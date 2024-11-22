/* eslint-disable react/jsx-key */
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import NameEditor from '../NameEditor';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  useCasePart,
  useDialogCallPart,
  useGeneralPart,
  useOutputPart,
  useTaskPart,
  useSubCallPart,
  useTriggerCallPart
} from '../../../components/parts';
import Part from '../part/Part';

const DialogCallEditor = memo(() => {
  const name = useGeneralPart();
  const dialog = useDialogCallPart();
  const output = useOutputPart();
  return <Part parts={[name, dialog, output]} />;
});

const UserTaskEditor = memo(() => {
  const name = useGeneralPart();
  const dialog = useDialogCallPart({ offline: true });
  const task = useTaskPart();
  const casePart = useCasePart();
  const output = useOutputPart();
  return <Part parts={[name, task, casePart, dialog, output]} />;
});

const ScriptEditor = memo(() => {
  const name = useGeneralPart();
  const output = useOutputPart({ showSudo: true, additionalBrowsers: ['cms'] });
  return <Part parts={[name, output]} />;
});

const SubProcessCallEditor = memo(() => {
  const name = useGeneralPart();
  const call = useSubCallPart();
  const output = useOutputPart();
  return <Part parts={[name, call, output]} />;
});

const TriggerEditor = memo(() => {
  const name = useGeneralPart();
  const call = useTriggerCallPart();
  const output = useOutputPart();
  return <Part parts={[name, call, output]} />;
});

export const workflowActivityEditors = new Map<ElementType, KnownEditor>([
  ['DialogCall', { editor: <DialogCallEditor />, icon: IvyIcons.UserDialog }],
  ['UserTask', { editor: <UserTaskEditor />, icon: IvyIcons.UserTask }],
  ['Script', { editor: <ScriptEditor />, icon: IvyIcons.Script }],
  ['EmbeddedProcessElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.SubActivities }],
  ['SubProcessCall', { editor: <SubProcessCallEditor />, icon: IvyIcons.SubActivities }],
  ['TriggerCall', { editor: <TriggerEditor />, icon: IvyIcons.Trigger }]
]);
