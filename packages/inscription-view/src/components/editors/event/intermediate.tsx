/* eslint-disable react/jsx-key */
import { IvyIcons } from '@axonivy/ui-icons';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';
import {
  useCasePart,
  useConfigurationPart,
  useEndPagePart,
  useEventPart,
  useGeneralPart,
  useOutputPart,
  useTaskPart
} from '../../../components/parts';
import Part from '../part/Part';

const TaskSwitchEventEditor = memo(() => {
  const name = useGeneralPart();
  const task = useTaskPart();
  const casePart = useCasePart();
  const endPage = useEndPagePart();
  const output = useOutputPart();
  return <Part parts={[name, task, casePart, endPage, output]} />;
});

const WaitEventEditor = memo(() => {
  const name = useGeneralPart();
  const event = useEventPart();
  const configuration = useConfigurationPart();
  const task = useTaskPart({ type: 'wait' });
  const output = useOutputPart();
  return <Part parts={[name, event, configuration, task, output]} />;
});

export const intermediateEventEditors = new Map<ElementType, KnownEditor>([
  ['TaskSwitchEvent', { editor: <TaskSwitchEventEditor />, icon: IvyIcons.Task }],
  ['WaitEvent', { editor: <WaitEventEditor />, icon: IvyIcons.ClockOutline }]
]);
