import type { RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { RestError } from './rest-response/RestError';
import { useRestErrorData } from './useRestErrorData';
import { useValidations } from '../../../context/useValidation';
import { PathContext } from '../../../context/usePath';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { useTranslation } from 'react-i18next';

export function useRestErrorPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, resetData } = useRestErrorData();
  const validations = useValidations(['response']);
  const filteredErrorValidations = validations.filter(item => !item.path.startsWith('response.entity'));
  const compareData = (data: RestResponseData) => [data.response.clientError, data.response.statusError];
  const state = usePartState(compareData(defaultConfig), compareData(config), filteredErrorValidations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: t('label.error'), state: state, reset: { dirty, action: () => resetData() }, content: <RestErrorPart /> };
}

const RestErrorPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update } = useRestErrorData();
  return (
    <PathContext path='response'>
      <ValidationCollapsible
        label={t('label.error')}
        defaultOpen={
          config.response.clientError !== defaultConfig.response.clientError ||
          config.response.statusError !== defaultConfig.response.statusError
        }
        paths={['clientError', 'statusError']}
      >
        <RestError
          label={t('part.rest.onError')}
          value={config.response.clientError}
          onChange={change => update('clientError', change)}
          path='clientError'
        />
        <RestError
          label={t('part.rest.onNotSuccess')}
          value={config.response.statusError}
          onChange={change => update('statusError', change)}
          path='statusError'
        />
      </ValidationCollapsible>
    </PathContext>
  );
};
