import { useMemo } from 'react';
import { useAction, useEditorContext, useMeta, useValidations } from '../../../../context';
import { usePartDirty, usePartState, type PartProps } from '../../../editors/part/usePart';
import type { CallData, DialogCallData, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import CallMapping, { useCallPartValidation } from '../CallMapping';
import { useCallData, useDialogCallData } from '../useCallData';
import CallSelect from '../CallSelect';
import { IvyIcons } from '@axonivy/ui-icons';
import type { FieldsetControl } from '../../../../components/widgets';
import { PathCollapsible, ValidationFieldset } from '../../common';

export function useDialogCallPart(options?: { offline?: boolean }): PartProps {
  const callData = useCallData();
  const targetData = useDialogCallData();
  const compareData = (callData: CallData, targetData: DialogCallData) => [callData.call, targetData.dialog];
  const dialogValidations = useValidations(['dialog']);
  const callValidations = useCallPartValidation();
  const state = usePartState(
    compareData(callData.defaultConfig, targetData.defaultConfig),
    compareData(callData.config, targetData.config),
    [...dialogValidations, ...callValidations]
  );
  const dirty = usePartDirty(compareData(callData.initConfig, targetData.initConfig), compareData(callData.config, targetData.config));
  return {
    name: 'Dialog',
    state,
    reset: { dirty, action: () => targetData.resetData() },
    content: <DialogCallPart offline={options?.offline} />
  };
}

const DialogCallPart = ({ offline }: { offline?: boolean }) => {
  const { config, defaultConfig, update } = useDialogCallData();

  const { context } = useEditorContext();
  const { data: startItems } = useMeta('meta/start/dialogs', { context, supportOffline: offline ?? false }, []);

  const variableInfo = useMemo<VariableInfo>(
    () => startItems.find(start => start.id === config.dialog)?.callParameter ?? { variables: [], types: {} },
    [config.dialog, startItems]
  );

  const action = useAction('newHtmlDialog');
  const createDialog: FieldsetControl = { label: 'Create new Html Dialog', icon: IvyIcons.Plus, action: () => action() };
  return (
    <>
      <PathCollapsible label='Dialog' controls={[createDialog]} defaultOpen={config.dialog !== defaultConfig.dialog} path='dialog'>
        <ValidationFieldset>
          <CallSelect
            start={config.dialog}
            onChange={change => update('dialog', change)}
            starts={startItems}
            startIcon={IvyIcons.InitStart}
          />
        </ValidationFieldset>
      </PathCollapsible>
      <CallMapping variableInfo={variableInfo} />
    </>
  );
};
