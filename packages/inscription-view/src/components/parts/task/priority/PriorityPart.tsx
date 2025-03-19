import { useTranslation } from 'react-i18next';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { PathFieldset } from '../../common/path/PathFieldset';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import type { PrioritySelectProps } from './PrioritySelect';
import PrioritySelect from './PrioritySelect';

export const PriorityCollapsible = (props: PrioritySelectProps) => {
  const { t } = useTranslation();
  return (
    <PathCollapsible label={t('part.task.priority')} path='priority' defaultOpen={props.priority?.level !== 'NORMAL'}>
      <ValidationFieldset>
        <PrioritySelect {...props} />
      </ValidationFieldset>
    </PathCollapsible>
  );
};

export const PriorityPart = (props: PrioritySelectProps) => {
  const { t } = useTranslation();
  return (
    <PathFieldset label={t('part.task.priority')} path='priority'>
      <PrioritySelect {...props} />
    </PathFieldset>
  );
};
