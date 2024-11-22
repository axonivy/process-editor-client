/* eslint-disable react/jsx-key */
import { IvyIcons } from '@axonivy/ui-icons';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';
import NameEditor from '../NameEditor';
import { useCasePart, useGeneralPart, useResultPart, useStartPart, useTaskPart, useWebServicePart } from '../../../components/parts';
import Part from '../part/Part';

const WebserviceStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useStartPart({ synchParams: true });
  const result = useResultPart();
  const webService = useWebServicePart();
  const task = useTaskPart({ type: 'ws' });
  const casePart = useCasePart();
  return <Part parts={[name, start, result, webService, task, casePart]} />;
});

export const webServiceEventEditors = new Map<ElementType, KnownEditor>([
  ['WebserviceStart', { editor: <WebserviceStartEditor />, icon: IvyIcons.WebService }],
  ['WebserviceEnd', { editor: <NameEditor />, icon: IvyIcons.WebService }]
]);
