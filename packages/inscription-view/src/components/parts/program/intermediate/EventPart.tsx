import type { EventData, IntermediateEventTimeoutAction } from '@axonivy/process-editor-inscription-protocol';
import { EVENT_ACTION_TYPE, IVY_EXCEPTIONS, IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../../editors/part/usePart';
import { useEventData } from './useEventData';
import JavaClassSelector from '../JavaClassSelector';
import { deepEqual } from '../../../../utils/equals';
import { useValidations } from '../../../../context/useValidation';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import { PathFieldset } from '../../common/path/PathFieldset';
import ExceptionSelect from '../../common/exception-handler/ExceptionSelect';
import Radio from '../../../widgets/radio/Radio';

export function useEventPart(options?: { thirdParty?: boolean }): PartProps {
  const { config, defaultConfig, initConfig, reset } = useEventData();
  const compareData = (data: EventData) => [data.javaClass, data.eventId, data.timeout];
  const validation = [...useValidations(['timeout']), ...useValidations(['eventId']), ...useValidations(['javaClass'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Event',
    state,
    reset: { dirty, action: () => reset() },
    content: <EventPart thirdParty={options?.thirdParty} />
  };
}

const EventPart = ({ thirdParty }: { thirdParty?: boolean }) => {
  const { config, defaultConfig, update, updateTimeout } = useEventData();

  return (
    <>
      {(thirdParty === undefined || thirdParty === false) && (
        <JavaClassSelector javaClass={config.javaClass} onChange={change => update('javaClass', change)} type='INTERMEDIATE' />
      )}

      <PathCollapsible label='Event ID' path='eventId' defaultOpen={config.eventId !== defaultConfig.eventId}>
        <ValidationFieldset>
          <ScriptInput
            value={config.eventId}
            onChange={change => update('eventId', change)}
            type={IVY_SCRIPT_TYPES.NUMBER}
            browsers={['attr', 'func', 'type']}
          />
        </ValidationFieldset>
      </PathCollapsible>

      <PathCollapsible label='Expiry' path='timeout' defaultOpen={!deepEqual(config.timeout, defaultConfig.timeout)}>
        <PathFieldset label='Duration' path='duration'>
          <ScriptInput
            value={config.timeout.duration}
            onChange={change => updateTimeout('duration', change)}
            type={IVY_SCRIPT_TYPES.DURATION}
            browsers={['attr', 'func', 'type']}
          />
        </PathFieldset>
        <PathFieldset label='Error' path='error'>
          <ExceptionSelect
            value={config.timeout.error}
            onChange={change => updateTimeout('error', change)}
            staticExceptions={[IVY_EXCEPTIONS.intermediate]}
          />
        </PathFieldset>

        <PathFieldset label='Action' path='action'>
          <Radio
            value={config.timeout.action}
            onChange={change => updateTimeout('action', change as IntermediateEventTimeoutAction)}
            items={Object.entries(EVENT_ACTION_TYPE).map(([value, label]) => ({ label, value }))}
            orientation='vertical'
          />
        </PathFieldset>
      </PathCollapsible>
    </>
  );
};
