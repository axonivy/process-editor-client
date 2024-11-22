/* eslint-disable react/jsx-key */
import { IvyIcons } from '@axonivy/ui-icons';
import { memo } from 'react';
import NameEditor from '../NameEditor';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { useGeneralPart, useResultPart, useStartPart } from '../../../components/parts';
import { type KnownEditor } from '../InscriptionEditor';
import Part from '../part/Part';

const CallSubStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useStartPart({ synchParams: true });
  const result = useResultPart();
  return <Part parts={[name, start, result]} />;
});

export const callSubEventEditors = new Map<ElementType, KnownEditor>([
  ['CallSubStart', { editor: <CallSubStartEditor />, icon: IvyIcons.SubStart }],
  ['CallSubEnd', { editor: <NameEditor />, icon: IvyIcons.SubEnd }]
]);
