import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useTriggerData } from './useTriggerData';
import type { TriggerData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { ResponsibleCollapsible } from '../common/responsible/ResponsiblePart';
import { useValidations } from '../../../context/useValidation';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { PathContext } from '../../../context/usePath';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { PathFieldset } from '../common/path/PathFieldset';
import { ScriptInput } from '../../widgets/code-editor/ScriptInput';
import EmptyWidget from '../../widgets/empty/EmptyWidget';

export function useTriggerPart(): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useTriggerData();
  const responsibleVal = useValidations(['task', 'responsible']);
  const delayVal = useValidations(['task', 'delay']);
  const compareData = (data: TriggerData) => [data.triggerable, data.case.attachToBusinessCase, data.task?.responsible, data.task?.delay];
  const state = usePartState(compareData(defaultConfig), compareData(config), [...responsibleVal, ...delayVal]);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Trigger', state: state, reset: { dirty, action: () => resetData() }, content: <TriggerPart /> };
}

const TriggerPart = () => {
  const { config, defaultConfig, update, updateResponsible, updateDelay, updateAttach } = useTriggerData();

  return (
    <>
      {defaultConfig.task ? (
        <>
          <Checkbox
            value={config.triggerable}
            onChange={change => update('triggerable', change)}
            label='Yes, this can be started with a Trigger Activity'
          />
          {config.triggerable && (
            <PathContext path='task'>
              <ResponsibleCollapsible
                responsible={config.task.responsible}
                defaultResponsible={defaultConfig.task.responsible}
                updateResponsible={updateResponsible}
              />
              <ValidationCollapsible label='Options' defaultOpen={!config.case.attachToBusinessCase || config.task.delay.length > 0}>
                <Checkbox
                  value={config.case.attachToBusinessCase}
                  onChange={change => updateAttach(change)}
                  label='Attach to Business Case that triggered this process'
                />
                <PathFieldset label='Delay' path='delay'>
                  <ScriptInput
                    value={config.task.delay}
                    onChange={change => updateDelay(change)}
                    type={IVY_SCRIPT_TYPES.DURATION}
                    browsers={['attr', 'func', 'type']}
                  />
                </PathFieldset>
              </ValidationCollapsible>
            </PathContext>
          )}
        </>
      ) : (
        <EmptyWidget message='There is no (Task) output flow connected.' />
      )}
    </>
  );
};
