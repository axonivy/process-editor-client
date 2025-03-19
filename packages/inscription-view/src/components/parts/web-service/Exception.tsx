import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useWebServiceData } from './useWebServiceData';
import { deepEqual } from '../../../utils/equals';
import { PathCollapsible } from '../common/path/PathCollapsible';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { PathFieldset } from '../common/path/PathFieldset';
import { ScriptInput } from '../../widgets/code-editor/ScriptInput';
import { useTranslation } from 'react-i18next';

export const Exception = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateException } = useWebServiceData();
  return (
    <PathCollapsible path='exception' label={t('part.ws.exception')} defaultOpen={!deepEqual(config.exception, defaultConfig.exception)}>
      <Checkbox
        label={t('part.ws.exceptionHandling')}
        value={config.exception.enabled}
        onChange={change => updateException('enabled', change)}
      />
      <PathFieldset label={t('label.condition')} path='condition'>
        <ScriptInput
          value={config.exception.condition}
          onChange={change => updateException('condition', change)}
          type={IVY_SCRIPT_TYPES.BOOLEAN}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
      <PathFieldset label={t('label.message')} path='message'>
        <ScriptInput
          value={config.exception.message}
          onChange={change => updateException('message', change)}
          type={IVY_SCRIPT_TYPES.STRING}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
    </PathCollapsible>
  );
};
