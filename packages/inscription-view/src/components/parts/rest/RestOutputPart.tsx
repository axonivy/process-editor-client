import type { RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useRestOutputData } from './useRestOutputData';
import { RestEntityTypeCombobox, useShowRestEntityTypeCombo } from './RestEntityTypeCombobox';
import { useRestEntityTypeMeta, useRestResourceMeta } from './useRestResourceMeta';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { useValidations } from '../../../context/useValidation';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathContext } from '../../../context/usePath';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import MappingPart from '../common/mapping-tree/MappingPart';
import { ScriptArea } from '../../widgets/code-editor/ScriptArea';

export function useRestOutputPart(): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useRestOutputData();
  const validations = useValidations(['response']);
  const filteredOutputValidations = validations.filter(item => item.path.startsWith('response.entity'));
  const compareData = (data: RestResponseData) => [data.response.entity];
  const state = usePartState(compareData(defaultConfig), compareData(config), filteredOutputValidations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Output', state: state, reset: { dirty, action: () => resetData() }, content: <RestOutputPart /> };
}

const useShowResultTypeCombo = (types: string[], currentType: string) => {
  const resource = useRestResourceMeta();
  return useShowRestEntityTypeCombo(types, currentType, resource?.method?.outResult);
};

const RestOutputPart = () => {
  const { config, defaultConfig, updateEntity } = useRestOutputData();
  const { elementContext: context } = useEditorContext();
  const { data: variableInfo } = useMeta('meta/scripting/out', { context, location: 'response' }, { variables: [], types: {} });
  const resultTypes = useRestEntityTypeMeta('result');
  const showResultType = useShowResultTypeCombo(resultTypes, config.response.entity.type);
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();
  return (
    <PathContext path='response'>
      <PathContext path='entity'>
        {showResultType && (
          <PathCollapsible label='Result Type' path='type' defaultOpen={config.response.entity.type !== defaultConfig.response.entity.type}>
            <ValidationFieldset label='Read body as type (result variable)'>
              <RestEntityTypeCombobox
                value={config.response.entity.type}
                onChange={change => updateEntity('type', change)}
                items={resultTypes}
              />
            </ValidationFieldset>
          </PathCollapsible>
        )}
        <MappingPart
          data={config.response.entity.map}
          variableInfo={variableInfo}
          browsers={['attr', 'func', 'type']}
          onChange={change => updateEntity('map', change)}
        />
        <PathCollapsible
          label='Code'
          path='code'
          controls={[maximizeCode]}
          defaultOpen={config.response.entity.code !== defaultConfig.response.entity.code}
        >
          <ValidationFieldset>
            <ScriptArea
              maximizeState={maximizeState}
              value={config.response.entity.code}
              onChange={change => updateEntity('code', change)}
              browsers={['attr', 'func', 'type']}
            />
          </ValidationFieldset>
        </PathCollapsible>
      </PathContext>
    </PathContext>
  );
};
