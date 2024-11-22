import { useMemo } from 'react';
import type { SelectItem } from '../../../widgets';
import { Select } from '../../../widgets';
import { PathFieldset } from '../../common';
import { useTemplates } from './useTemplates';
import type { WfNotification } from '@axonivy/process-editor-inscription-protocol';

const TemplateSelect = ({ notification, onChange }: { notification: WfNotification; onChange: (value: SelectItem) => void }) => {
  const templates = useTemplates();
  const selectedTemplate = useMemo<SelectItem>(
    () => templates.find(e => e.value === notification.template) ?? { value: notification.template, label: notification.template },
    [notification.template, templates]
  );

  return (
    <PathFieldset label='Template' path='template'>
      <div className='template-select'>
        <Select value={selectedTemplate} items={templates} onChange={onChange} disabled={notification.suppress} />
      </div>
    </PathFieldset>
  );
};

export default TemplateSelect;
