import type { ComboboxItem, FieldsetControl } from '../../../components/widgets';
import { Combobox } from '../../../components/widgets';
import { useAction, useEditorContext, useMeta } from '../../../context';
import type { Consumer } from '../../../types/lambda';
import { PathCollapsible, ValidationFieldset } from '../common';
import type { Type } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';

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
