import { useAction, useEditorContext, useMeta } from '../../../../../context';
import type { FieldsetControl, SelectItem } from '../../../../widgets';
import { Select } from '../../../../widgets';
import { PathFieldset } from '../../../common';
import { useRestRequestData } from '../../useRestRequestData';
import { IvyIcons } from '@axonivy/ui-icons';

export const RestClientSelect = () => {
  const { config, updateTarget } = useRestRequestData();

  const { context } = useEditorContext();
  const items = useMeta('meta/rest/clients', context, []).data.map<SelectItem>(client => ({ label: client.name, value: client.clientId }));
  const selectedItem = items.find(i => i.value === config.target.clientId) ?? {
    label: config.target.clientId,
    value: config.target.clientId
  };

  const newAction = useAction('newRestClient');
  const openAction = useAction('openConfig');
  const controls: FieldsetControl[] = [
    { label: 'Open Rest config', icon: IvyIcons.GoToSource, action: () => openAction() },
    { label: 'Create new Rest Client', icon: IvyIcons.Plus, action: () => newAction() }
  ];

  return (
    <PathFieldset label='Client' path='clientId' controls={controls}>
      <div className='rest-client-select'>
        <Select value={selectedItem} onChange={item => updateTarget('clientId', item.value)} items={items} />
      </div>
    </PathFieldset>
  );
};
