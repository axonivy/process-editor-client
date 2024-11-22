import { useEffect } from 'react';
import { ScriptArea } from '../../widgets';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useResultData } from './useResultData';
import type { ResultData } from '@axonivy/process-editor-inscription-protocol';
import { PathContext, useEditorContext, useMeta, useValidations } from '../../../context';
import { MappingPart, ParameterTable, PathCollapsible, ValidationFieldset } from '../common';
import { useQueryClient } from '@tanstack/react-query';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';

export function useResultPart(props?: { hideParamDesc?: boolean }): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useResultData();
  const compareData = (data: ResultData) => [data.result];
  const validations = useValidations(['result']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Result',
    state,
    reset: { dirty, action: () => resetData() },
    content: <ResultPart {...props} />
  };
}

const ResultPart = ({ hideParamDesc }: { hideParamDesc?: boolean }) => {
  const { config, defaultConfig, update } = useResultData();

  const { elementContext: context } = useEditorContext();
  const { data: variableInfo } = useMeta('meta/scripting/out', { context, location: 'result' }, { variables: [], types: {} });
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['meta/scripting/out'] });
  }, [config.result.params, queryClient]);

  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <PathContext path='result'>
      <ParameterTable
        label='Result parameters'
        data={config.result.params}
        onChange={change => update('params', change)}
        hideDesc={hideParamDesc}
      />
      <MappingPart
        data={config.result.map}
        variableInfo={variableInfo}
        onChange={change => update('map', change)}
        browsers={['attr', 'func', 'type']}
      />
      <PathCollapsible label='Code' path='code' controls={[maximizeCode]} defaultOpen={config.result.code !== defaultConfig.result.code}>
        <ValidationFieldset>
          <ScriptArea
            maximizeState={maximizeState}
            value={config.result.code}
            onChange={change => update('code', change)}
            browsers={['attr', 'func', 'type']}
          />
        </ValidationFieldset>
      </PathCollapsible>
    </PathContext>
  );
};
