import { deepEqual } from '../../../../../utils/equals';
import { PathContext, useMeta } from '../../../../../context';
import { PropertyTable } from '../../../common/properties/PropertyTable';
import { useRestRequestData } from '../../useRestRequestData';

export const RestProperties = () => {
  const { config, defaultConfig, updateTarget } = useRestRequestData();

  const knownProperties = useMeta('meta/rest/properties', undefined, []).data;

  return (
    <PathContext path='properties'>
      <PropertyTable
        properties={config.target.properties}
        update={change => updateTarget('properties', change)}
        knownProperties={knownProperties}
        label='Properties'
        defaultOpen={!deepEqual(config.target.properties, defaultConfig.target.properties)}
      />
    </PathContext>
  );
};
