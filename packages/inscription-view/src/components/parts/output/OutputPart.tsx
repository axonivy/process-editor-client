import type { OutputData } from '@axonivy/process-editor-inscription-protocol';
import { Checkbox, ScriptArea } from '../../widgets';
import { PathContext, useEditorContext, useMeta, useValidations } from '../../../context';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useOutputData } from './useOutputData';
import { MappingPart, PathCollapsible, ValidationFieldset } from '../common';
import type { BrowserType } from '../../../components/browser';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';

export function useOutputPart(options?: { showSudo?: boolean; additionalBrowsers?: BrowserType[] }): PartProps {
  const { config, defaultConfig, initConfig, resetOutput } = useOutputData();
  const compareData = (data: OutputData) => [data];
  const validations = [...useValidations(['output']), ...useValidations(['map'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Output',
    state,
    reset: { dirty, action: () => resetOutput(options?.showSudo) },
    content: <OutputPart showSudo={options?.showSudo} additionalBrowsers={options?.additionalBrowsers} />
  };
}

const OutputPart = (props: { showSudo?: boolean; additionalBrowsers?: BrowserType[] }) => {
  const { config, defaultConfig, update, updateSudo } = useOutputData();

  const { elementContext: context } = useEditorContext();
  const { data: variableInfo } = useMeta('meta/scripting/out', { context, location: 'output' }, { variables: [], types: {} });

  const browsers: BrowserType[] = ['attr', 'func', 'type', ...(props.additionalBrowsers ?? [])];

  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <PathContext path='output'>
      <MappingPart data={config.output.map} variableInfo={variableInfo} onChange={change => update('map', change)} browsers={browsers} />
      <PathCollapsible
        label='Code'
        path='code'
        controls={[maximizeCode]}
        defaultOpen={config.output.code !== defaultConfig.output.code || config.sudo !== defaultConfig.sudo}
      >
        <ValidationFieldset>
          <ScriptArea
            maximizeState={maximizeState}
            value={config.output.code}
            onChange={change => update('code', change)}
            browsers={browsers}
          />
        </ValidationFieldset>
        {props.showSudo && (
          <Checkbox label='Disable Permission Checks (Execute this Script Step as SYSTEM)' value={config.sudo} onChange={updateSudo} />
        )}
      </PathCollapsible>
    </PathContext>
  );
};
