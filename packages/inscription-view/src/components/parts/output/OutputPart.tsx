import type { OutputData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useOutputData } from './useOutputData';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { useValidations } from '../../../context/useValidation';
import type { BrowserType } from '../../browser/useBrowser';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathContext } from '../../../context/usePath';
import MappingPart from '../common/mapping-tree/MappingPart';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { ScriptArea } from '../../widgets/code-editor/ScriptArea';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { IvyIcons } from '@axonivy/ui-icons';

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
    content: <OutputPart showSudo={options?.showSudo} additionalBrowsers={options?.additionalBrowsers} />,
    icon: IvyIcons.Script
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
