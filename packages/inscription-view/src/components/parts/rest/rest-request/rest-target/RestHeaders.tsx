import { useRestRequestData } from '../../useRestRequestData';
import { deepEqual } from '../../../../../utils/equals';
import { PropertyTable } from '../../../common/properties/PropertyTable';
import { useRestResourceMeta } from '../../useRestResourceMeta';
import { useMeta } from '../../../../../context/useMeta';
import { PathCollapsible } from '../../../common/path/PathCollapsible';
import Fieldset from '../../../../widgets/fieldset/Fieldset';
import Combobox, { type ComboboxItem } from '../../../../widgets/combobox/Combobox';

export const RestHeaders = () => {
  const { config, defaultConfig, updateTarget, updateAcceptHeader } = useRestRequestData();

  const knownContentTypes = useMeta('meta/rest/contentTypes', { forBody: false }, []).data.map<ComboboxItem>(type => ({ value: type }));
  const knownHeaders = useMeta('meta/rest/headers', undefined, []).data;
  const restResourceHeaders = useRestResourceMeta().headers?.map(header => header.name) ?? [];

  return (
    <PathCollapsible label='Headers' path='headers' defaultOpen={!deepEqual(config.target.headers, defaultConfig.target.headers)}>
      <Fieldset label='Accept'>
        <Combobox value={config.target.headers['Accept']} onChange={updateAcceptHeader} items={knownContentTypes} />
      </Fieldset>
      <PropertyTable
        properties={config.target.headers}
        update={change => updateTarget('headers', change)}
        knownProperties={[...restResourceHeaders, ...knownHeaders]}
        hideProperties={['Accept']}
        label='Accept-Properties'
        defaultOpen={true}
      />
    </PathCollapsible>
  );
};
