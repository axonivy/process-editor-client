import { PathContext, useEditorContext, useMeta } from '../../../context';
import type { SelectItem } from '../../widgets';
import { Select } from '../../widgets';
import { PathFieldset } from '../common';
import { useWsRequestData } from './useWsRequestData';

export const WsOperationSelect = () => {
  const { config, updateOperation } = useWsRequestData();

  const { context } = useEditorContext();
  const items = useMeta(
    'meta/webservice/operations',
    { clientId: config.clientId, port: config.operation.port, context },
    []
  ).data.map<SelectItem>(operation => {
    return { label: operation.name, value: operation.name };
  });
  const selectedItem = items.find(i => i.value === config.operation.name) ?? { label: config.operation.name, value: config.operation.name };

  return (
    <PathContext path='operation'>
      <PathFieldset label='Operation' path='name'>
        <Select value={selectedItem} onChange={item => updateOperation('name', item.value)} items={items} />
      </PathFieldset>
    </PathContext>
  );
};
