import { useQueryData } from '../useQueryData';
import useMaximizedCodeEditor from '../../../browser/useMaximizedCodeEditor';
import { PathContext } from '../../../../context/usePath';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import { MacroArea } from '../../../widgets/code-editor/MacroArea';
import { useTranslation } from 'react-i18next';

export const Condition = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateSql } = useQueryData();
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();
  return (
    <PathContext path='sql'>
      <PathCollapsible
        label={t('label.condition')}
        controls={[maximizeCode]}
        defaultOpen={config.query.sql.condition !== defaultConfig.query.sql.condition && config.query.sql.condition !== undefined}
        path='condition'
      >
        <ValidationFieldset>
          <MacroArea
            value={config.query.sql.condition}
            onChange={change => updateSql('condition', change)}
            browsers={['tablecol', 'attr']}
            maximizeState={maximizeState}
          />
        </ValidationFieldset>
      </PathCollapsible>
    </PathContext>
  );
};
