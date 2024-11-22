import { ScriptInput } from '../../../../components/widgets';
import { PathFieldset, ValidationCollapsible } from '../../common';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useQueryData } from '../useQueryData';

export const Limit = () => {
  const { config, defaultConfig, update } = useQueryData();

  return (
    <ValidationCollapsible
      label='Limit'
      defaultOpen={config.query.limit !== defaultConfig.query.limit || config.query.offset !== defaultConfig.query.offset}
      paths={['limit', 'offset']}
    >
      <PathFieldset label='Lot size' path='limit'>
        <ScriptInput
          value={config.query.limit}
          onChange={change => update('limit', change)}
          type={IVY_SCRIPT_TYPES.NUMBER}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
      <PathFieldset label='Start index' path='offset'>
        <ScriptInput
          value={config.query.offset}
          onChange={change => update('offset', change)}
          type={IVY_SCRIPT_TYPES.NUMBER}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
    </ValidationCollapsible>
  );
};
