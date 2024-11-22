import type { DataUpdater } from '../../../../types/lambda';
import { MacroArea, MacroInput } from '../../../../components/widgets';
import { PathFieldset } from '../path/PathFieldset';
import { useAction, useEditorContext, useMeta, usePath } from '../../../../context';
import type { SchemaKeys, SchemaPath, WorkflowType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import ClassificationCombobox, { type ClassifiedItem } from '../classification/ClassificationCombobox';
import { classifiedItemInfo } from '../../../../utils/event-code-categorie';
import { ValidationCollapsible } from '../path/validation/ValidationCollapsible';

type InformationConfig = {
  name: string;
  description: string;
  category: string;
};

type InformationProps<T> = {
  config: InformationConfig;
  defaultConfig: InformationConfig;
  update: DataUpdater<T>;
};

const toWorkflowType = (path: '' | SchemaPath | SchemaKeys): WorkflowType => {
  const location = path.toLowerCase();
  if (location.includes('request') || location.includes('start')) {
    return 'START';
  }
  if (location.includes('case')) {
    return 'CASE';
  }
  if (location.includes('task')) {
    return 'TASK';
  }
  return '' as WorkflowType;
};

const Information = <T extends InformationConfig>({ config, defaultConfig, update }: InformationProps<T>) => {
  const { context } = useEditorContext();
  const path = usePath();
  const openAction = useAction('openOrCreateCmsCategory');

  const categories = [
    { value: '', label: '<< Empty >>', info: 'Select no Category' },
    ...useMeta('meta/workflow/categoryPaths', { context, type: toWorkflowType(path) }, []).data.map<ClassifiedItem>(categroy => {
      return { ...categroy, value: categroy.path, info: classifiedItemInfo(categroy) };
    })
  ];

  return (
    <ValidationCollapsible
      label='Details'
      defaultOpen={
        config.name !== defaultConfig.name || config.description !== defaultConfig.description || config.category !== defaultConfig.category
      }
      paths={['name', 'description', 'category']}
    >
      <PathFieldset label='Name' path='name'>
        <MacroInput value={config.name} browsers={['attr', 'func', 'cms']} onChange={change => update('name', change)} />
      </PathFieldset>
      <PathFieldset label='Description' path='description'>
        <MacroArea value={config.description} browsers={['attr', 'func', 'cms']} onChange={change => update('description', change)} />
      </PathFieldset>
      <PathFieldset
        label='Category'
        path='category'
        controls={[{ label: 'Open CMS Editor', icon: IvyIcons.Cms, action: () => openAction('/Categories/' + config.category + '/name') }]}
      >
        <ClassificationCombobox
          value={config.category}
          onChange={change => update('category', change)}
          data={categories}
          icon={IvyIcons.Label}
          withBrowser={true}
        />
      </PathFieldset>
    </ValidationCollapsible>
  );
};

export default Information;
