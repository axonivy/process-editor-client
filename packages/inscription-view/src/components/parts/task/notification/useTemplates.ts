import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import type { SelectItem } from '../../../widgets/select/Select';

const DEFAULT_TEMPLATE = 'Default';

export const useTemplates = () => {
  const { context } = useEditorContext();
  const templateItems = useMeta('meta/workflow/notificationTemplates', context, [DEFAULT_TEMPLATE]).data;
  const items: SelectItem[] = [];
  templateItems.forEach(template => items.push({ value: template, label: template }));
  return items;
};
