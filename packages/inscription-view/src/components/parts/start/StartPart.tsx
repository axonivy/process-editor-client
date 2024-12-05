import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useStartData } from './useStartData';
import type { StartData } from '@axonivy/process-editor-inscription-protocol';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { useValidations } from '../../../context/useValidation';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import Input from '../../widgets/input/Input';
import { PathContext } from '../../../context/usePath';
import ParameterTable from '../common/parameter/ParameterTable';
import MappingPart from '../common/mapping-tree/MappingPart';
import { ScriptArea } from '../../widgets/code-editor/ScriptArea';

type StartPartProps = { hideParamDesc?: boolean; synchParams?: boolean };

export const useStartPartValidation = () => {
  const signarture = useValidations(['signature']);
  const input = useValidations(['input']);
  return [...signarture, ...input];
};

export function useStartPart(props?: StartPartProps): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useStartData();
  const validations = useStartPartValidation();
  const compareData = (data: StartData) => [data.signature, data.input];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Start',
    state,
    reset: { dirty, action: () => resetData() },
    content: <StartPart {...props} />
  };
}

const StartPart = ({ hideParamDesc, synchParams }: StartPartProps) => {
  const { config, defaultConfig, updateSignature, update } = useStartData(synchParams);

  const { elementContext: context } = useEditorContext();
  const { data: variableInfo } = useMeta('meta/scripting/out', { context, location: 'input' }, { variables: [], types: {} });

  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <>
      <PathCollapsible label='Signature' path='signature' defaultOpen={config.signature !== defaultConfig.signature}>
        <ValidationFieldset>
          <Input value={config.signature} onChange={change => updateSignature(change)} />
        </ValidationFieldset>
      </PathCollapsible>
      <PathContext path='input'>
        <ParameterTable
          label='Input parameters'
          data={config.input.params}
          onChange={change => update('params', change)}
          hideDesc={hideParamDesc}
        />
        <MappingPart
          data={config.input.map}
          variableInfo={variableInfo}
          onChange={change => update('map', change)}
          browsers={['attr', 'func', 'type']}
        />
        <PathCollapsible label='Code' path='code' controls={[maximizeCode]} defaultOpen={config.input.code !== defaultConfig.input.code}>
          <ValidationFieldset>
            <ScriptArea
              maximizeState={maximizeState}
              value={config.input.code}
              onChange={change => update('code', change)}
              browsers={['attr', 'func', 'type']}
            />
          </ValidationFieldset>
        </PathCollapsible>
      </PathContext>
    </>
  );
};
