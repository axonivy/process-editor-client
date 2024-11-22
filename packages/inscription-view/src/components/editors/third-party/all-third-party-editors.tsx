import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { thirdPartyInterfaceActivityEditors } from './interface';
import { thirdPartyStartEventEditors } from './start';
import { thirdPartyIntermediateEventEditors } from './intermediate';
import type { KnownEditor } from '../InscriptionEditor';

export const thirdPartyEditors = new Map<ElementType, KnownEditor>([
  ...thirdPartyInterfaceActivityEditors,
  ...thirdPartyStartEventEditors,
  ...thirdPartyIntermediateEventEditors
]);
