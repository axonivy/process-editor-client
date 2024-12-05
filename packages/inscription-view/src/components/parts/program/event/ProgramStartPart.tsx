import type { ProgramStartData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../../editors/part/usePart';
import { useProgramStartData } from './useProgramStartData';
import { Permission } from '../../common/permission/Permission';
import JavaClassSelector from '../JavaClassSelector';
import { useValidations } from '../../../../context/useValidation';

export function useProgramStartPart(options?: { thirdParty?: boolean }): PartProps {
  const { config, defaultConfig, initConfig, reset } = useProgramStartData();
  const compareData = (data: ProgramStartData) => [data.javaClass, data.permission];
  const validation = useValidations(['javaClass']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Java Bean',
    state,
    reset: { dirty, action: () => reset() },
    content: <ProgramStartPart thirdParty={options?.thirdParty} />
  };
}

const ProgramStartPart = ({ thirdParty }: { thirdParty?: boolean }) => {
  const { config, defaultConfig, update, updatePermission } = useProgramStartData();

  return (
    <>
      {(thirdParty === undefined || thirdParty === false) && (
        <JavaClassSelector javaClass={config.javaClass} onChange={change => update('javaClass', change)} type='START' />
      )}

      <Permission
        anonymousFieldActive={true}
        config={config.permission}
        defaultConfig={defaultConfig.permission}
        updatePermission={updatePermission}
      />
    </>
  );
};
