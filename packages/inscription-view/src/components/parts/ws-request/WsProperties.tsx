import { useWsRequestData } from './useWsRequestData';
import { PathContext, useEditorContext, useMeta } from '../../../context';
import { PropertyTable } from '../common/properties/PropertyTable';
import { deepEqual } from '../../../utils/equals';

export const WsProperties = () => {
  const { config, defaultConfig, update } = useWsRequestData();

  const { context } = useEditorContext();
  const knownProperties = useMeta('meta/webservice/properties', { clientId: config.clientId, context }, []).data;

  return (
    <PathContext path='properties'>
      <PropertyTable
        properties={config.properties}
        update={change => update('properties', change)}
        knownProperties={knownProperties}
        label='Properties'
        defaultOpen={!deepEqual(config.properties, defaultConfig.properties)}
      />
    </PathContext>
  );
};
