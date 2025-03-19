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
import { useTranslation } from 'react-i18next';

export function useWsRequestPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, resetData } = useWsRequestData();
  const validations = [...useValidations(['clientId']), ...useValidations(['operation']), ...useValidations(['properties'])];
  const compareData = (data: WsRequestData) => [data.clientId, data.operation, data.properties];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: t('part.ws.request'), state: state, reset: { dirty, action: () => resetData() }, content: <WsRequestPart /> };
}

const WsRequestPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig } = useWsRequestData();
  return (
    <>
      <ValidationCollapsible label={t('part.ws.title')} defaultOpen={config.clientId !== defaultConfig.clientId}>
        <WsClientSelect />
        <WsPortSelect />
        <WsOperationSelect />
      </ValidationCollapsible>
      <WsProperties />
      <WsMapping />
    </>
  );
};
