import useMaximizedCodeEditor from '../../../../browser/useMaximizedCodeEditor';
import { ScriptArea } from '../../../../widgets/code-editor/ScriptArea';
import { PathFieldset } from '../../../common/path/PathFieldset';
import { useRestRequestData } from '../../useRestRequestData';

export const RestJaxRsCode = () => {
  const { config, update } = useRestRequestData();
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <PathFieldset label='JAX-RS' path='code' controls={[maximizeCode]}>
      <ScriptArea
        maximizeState={maximizeState}
        value={config.code}
        onChange={change => update('code', change)}
        browsers={['attr', 'func', 'type']}
      />
    </PathFieldset>
  );
};
