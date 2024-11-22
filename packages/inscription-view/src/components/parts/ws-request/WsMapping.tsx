import { PathContext, useEditorContext, useMeta } from '../../../context';
import { MappingPart } from '../common';
import { useWsRequestData } from './useWsRequestData';

export const WsMapping = () => {
  const { config, updateOperation } = useWsRequestData();

  const { context } = useEditorContext();
  const variableInfo = useMeta('meta/webservice/operations', { clientId: config.clientId, port: config.operation.port, context }, [])
    .data.filter(operation => operation.name === config.operation.name)
    .map(operation => operation.parameter)
    .find(() => true) ?? { variables: [], types: {} };

  return (
    <PathContext path='operation'>
      <MappingPart
        data={config.operation.parameters}
        onChange={change => updateOperation('parameters', change)}
        variableInfo={variableInfo}
        path='parameters'
        browsers={['attr', 'func', 'type', 'cms']}
      />
    </PathContext>
  );
};
