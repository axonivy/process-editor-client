import './Part.css';
import { IvyIcons } from '@axonivy/ui-icons';
import { type AccordionControlProps, AccordionState, Button, Flex } from '@axonivy/ui-components';
import { useAccordionState, type PartProps } from './usePart';
import type { Severity } from '@axonivy/process-editor-inscription-protocol';
import { TabContent, TabList, TabRoot, type Tab } from './tab/PartTab';

export const Control = ({ name, reset, control, ...props }: Pick<PartProps, 'name' | 'reset' | 'control'> & AccordionControlProps) => {
  if (reset.dirty || control) {
    return (
      <Flex direction='row' gap={2} justifyContent='flex-end' {...props}>
        {control}
        {reset.dirty && <Button icon={IvyIcons.Undo} onClick={reset.action} title={`Reset ${name}`} aria-label={`Reset ${name}`} />}
      </Flex>
    );
  }
  return null;
};

export const State = ({ state }: Pick<PartProps, 'state'>) => (
  <AccordionState
    messages={state.validations.map(({ message, severity }) => ({
      message,
      variant: severity.toLocaleLowerCase() as Lowercase<Severity>
    }))}
    state={state.state}
  />
);

const Part = ({ parts }: { parts: PartProps[] }) => {
  const { value, updateValue } = useAccordionState(parts);
  const tabs: Tab[] = parts.map(part => ({
    id: part.name,
    name: part.name,
    content: part.content,
    reset: part.reset,
    state: part.state,
    icon: part.icon ? part.icon : IvyIcons.UserDialog
  }));

  return (
    <TabRoot tabs={tabs} value={value} onChange={updateValue}>
      <TabList tabs={tabs} />
      <TabContent tabs={tabs} />
    </TabRoot>
  );
};

export default Part;
