import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';
import Part from '../part/Part';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useProgramStartPart } from '../../parts/program/event/ProgramStartPart';
import { useConfigurationPart } from '../../parts/program/configuration/ConfigurationPart';

const ThirdPartyProgramStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useProgramStartPart({ thirdParty: true });
  const configuration = useConfigurationPart();
  return <Part parts={[name, start, configuration]} />;
});

export const thirdPartyStartEventEditors = new Map<ElementType, KnownEditor>([
  ['ThirdPartyProgramStart', { editor: <ThirdPartyProgramStartEditor /> }]
]);
