import useMaximizedCodeEditor from '../../../../browser/useMaximizedCodeEditor';
import { ScriptArea } from '../../../../widgets';
import { PathFieldset } from '../../../common';
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
