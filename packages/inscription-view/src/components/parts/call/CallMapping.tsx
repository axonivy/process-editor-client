import type { ValidationResult, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { ScriptArea } from '../../widgets';
import { useCallData } from './useCallData';
import { PathContext, useValidations } from '../../../context';
import { MappingPart, PathCollapsible, ValidationFieldset } from '../common';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';

export function useCallPartValidation(): ValidationResult[] {
  return useValidations(['call']);
}

const CallMapping = ({ variableInfo }: { variableInfo: VariableInfo }) => {
  const { config, defaultConfig, update } = useCallData();
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <PathContext path='call'>
      <MappingPart
        data={config.call.map}
        variableInfo={variableInfo}
        onChange={change => update('map', change)}
        browsers={['attr', 'func', 'type']}
      />
      <PathCollapsible label='Code' path='code' controls={[maximizeCode]} defaultOpen={config.call.code !== defaultConfig.call.code}>
        <ValidationFieldset>
          <ScriptArea
            maximizeState={maximizeState}
            value={config.call.code}
            onChange={change => update('code', change)}
            browsers={['attr', 'func', 'type']}
          />
        </ValidationFieldset>
      </PathCollapsible>
    </PathContext>
  );
};

export default memo(CallMapping);
