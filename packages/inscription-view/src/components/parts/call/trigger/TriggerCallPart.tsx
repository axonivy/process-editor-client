import { useMemo } from 'react';
import { useAction, useEditorContext, useMeta, useValidations } from '../../../../context';
import { usePartDirty, usePartState, type PartProps } from '../../../editors/part/usePart';
import type { CallData, ProcessCallData, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import CallMapping, { useCallPartValidation } from '../CallMapping';
import { useCallData, useProcessCallData } from '../useCallData';
import CallSelect from '../CallSelect';
import { IvyIcons } from '@axonivy/ui-icons';
import type { FieldsetControl } from '../../../../components/widgets';
import { PathCollapsible, ValidationFieldset } from '../../common';

export function useTriggerCallPart(): PartProps {
  const callData = useCallData();
  const targetData = useProcessCallData();
  const compareData = (callData: CallData, targetData: ProcessCallData) => [callData.call, targetData.processCall];
  const triggerCallValidations = useValidations(['processCall']);
  const callValidations = useCallPartValidation();
  const state = usePartState(
    compareData(callData.defaultConfig, targetData.defaultConfig),
    compareData(callData.config, targetData.config),
    [...triggerCallValidations, ...callValidations]
  );
  const dirty = usePartDirty(compareData(callData.initConfig, targetData.initConfig), compareData(callData.config, targetData.config));
  return { name: 'Process', state, reset: { dirty, action: () => targetData.resetData() }, content: <TriggerCallPart /> };
}

const TriggerCallPart = () => {
  const { config, defaultConfig, update } = useProcessCallData();

  const { context } = useEditorContext();
  const { data: startItems } = useMeta('meta/start/triggers', context, []);

  const variableInfo = useMemo<VariableInfo>(
    () => startItems.find(start => start.id === config.processCall)?.callParameter ?? { variables: [], types: {} },
    [config.processCall, startItems]
  );

  const action = useAction('newProcess');
  const createProcess: FieldsetControl = { label: 'Create new Trigger Process', icon: IvyIcons.Plus, action: () => action() };
  return (
    <>
      <PathCollapsible
        label='Process start'
        controls={[createProcess]}
        defaultOpen={config.processCall !== defaultConfig.processCall}
        path='processCall'
      >
        <ValidationFieldset>
          <CallSelect
            start={config.processCall}
            onChange={change => update('processCall', change)}
            starts={startItems}
            startIcon={IvyIcons.Start}
          />
        </ValidationFieldset>
      </PathCollapsible>
      <CallMapping variableInfo={variableInfo} />
    </>
  );
};
