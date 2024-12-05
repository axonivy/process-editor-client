import { useRestRequestData } from '../../useRestRequestData';
import { RestEntityTypeCombobox, useShowRestEntityTypeCombo } from '../../RestEntityTypeCombobox';
import { useRestEntityTypeMeta, useRestResourceMeta } from '../../useRestResourceMeta';
import { EMPTY_VAR_INFO } from '@axonivy/process-editor-inscription-protocol';
import useMaximizedCodeEditor from '../../../../browser/useMaximizedCodeEditor';
import { MappingField } from '../../../common/mapping-tree/MappingPart';
import { PathContext } from '../../../../../context/usePath';
import { PathFieldset } from '../../../common/path/PathFieldset';
import { useEditorContext } from '../../../../../context/useEditorContext';
import { useMeta } from '../../../../../context/useMeta';
import { ScriptArea } from '../../../../widgets/code-editor/ScriptArea';

const useShowEntityTypeCombo = (types: string[], currentType: string) => {
  const resource = useRestResourceMeta();
  return useShowRestEntityTypeCombo(types, currentType, resource?.method?.inBody);
};

export const RestEntity = () => {
  const { config, updateEntity } = useRestRequestData();
  const { context } = useEditorContext();
  const variableInfo = useMeta('meta/rest/entityInfo', { context, fullQualifiedName: config.body.entity.type }, EMPTY_VAR_INFO).data;
  const entityTypes = useRestEntityTypeMeta('entity');
  const showEntityType = useShowEntityTypeCombo(entityTypes, config.body.entity.type);
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();
  return (
    <PathContext path='entity'>
      {showEntityType && (
        <PathFieldset label='Entity-Type' path='type'>
          <RestEntityTypeCombobox value={config.body.entity.type} onChange={change => updateEntity('type', change)} items={entityTypes} />
        </PathFieldset>
      )}
      <MappingField
        browsers={['attr', 'func', 'type']}
        data={config.body.entity.map}
        onChange={change => updateEntity('map', change)}
        variableInfo={variableInfo}
      />
      <PathFieldset label='Code' path='code' controls={[maximizeCode]}>
        <ScriptArea
          maximizeState={maximizeState}
          value={config.body.entity.code}
          onChange={change => updateEntity('code', change)}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
    </PathContext>
  );
};
