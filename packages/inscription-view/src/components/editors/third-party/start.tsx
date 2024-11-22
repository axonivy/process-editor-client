/* eslint-disable react/jsx-key */
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';

import { useGeneralPart, useProgramStartPart, useConfigurationPart } from '../../../components/parts';
import Part from '../part/Part';

const ThirdPartyProgramStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useProgramStartPart({ thirdParty: true });
  const configuration = useConfigurationPart();
  return <Part parts={[name, start, configuration]} />;
});

export const thirdPartyStartEventEditors = new Map<ElementType, KnownEditor>([
  ['ThirdPartyProgramStart', { editor: <ThirdPartyProgramStartEditor /> }]
]);
