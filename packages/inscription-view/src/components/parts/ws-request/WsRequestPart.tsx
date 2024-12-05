import type { WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useWsRequestData } from './useWsRequestData';
import { WsClientSelect } from './WsClientSelect';
import { WsPortSelect } from './WsPortSelect';
import { WsOperationSelect } from './WsOperationSelect';
import { WsProperties } from './WsProperties';
import { WsMapping } from './WsMapping';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { useValidations } from '../../../context/useValidation';

export function useWsRequestPart(): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useWsRequestData();
  const validations = [...useValidations(['clientId']), ...useValidations(['operation']), ...useValidations(['properties'])];
  const compareData = (data: WsRequestData) => [data.clientId, data.operation, data.properties];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Request', state: state, reset: { dirty, action: () => resetData() }, content: <WsRequestPart /> };
}

const WsRequestPart = () => {
  const { config, defaultConfig } = useWsRequestData();
  return (
    <>
      <ValidationCollapsible label='Web Service' defaultOpen={config.clientId !== defaultConfig.clientId}>
        <WsClientSelect />
        <WsPortSelect />
        <WsOperationSelect />
      </ValidationCollapsible>
      <WsProperties />
      <WsMapping />
    </>
  );
};
