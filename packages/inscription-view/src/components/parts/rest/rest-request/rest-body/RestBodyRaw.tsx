import { MacroArea } from '../../../../../components/widgets';
import { useRestRequestData } from '../../useRestRequestData';
import { PathContext } from '../../../../../context';
import { ValidationFieldset } from '../../../../../components/parts/common';

export const RestBodyRaw = () => {
  const { config, updateBody } = useRestRequestData();
  return (
    <PathContext path='raw'>
      <ValidationFieldset>
        <MacroArea value={config.body.raw} onChange={change => updateBody('raw', change)} browsers={['attr', 'func', 'cms']} />
      </ValidationFieldset>
    </PathContext>
  );
};
