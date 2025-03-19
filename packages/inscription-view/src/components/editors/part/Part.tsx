import './Part.css';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionControlProps,
  AccordionState,
  Button,
  Flex
} from '@axonivy/ui-components';
import { ErrorBoundary } from 'react-error-boundary';
import { useAccordionState, type PartProps } from './usePart';
import type { Severity } from '@axonivy/process-editor-inscription-protocol';
import { useSticky } from './useSticky';
import ErrorFallback from '../../widgets/error/ErrorFallback';
import { useTranslation } from 'react-i18next';

const Control = ({ name, reset, control, ...props }: Pick<PartProps, 'name' | 'reset' | 'control'> & AccordionControlProps) => {
  const { t } = useTranslation();
  if (reset.dirty || control) {
    return (
      <Flex direction='row' gap={2} {...props}>
        {control}
        {reset.dirty && (
          <Button
            icon={IvyIcons.Undo}
            onClick={reset.action}
            title={t('label.resetPart', { name })}
            aria-label={t('label.resetPart', { name })}
          />
        )}
      </Flex>
    );
  }
  return null;
};

const State = ({ state }: Pick<PartProps, 'state'>) => (
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
  return (
    <Accordion type='single' collapsible value={value} onValueChange={updateValue}>
      {parts.map(part => (
        <PartItem {...part} key={part.name} />
      ))}
    </Accordion>
  );
};

const PartItem = (part: PartProps) => {
  const { ref, isSticky } = useSticky();
  return (
    <AccordionItem value={part.name} data-sticky={isSticky ? 'true' : undefined}>
      <AccordionTrigger ref={ref} control={props => <Control {...props} {...part} />} state={<State state={part.state} />}>
        {part.name}
      </AccordionTrigger>
      <AccordionContent>
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[part]}>
          <Flex direction='column' gap={3}>
            {part.content}
          </Flex>
        </ErrorBoundary>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Part;
