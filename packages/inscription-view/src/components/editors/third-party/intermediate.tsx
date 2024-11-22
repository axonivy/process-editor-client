/* eslint-disable react/jsx-key */
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';
import { useConfigurationPart, useEventPart, useGeneralPart, useOutputPart, useTaskPart } from '../../../components/parts';
import Part from '../part/Part';

const ThirdPartyWaitEventEditor = memo(() => {
  const name = useGeneralPart();
  const event = useEventPart({ thirdParty: true });
  const configuration = useConfigurationPart();
  const task = useTaskPart({ type: 'wait' });
  const output = useOutputPart();
  return <Part parts={[name, event, configuration, task, output]} />;
});

export const thirdPartyIntermediateEventEditors = new Map<ElementType, KnownEditor>([
  ['ThirdPartyWaitEvent', { editor: <ThirdPartyWaitEventEditor /> }]
]);
