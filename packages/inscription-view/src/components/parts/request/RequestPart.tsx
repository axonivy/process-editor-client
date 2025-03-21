import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useRequestData } from './useRequestData';
import type { RequestData } from '@axonivy/process-editor-inscription-protocol';
import Information from '../common/info/Information';
import { Permission } from '../common/permission/Permission';
import StartCustomFieldTable from '../common/customfield/StartCustomFieldTable';
import { useValidations } from '../../../context/useValidation';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { PathContext } from '../../../context/usePath';
import { useTranslation } from 'react-i18next';

export function useRequestPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, resetData } = useRequestData();
  const requestVal = useValidations(['request']);
  const permissionVal = useValidations(['permission']);
  const compareData = (data: RequestData) => [data];
  const state = usePartState(compareData(defaultConfig), compareData(config), [...requestVal, ...permissionVal]);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: t('part.request.title'), state: state, reset: { dirty, action: () => resetData() }, content: <RequestPart /> };
}

const RequestPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateRequest, updatePermission } = useRequestData();
  return (
    <>
      <Checkbox
        value={config.request.isHttpRequestable}
        onChange={change => updateRequest('isHttpRequestable', change)}
        label={t('part.request.startPerHttp')}
        style={{ paddingInline: 'var(--size-2)' }}
      />
      {config.request.isHttpRequestable && (
        <>
          <PathContext path='request'>
            {config.request.linkName}
            <Checkbox
              value={config.request.isVisibleOnStartList}
              onChange={change => updateRequest('isVisibleOnStartList', change)}
              label={t('part.request.showOnStartList')}
              style={{ paddingInline: 'var(--size-2)' }}
            />
            {config.request.isVisibleOnStartList && (
              <Information config={config.request} defaultConfig={defaultConfig.request} update={updateRequest} />
            )}

            <StartCustomFieldTable data={config.request.customFields} onChange={change => updateRequest('customFields', change)} />
          </PathContext>
          <Permission
            config={config.permission}
            defaultConfig={defaultConfig.permission}
            updatePermission={updatePermission}
            anonymousFieldActive={true}
          />
        </>
      )}
    </>
  );
};
