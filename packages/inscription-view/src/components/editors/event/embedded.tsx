/* eslint-disable react/jsx-key */
import { IvyIcons } from '@axonivy/ui-icons';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import NameEditor from '../NameEditor';
import type { KnownEditor } from '../InscriptionEditor';

export const embeddedEventEditors = new Map<ElementType, KnownEditor>([
  ['EmbeddedStart', { editor: <NameEditor />, icon: IvyIcons.Start }],
  ['EmbeddedEnd', { editor: <NameEditor />, icon: IvyIcons.ProcessEnd }]
]);
