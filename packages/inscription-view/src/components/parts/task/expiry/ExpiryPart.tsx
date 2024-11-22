import { ScriptInput } from '../../../../components/widgets';
import { PathCollapsible, PathFieldset } from '../../common';
import { ResponsiblePart } from '../../common/responsible/ResponsiblePart';
import { PriorityPart } from '../priority/PriorityPart';
import ErrorSelect from './ErrorSelect';
import { useExpiryData } from './useExpiryData';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';

const ExpiryPart = () => {
  const { expiry, update, updateResponsible, updatePriority } = useExpiryData();
  const isTimeoutDefined = expiry.timeout.length > 0;
  return (
    <PathCollapsible label='Expiry' defaultOpen={isTimeoutDefined} path='expiry'>
      <PathFieldset label='Timeout' path='timeout'>
        <ScriptInput
          value={expiry.timeout}
          onChange={change => update('timeout', change)}
          type={IVY_SCRIPT_TYPES.DURATION}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
      {isTimeoutDefined && (
        <>
          <ErrorSelect value={expiry.error} onChange={change => update('error', change)} />
          <ResponsiblePart responsible={expiry.responsible} updateResponsible={updateResponsible} />
          <PriorityPart priority={expiry.priority} updatePriority={updatePriority} />
        </>
      )}
    </PathCollapsible>
  );
};

export default ExpiryPart;
