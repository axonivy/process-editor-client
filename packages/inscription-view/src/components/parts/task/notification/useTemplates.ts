import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import type { SelectItem } from '../../../widgets/select/Select';

const DEFAULT_TEMPLATE = 'Default';

export const useTemplates = () => {
  const { context } = useEditorContext();
  return useMeta('meta/workflow/notificationTemplates', context, [DEFAULT_TEMPLATE]).data.map<SelectItem>(template => ({
    value: template,
    label: template
  }));
};
