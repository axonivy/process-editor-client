import { useTranslation } from 'react-i18next';
import useMaximizedCodeEditor from '../../../../browser/useMaximizedCodeEditor';
import { ScriptArea } from '../../../../widgets/code-editor/ScriptArea';
import { PathFieldset } from '../../../common/path/PathFieldset';
import { useRestRequestData } from '../../useRestRequestData';

export const RestJaxRsCode = () => {
  const { t } = useTranslation();
  const { config, update } = useRestRequestData();
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <PathFieldset label={t('part.rest.jaxRs')} path='code' controls={[maximizeCode]}>
      <ScriptArea
        maximizeState={maximizeState}
        value={config.code}
        onChange={change => update('code', change)}
        browsers={['attr', 'func', 'type']}
      />
    </PathFieldset>
  );
};
