/* eslint-disable react/jsx-key */
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import NameEditor from './NameEditor';
import { IvyIcons } from '@axonivy/ui-icons';
import { useGeneralPart } from '../parts';
import { useProcessDataPart } from '../parts/process-data/ProcessDataPart';
import { usePermissionsPart } from '../parts/permissions/PermissionsPart';
import { type KnownEditor } from './InscriptionEditor';
import { useWebServiceProcessPart } from '../parts/web-service-process/WebServiceProcessPart';
import Part from './part/Part';

const BusinessProcessEditor = memo(() => {
  const name = useGeneralPart({ disableName: true, hideTags: true });
  const processData = useProcessDataPart();
  const permissions = usePermissionsPart();
  return <Part parts={[name, processData, permissions]} />;
});

const WebserviceProcessEditor = memo(() => {
  const name = useGeneralPart({ disableName: true, hideTags: true });
  const webServiceProcess = useWebServiceProcessPart();
  const processData = useProcessDataPart();
  const permissions = usePermissionsPart();
  return <Part parts={[name, webServiceProcess, processData, permissions]} />;
});

const CallableSubProcessEditor = memo(() => {
  const name = useGeneralPart({ disableName: true, hideTags: true });
  const processData = useProcessDataPart();
  const permissions = usePermissionsPart();
  return <Part parts={[name, processData, permissions]} />;
});

const HTMLDialogLogicEditor = memo(() => {
  const name = useGeneralPart({ disableName: true, hideTags: true });
  const permissions = usePermissionsPart();
  return <Part parts={[name, permissions]} />;
});

export const otherEditors = new Map<ElementType, KnownEditor>([
  ['ProcessAnnotation', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.Note }],
  ['Process', { editor: <BusinessProcessEditor />, icon: IvyIcons.Process }],
  ['WebserviceProcess', { editor: <WebserviceProcessEditor />, icon: IvyIcons.Process }],
  ['CallableSubProcess', { editor: <CallableSubProcessEditor />, icon: IvyIcons.Process }],
  ['HtmlDialogProcess', { editor: <HTMLDialogLogicEditor />, icon: IvyIcons.Process }]
]);
