import type { WebServiceProcessData, WsAuth } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES, WS_AUTH_TYPE } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../../components/editors/part/usePart';
import { useValidations } from '../../../context';
import { Input, Radio } from '../../../components/widgets';
import { useWebServiceProcessData } from './useWebServiceProcessData';
import { PathFieldset, ValidationCollapsible } from '../common';

export function useWebServiceProcessPart(): PartProps {
  const { config, defaultConfig, initConfig, reset } = useWebServiceProcessData();
  const compareData = (data: WebServiceProcessData) => [data.wsAuth, data.wsTypeName];
  const validation = [...useValidations(['wsAuth']), ...useValidations(['wsTypeName'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Web Service Process', state, reset: { dirty, action: () => reset() }, content: <WebServiceProcessPart /> };
}

const WebServiceProcessPart = () => {
  const { config, defaultConfig, update } = useWebServiceProcessData();

  return (
    <ValidationCollapsible label='Process' defaultOpen={config.wsTypeName !== defaultConfig.wsTypeName}>
      <PathFieldset label='Qualified name' path='wsTypeName'>
        <Input value={config.wsTypeName} onChange={change => update('wsTypeName', change)} type={IVY_SCRIPT_TYPES.STRING} />
      </PathFieldset>
      <PathFieldset label='Authentication' path='wsAuth'>
        <Radio
          value={config.wsAuth}
          onChange={change => update('wsAuth', change as WsAuth)}
          items={Object.entries(WS_AUTH_TYPE).map(([value, label]) => ({ label, value }))}
          orientation='horizontal'
        />
      </PathFieldset>
    </ValidationCollapsible>
  );
};
