/* eslint-disable react/jsx-key */
import { IvyIcons } from '@axonivy/ui-icons';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';
import { useSignalCatchPart, useGeneralPart, useOutputPart, useErrorCatchPart } from '../../../components/parts';
import Part from '../part/Part';

const ErrorBoundaryEventEditor = memo(() => {
  const name = useGeneralPart();
  const error = useErrorCatchPart();
  const output = useOutputPart();
  return <Part parts={[name, error, output]} />;
});

const SignalBoundaryEventEditor = memo(() => {
  const name = useGeneralPart();
  const signal = useSignalCatchPart({ makroSupport: true, withBrowser: true });
  const output = useOutputPart();
  return <Part parts={[name, signal, output]} />;
});

export const boundaryEventEditors = new Map<ElementType, KnownEditor>([
  ['ErrorBoundaryEvent', { editor: <ErrorBoundaryEventEditor />, icon: IvyIcons.ErrorStart }],
  ['SignalBoundaryEvent', { editor: <SignalBoundaryEventEditor />, icon: IvyIcons.StartSignalOutline }]
]);
