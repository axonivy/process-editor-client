import type { ComboboxItem } from '../../../../../components/widgets';
import { Combobox } from '../../../../../components/widgets';
import { PathFieldset } from '../../../common';
import { useRestRequestData } from '../../useRestRequestData';
import { useMeta, useOpenApi } from '../../../../../context';
import type { InputType } from '@axonivy/process-editor-inscription-protocol';
import { useRestResourceMeta } from '../../useRestResourceMeta';

const useShowContentTypeCombo = (mode: InputType) => {
  const { openApi } = useOpenApi();
  const resource = useRestResourceMeta();
  return !openApi || !resource.method || mode === 'RAW';
};

export const RestContentType = () => {
  const { config, updateBody } = useRestRequestData();
  const knownContentTypes = useMeta('meta/rest/contentTypes', { forBody: true }, []).data.map<ComboboxItem>(type => ({ value: type }));
  const showContentType = useShowContentTypeCombo(config.body.type);
  return (
    <>
      {showContentType && (
        <PathFieldset label='Content-Type' path='mediaType'>
          <Combobox value={config.body.mediaType} onChange={change => updateBody('mediaType', change)} items={knownContentTypes} />
        </PathFieldset>
      )}
    </>
  );
};
