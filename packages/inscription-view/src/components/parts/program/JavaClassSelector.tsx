import type { Consumer } from '../../../types/lambda';
import type { Type } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import type { ComboboxItem } from '../../widgets/combobox/Combobox';
import { useAction } from '../../../context/useAction';
import type { FieldsetControl } from '../../widgets/fieldset/fieldset-control';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import Combobox from '../../widgets/combobox/Combobox';

type JavaClassSelectorProps = {
  javaClass: string;
  onChange: Consumer<string>;
  type: Type;
};

const JavaClassSelector = ({ javaClass, onChange, type }: JavaClassSelectorProps) => {
  const { context } = useEditorContext();
  const javaClassItems = useMeta('meta/program/types', { type: type, context }, []).data.map<ComboboxItem>(javaClass => ({
    value: javaClass.fullQualifiedName
  }));

  const newAction = useAction('newProgram');
  const openAction = useAction('openProgram');
  const openJavaClassConfig: FieldsetControl = {
    label: 'Open Java Class config',
    icon: IvyIcons.GoToSource,
    action: () => openAction(javaClass)
  };
  const createJavaClass: FieldsetControl = { label: 'Create new Java Class', icon: IvyIcons.Plus, action: () => newAction() };

  return (
    <PathCollapsible label='Java Class' path='javaClass' controls={[openJavaClassConfig, createJavaClass]} defaultOpen={javaClass !== ''}>
      <ValidationFieldset>
        <Combobox value={javaClass} onChange={item => onChange(item)} items={javaClassItems} />
      </ValidationFieldset>
    </PathCollapsible>
  );
};

export default JavaClassSelector;
