import { PathContext } from '../../../../context';
import { MacroArea } from '../../../../components/widgets';
import { PathCollapsible, ValidationFieldset } from '../../common';
import { useQueryData } from '../useQueryData';
import useMaximizedCodeEditor from '../../../browser/useMaximizedCodeEditor';

export const Condition = () => {
  const { config, defaultConfig, updateSql } = useQueryData();

  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <PathContext path='sql'>
      <PathCollapsible
        label='Condition'
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
