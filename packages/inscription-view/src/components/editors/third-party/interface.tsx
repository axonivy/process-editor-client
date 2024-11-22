/* eslint-disable react/jsx-key */
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';
import { useGeneralPart, useProgramInterfaceErrorPart, useConfigurationPart } from '../../../components/parts';
import Part from '../part/Part';

const ThirdPartyProgramInterfaceEditor = memo(() => {
  const name = useGeneralPart();
  const error = useProgramInterfaceErrorPart();
  const configuration = useConfigurationPart();
  return <Part parts={[name, error, configuration]} />;
});

export const thirdPartyInterfaceActivityEditors = new Map<ElementType, KnownEditor>([
  ['ThirdPartyProgramInterface', { editor: <ThirdPartyProgramInterfaceEditor /> }]
]);
