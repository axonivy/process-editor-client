/* eslint-disable react/jsx-key */
import { IvyIcons } from '@axonivy/ui-icons';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';
import NameEditor from '../NameEditor';
import { useGeneralPart, useOutputPart, useResultPart, useStartPart } from '../../../components/parts';
import Part from '../part/Part';

const HtmlDialogStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useStartPart({ synchParams: true });
  const result = useResultPart();
  return <Part parts={[name, start, result]} />;
});

const HtmlDialogMethodStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useStartPart({ hideParamDesc: true, synchParams: true });
  const result = useResultPart({ hideParamDesc: true });
  return <Part parts={[name, start, result]} />;
});

const HtmlDialogEventStartEditor = memo(() => {
  const name = useGeneralPart();
  const output = useOutputPart();
  return <Part parts={[name, output]} />;
});

export const htmlDialogEventEditors = new Map<ElementType, KnownEditor>([
  ['HtmlDialogStart', { editor: <HtmlDialogStartEditor />, icon: IvyIcons.InitStart }],
  ['HtmlDialogMethodStart', { editor: <HtmlDialogMethodStartEditor />, icon: IvyIcons.MethodStart }],
  ['HtmlDialogEventStart', { editor: <HtmlDialogEventStartEditor />, icon: IvyIcons.EventStart }],
  ['HtmlDialogExit', { editor: <NameEditor />, icon: IvyIcons.ExitEnd }],
  ['HtmlDialogEnd', { editor: <NameEditor />, icon: IvyIcons.ProcessEnd }]
]);
