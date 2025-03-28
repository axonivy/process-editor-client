import type { WfResponsible } from '@axonivy/process-editor-inscription-protocol';
import { deepEqual } from '../../../../utils/equals';
import { PathCollapsible } from '../path/PathCollapsible';
import { ValidationFieldset } from '../path/validation/ValidationFieldset';
import ResponsibleSelect, { type ResponsibleSelectProps } from './ResponsibleSelect';
import { PathFieldset } from '../path/PathFieldset';
import { useTranslation } from 'react-i18next';

type ResponsibleCollapsibleProps = ResponsibleSelectProps & { defaultResponsible: WfResponsible };

export const ResponsibleCollapsible = (props: ResponsibleCollapsibleProps) => {
  const { t } = useTranslation();
  return (
    <PathCollapsible
      label={t('label.responsible')}
      path='responsible'
      defaultOpen={!deepEqual(props.responsible, props.defaultResponsible)}
    >
      <ValidationFieldset>
        <ResponsibleSelect {...props} />
      </ValidationFieldset>
    </PathCollapsible>
  );
};

export const ResponsiblePart = (props: ResponsibleSelectProps) => {
  const { t } = useTranslation();
  return (
    <PathFieldset label={t('label.responsible')} path='responsible'>
      <ResponsibleSelect {...props} />
    </PathFieldset>
  );
};
