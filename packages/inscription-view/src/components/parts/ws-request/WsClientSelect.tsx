import { useAction } from '../../../context/useAction';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import type { FieldsetControl } from '../../widgets/fieldset/fieldset-control';
import Select, { type SelectItem } from '../../widgets/select/Select';
import { PathFieldset } from '../common/path/PathFieldset';
import { useWsRequestData } from './useWsRequestData';
import { IvyIcons } from '@axonivy/ui-icons';

export const WsClientSelect = () => {
  const { config, update } = useWsRequestData();

  const { context } = useEditorContext();
  const items = useMeta('meta/webservice/clients', context, []).data.map<SelectItem>(client => {
    return { label: client.name, value: client.clientId };
  });
  const selectedItem = items.find(i => i.value === config.clientId) ?? { label: config.clientId, value: config.clientId };

  const newAction = useAction('newWebServiceClient');
  const openAction = useAction('openConfig');
  const openWsConfig: FieldsetControl = { label: 'Open WebService config', icon: IvyIcons.GoToSource, action: () => openAction() };
  const createWsClient: FieldsetControl = { label: 'Create new WebService Client', icon: IvyIcons.Plus, action: () => newAction() };

  return (
    <PathFieldset label='Client' path='clientId' controls={[openWsConfig, createWsClient]}>
      <Select value={selectedItem} onChange={item => update('clientId', item.value)} items={items} />
    </PathFieldset>
  );
};
